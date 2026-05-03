"""
OpenClaw v3 — Skilled Browser Automation Agent
Skills: navigation, form filling, account creation, deep scraping,
        session persistence, human-like behavior, export, LLM guidance
"""

import asyncio
import base64
import csv
import io
import json
import os
import random
import string
import time
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Any, Optional

import httpx
from fastapi import FastAPI, HTTPException
from playwright.async_api import async_playwright, Browser, BrowserContext, Page, Mouse
from pydantic import BaseModel, Field

# ── Config ──
BROWSER_POOL_SIZE = int(os.getenv("BROWSER_POOL_SIZE", "3"))
MAX_PAGES_PER_CONTEXT = int(os.getenv("MAX_PAGES_PER_CONTEXT", "5"))
DEFAULT_TIMEOUT = int(os.getenv("DEFAULT_TIMEOUT", "30000"))
AGENT0_URL = os.getenv("AGENT0_URL", "http://agent0:9000")
DATA_DIR = os.getenv("OPENCLAW_DATA", "/app/data")
SESSION_DIR = os.path.join(DATA_DIR, "sessions")
os.makedirs(SESSION_DIR, exist_ok=True)

# ── Models ──

class NavigateRequest(BaseModel):
    url: str
    wait_for: Optional[str] = None
    timeout: int = DEFAULT_TIMEOUT
    screenshot: bool = False
    human_like: bool = True

class FillFormRequest(BaseModel):
    url: str
    fields: dict[str, str]
    submit_selector: Optional[str] = None
    wait_for: Optional[str] = None
    timeout: int = DEFAULT_TIMEOUT
    human_like: bool = True

class ExtractRequest(BaseModel):
    url: str
    selectors: dict[str, str]
    wait_for: Optional[str] = None
    timeout: int = DEFAULT_TIMEOUT
    screenshot: bool = False

class DeepScrapeRequest(BaseModel):
    url: str
    item_selector: str  # CSS selector for each item
    fields: dict[str, str]  # field name -> CSS selector (relative to item)
    pagination: Optional[dict] = None  # {"next_selector": "", "max_pages": 5}
    infinite_scroll: bool = False
    scroll_max: int = 10
    wait_for: Optional[str] = None
    timeout: int = DEFAULT_TIMEOUT

class CreateAccountRequest(BaseModel):
    url: str
    form_selector: Optional[str] = None
    fields: dict[str, str] = {}  # custom field overrides
    submit_selector: Optional[str] = None
    success_indicator: Optional[str] = None  # CSS selector that appears on success
    email_domain: str = "mailinator.com"
    generate_password: bool = True
    timeout: int = DEFAULT_TIMEOUT

class WorkflowStep(BaseModel):
    action: str  # navigate, fill_form, click, extract, scroll, screenshot, wait
    params: dict[str, Any] = {}

class WorkflowRequest(BaseModel):
    steps: list[WorkflowStep]
    session_id: Optional[str] = None
    screenshot_each: bool = False
    timeout: int = DEFAULT_TIMEOUT

class SmartNavigateRequest(BaseModel):
    goal: str  # Natural language goal, e.g. "Find the pricing page"
    start_url: str
    max_steps: int = 10
    timeout: int = DEFAULT_TIMEOUT

class ExportRequest(BaseModel):
    data: list[dict[str, Any]]
    format: str = "json"  # json, csv
    filename: Optional[str] = None

class ActionResponse(BaseModel):
    success: bool
    url: Optional[str] = None
    title: Optional[str] = None
    data: Optional[dict] = None
    screenshot_b64: Optional[str] = None
    html_snippet: Optional[str] = None
    error: Optional[str] = None
    duration_ms: int = 0
    session_id: Optional[str] = None

class WorkflowResponse(BaseModel):
    success: bool
    steps_completed: int
    results: list[dict]
    total_duration_ms: int
    error: Optional[str] = None

# ── Session Storage ──

class SessionStore:
    """Persistent cookie + localStorage sessions"""
    def __init__(self, session_dir: str):
        self.dir = session_dir
        os.makedirs(session_dir, exist_ok=True)

    def _path(self, session_id: str):
        return os.path.join(self.dir, f"{session_id}.json")

    def save(self, session_id: str, cookies: list, local_storage: dict):
        data = {"cookies": cookies, "local_storage": local_storage, "updated_at": time.time()}
        with open(self._path(session_id), "w") as f:
            json.dump(data, f)

    def load(self, session_id: str) -> Optional[dict]:
        path = self._path(session_id)
        if os.path.exists(path):
            with open(path) as f:
                return json.load(f)
        return None

    def list(self) -> list[str]:
        return [f.replace(".json", "") for f in os.listdir(self.dir) if f.endswith(".json")]

    def delete(self, session_id: str):
        path = self._path(session_id)
        if os.path.exists(path):
            os.remove(path)

session_store = SessionStore(SESSION_DIR)

# ── Human-like Behavior ──

async def _human_delay(min_ms: int = 100, max_ms: int = 800):
    await asyncio.sleep(random.uniform(min_ms, max_ms) / 1000)

async def _human_type(page: Page, selector: str, text: str):
    """Type like a human with variable speed and occasional pauses"""
    await page.focus(selector)
    await _human_delay(50, 200)
    for char in text:
        await page.type(selector, char, delay=random.randint(20, 120))
        if random.random() < 0.05:  # 5% chance of pause
            await _human_delay(200, 600)

async def _human_click(page: Page, selector: str, timeout: int = 5000):
    """Move mouse naturally then click. Raises if element not found within timeout."""
    elem = await page.query_selector(selector)
    if elem:
        box = await elem.bounding_box()
        if box:
            # Move to a random point within the element
            x = box["x"] + random.uniform(2, box["width"] - 2)
            y = box["y"] + random.uniform(2, box["height"] - 2)
            await page.mouse.move(x, y)
            await _human_delay(100, 400)
    else:
        raise Exception(f"Element not found: {selector}")
    await page.click(selector, timeout=timeout)

async def _random_viewport(page: Page):
    """Occasionally resize viewport slightly"""
    w = 1920 + random.randint(-50, 50)
    h = 1080 + random.randint(-30, 30)
    await page.set_viewport_size({"width": w, "height": h})

async def _scroll_like_human(page: Page, pixels: int = 800):
    """Scroll in small chunks with pauses"""
    chunk = 200
    scrolled = 0
    while scrolled < pixels:
        step = min(chunk, pixels - scrolled)
        await page.mouse.wheel(0, step)
        await _human_delay(200, 600)
        scrolled += step

# ── Browser Pool with Session Support ──

class BrowserPool:
    def __init__(self):
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.contexts: list[BrowserContext] = []
        self._lock = asyncio.Lock()
        self.session_map: dict[str, BrowserContext] = {}  # session_id -> context

    async def start(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-web-security",
                "--disable-features=IsolateOrigins,site-per-process",
            ],
        )
        for _ in range(BROWSER_POOL_SIZE):
            ctx = await self._create_context()
            self.contexts.append(ctx)

    async def _create_context(self) -> BrowserContext:
        return await self.browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            locale="en-US",
            timezone_id="Africa/Cairo",
            geolocation={"latitude": 30.0444, "longitude": 31.2357},  # Cairo
            permissions=["geolocation"],
        )

    async def stop(self):
        for ctx in self.contexts:
            await ctx.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def get_page(self, session_id: Optional[str] = None) -> tuple[Page, BrowserContext]:
        async with self._lock:
            # Reuse session context if exists
            if session_id and session_id in self.session_map:
                ctx = self.session_map[session_id]
                pages = ctx.pages
                if len(pages) < MAX_PAGES_PER_CONTEXT:
                    return await ctx.new_page(), ctx

            # Find available context
            for ctx in self.contexts:
                pages = ctx.pages
                if len(pages) < MAX_PAGES_PER_CONTEXT:
                    return await ctx.new_page(), ctx

            # Create temp context
            ctx = await self._create_context()
            self.contexts.append(ctx)
            return await ctx.new_page(), ctx

    async def load_session(self, page: Page, ctx: BrowserContext, session_id: str):
        """Load cookies and localStorage from session store"""
        data = session_store.load(session_id)
        if data:
            if data.get("cookies"):
                await ctx.add_cookies(data["cookies"])
            # localStorage is domain-specific; we'll handle per-page

    async def save_session(self, page: Page, ctx: BrowserContext, session_id: str):
        """Save cookies and localStorage to session store"""
        cookies = await ctx.cookies()
        # Get localStorage for current domain
        local_storage = await page.evaluate("() => Object.assign({}, localStorage)")
        session_store.save(session_id, cookies, local_storage)

    async def release_page(self, page: Page):
        try:
            await page.close()
        except Exception:
            pass

pool = BrowserPool()

# ── Smart Retry ──

async def with_retry(func, max_retries: int = 3, base_delay: float = 1.0):
    """Exponential backoff with jitter"""
    for attempt in range(max_retries):
        try:
            return await func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            await asyncio.sleep(delay)
    raise Exception("Max retries exceeded")

# ── LLM Guidance ──

async def _llm_guide_next_action(goal: str, page_state: dict) -> dict:
    """Ask Agent0/Grok what to do next"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{AGENT0_URL}/execute",
                json={
                    "agent_id": "openclaw-navigator",
                    "agent_name": "Browser Navigator",
                    "system_prompt": """You are a web navigation AI. Given a user's goal and the current page state, decide the next action.
Return ONLY a JSON object with this structure:
{"action": "click|fill|scroll|navigate|wait|done", "selector": "css selector", "value": "text to type if filling", "url": "url if navigating", "reason": "why this action"}""",
                    "user_prompt": f"Goal: {goal}\n\nCurrent page:\nTitle: {page_state.get('title')}\nURL: {page_state.get('url')}\n\nVisible elements:\n{page_state.get('elements', '')}",
                    "temperature": 0.2,
                    "max_tokens": 500,
                },
            )
            result = response.json()
            if result.get("success"):
                content = result["content"]
                # Extract JSON from response
                import re
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
    except Exception:
        pass
    return {"action": "done", "reason": "LLM guidance failed"}

# ── FastAPI App ──

@asynccontextmanager
async def lifespan(app: FastAPI):
    await pool.start()
    yield
    await pool.stop()

app = FastAPI(title="OpenClaw", version="3.0.0", lifespan=lifespan)

# ── Helpers ──

async def _take_screenshot(page: Page) -> str:
    screenshot = await page.screenshot(full_page=False)
    return base64.b64encode(screenshot).decode("utf-8")

async def _get_html_snippet(page: Page, max_chars: int = 5000) -> str:
    html = await page.content()
    return html[:max_chars]

async def _get_visible_elements(page: Page) -> str:
    """Get a list of clickable elements for LLM context"""
    elements = await page.query_selector_all("a, button, input, select, textarea")
    info = []
    for i, el in enumerate(elements[:30]):  # Limit to 30 elements
        try:
            tag = await el.evaluate("el => el.tagName.toLowerCase()")
            text = await el.text_content()
            href = await el.get_attribute("href") if tag == "a" else None
            placeholder = await el.get_attribute("placeholder")
            desc = text.strip()[:50] if text else (placeholder or href or "")
            info.append(f"[{i}] <{tag}> {desc}")
        except Exception:
            pass
    return "\n".join(info)

# ── Core Endpoints ──

@app.post("/navigate", response_model=ActionResponse)
async def navigate(req: NavigateRequest):
    start = time.time()
    page, ctx = None, None
    try:
        page, ctx = await pool.get_page()
        if req.human_like:
            await _random_viewport(page)
            await _human_delay(200, 500)

        await page.goto(req.url, wait_until="networkidle", timeout=req.timeout)
        if req.wait_for:
            await page.wait_for_selector(req.wait_for, timeout=req.timeout)
        if req.human_like:
            await _human_delay(300, 1000)

        screenshot_b64 = None
        if req.screenshot:
            screenshot_b64 = await _take_screenshot(page)

        return ActionResponse(
            success=True, url=page.url, title=await page.title(),
            screenshot_b64=screenshot_b64,
            html_snippet=await _get_html_snippet(page),
            duration_ms=int((time.time() - start) * 1000),
        )
    except Exception as e:
        return ActionResponse(success=False, error=str(e), duration_ms=int((time.time() - start) * 1000))
    finally:
        if page:
            await pool.release_page(page)

@app.post("/extract", response_model=ActionResponse)
async def extract(req: ExtractRequest):
    start = time.time()
    page, ctx = None, None
    try:
        page, ctx = await pool.get_page()
        await page.goto(req.url, wait_until="networkidle", timeout=req.timeout)
        if req.wait_for:
            await page.wait_for_selector(req.wait_for, timeout=req.timeout)

        data = {}
        for key, selector in req.selectors.items():
            try:
                elements = await page.query_selector_all(selector)
                texts = []
                for el in elements:
                    text = await el.text_content()
                    if text:
                        texts.append(text.strip())
                data[key] = texts if len(texts) > 1 else (texts[0] if texts else None)
            except Exception as e:
                data[key] = f"ERROR: {e}"

        screenshot_b64 = None
        if req.screenshot:
            screenshot_b64 = await _take_screenshot(page)

        return ActionResponse(
            success=True, url=page.url, title=await page.title(),
            data=data, screenshot_b64=screenshot_b64,
            duration_ms=int((time.time() - start) * 1000),
        )
    except Exception as e:
        return ActionResponse(success=False, error=str(e), duration_ms=int((time.time() - start) * 1000))
    finally:
        if page:
            await pool.release_page(page)

@app.post("/fill-form", response_model=ActionResponse)
async def fill_form(req: FillFormRequest):
    start = time.time()
    page, ctx = None, None
    try:
        page, ctx = await pool.get_page()
        await page.goto(req.url, wait_until="networkidle", timeout=req.timeout)

        for selector, value in req.fields.items():
            if req.human_like:
                await _human_type(page, selector, value)
            else:
                await page.fill(selector, value)
            await _human_delay(100, 300)

        if req.submit_selector:
            click_timeout = min(req.timeout, 10000)
            if req.human_like:
                await _human_click(page, req.submit_selector, timeout=click_timeout)
            else:
                await page.click(req.submit_selector, timeout=click_timeout)
            try:
                await page.wait_for_load_state("networkidle", timeout=req.timeout)
            except Exception:
                pass  # Form may have submitted without full load

        if req.wait_for:
            await page.wait_for_selector(req.wait_for, timeout=req.timeout)

        return ActionResponse(
            success=True, url=page.url, title=await page.title(),
            duration_ms=int((time.time() - start) * 1000),
        )
    except Exception as e:
        return ActionResponse(success=False, error=str(e), duration_ms=int((time.time() - start) * 1000))
    finally:
        if page:
            await pool.release_page(page)

@app.post("/deep-scrape", response_model=ActionResponse)
async def deep_scrape(req: DeepScrapeRequest):
    """Scrape with pagination or infinite scroll"""
    start = time.time()
    page, ctx = None, None
    all_items = []
    try:
        page, ctx = await pool.get_page()
        await page.goto(req.url, wait_until="networkidle", timeout=req.timeout)
        if req.wait_for:
            await page.wait_for_selector(req.wait_for, timeout=req.timeout)

        page_num = 1
        max_pages = req.pagination.get("max_pages", 5) if req.pagination else 1

        while page_num <= max_pages:
            # Extract items on current page
            items = await page.query_selector_all(req.item_selector)
            for item in items:
                record = {}
                for field_name, field_selector in req.fields.items():
                    try:
                        el = await item.query_selector(field_selector)
                        if el:
                            text = await el.text_content()
                            record[field_name] = text.strip() if text else None
                        else:
                            record[field_name] = None
                    except Exception:
                        record[field_name] = None
                all_items.append(record)

            if req.infinite_scroll and page_num < req.scroll_max:
                # Scroll and check for new items
                prev_count = len(all_items)
                await _scroll_like_human(page, 800)
                await _human_delay(500, 1500)
                # Check if new items loaded
                items = await page.query_selector_all(req.item_selector)
                if len(items) <= prev_count:
                    break
                page_num += 1
                continue

            if req.pagination and page_num < max_pages:
                next_sel = req.pagination.get("next_selector")
                try:
                    next_btn = await page.query_selector(next_sel)
                    if next_btn:
                        await _human_click(page, next_sel)
                        await _human_delay(1000, 2000)
                        page_num += 1
                    else:
                        break
                except Exception:
                    break
            else:
                break

        return ActionResponse(
            success=True, url=page.url, title=await page.title(),
            data={"items": all_items, "total": len(all_items), "pages": page_num},
            duration_ms=int((time.time() - start) * 1000),
        )
    except Exception as e:
        return ActionResponse(success=False, error=str(e), duration_ms=int((time.time() - start) * 1000))
    finally:
        if page:
            await pool.release_page(page)

@app.post("/create-account", response_model=ActionResponse)
async def create_account(req: CreateAccountRequest):
    """Automated account creation with generated credentials"""
    start = time.time()
    page, ctx = None, None
    try:
        # Generate credentials
        timestamp = str(int(time.time()))
        random_suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
        email = f"hv_{random_suffix}_{timestamp[:6]}@{req.email_domain}"
        password = "".join(random.choices(string.ascii_letters + string.digits + "!@#$%^&*", k=16)) if req.generate_password else req.fields.get("password", "TempPass123!")

        page, ctx = await pool.get_page()
        await page.goto(req.url, wait_until="networkidle", timeout=req.timeout)

        # Auto-detect common fields if not specified
        fields = dict(req.fields)
        fields.setdefault("email", email)
        fields.setdefault("password", password)
        fields.setdefault("confirm_password", password)
        fields.setdefault("username", f"user_{random_suffix}")
        fields.setdefault("first_name", "Hotel")
        fields.setdefault("last_name", "Manager")
        fields.setdefault("company", "Hotels Vendors Partner")
        fields.setdefault("phone", f"+20{random.randint(100000000, 999999999)}")

        form_sel = req.form_selector or "form"
        form = await page.query_selector(form_sel)
        if not form:
            return ActionResponse(success=False, error="No form found on page", duration_ms=int((time.time() - start) * 1000))

        # Find all input fields in form
        inputs = await form.query_selector_all("input, select, textarea")
        for inp in inputs:
            try:
                input_type = await inp.get_attribute("type") or "text"
                name = await inp.get_attribute("name") or ""
                placeholder = await inp.get_attribute("placeholder") or ""
                id_attr = await inp.get_attribute("id") or ""
                selector = f"#{id_attr}" if id_attr else f"[name='{name}']"

                key = name.lower() or placeholder.lower() or id_attr.lower()

                if any(k in key for k in ["email", "e-mail"]):
                    await _human_type(page, selector, email)
                elif any(k in key for k in ["password", "passwd"]):
                    if "confirm" in key or "repeat" in key:
                        await _human_type(page, selector, password)
                    else:
                        await _human_type(page, selector, password)
                elif any(k in key for k in ["user", "login"]):
                    await _human_type(page, selector, fields.get("username", email))
                elif any(k in key for k in ["first", "fname"]):
                    await _human_type(page, selector, fields.get("first_name", "Hotel"))
                elif any(k in key for k in ["last", "lname", "surname", "family"]):
                    await _human_type(page, selector, fields.get("last_name", "Manager"))
                elif any(k in key for k in ["company", "org", "business"]):
                    await _human_type(page, selector, fields.get("company", "Hotels Vendors"))
                elif any(k in key for k in ["phone", "mobile", "tel"]):
                    await _human_type(page, selector, fields.get("phone", "+201000000000"))
                elif input_type == "checkbox":
                    await page.check(selector)
                elif input_type == "radio":
                    pass  # Skip unless specified
            except Exception:
                pass

        # Submit
        submit = req.submit_selector or "button[type='submit'], input[type='submit'], button"
        click_timeout = min(req.timeout, 10000)
        await _human_click(page, submit, timeout=click_timeout)
        try:
            await page.wait_for_load_state("networkidle", timeout=req.timeout)
        except Exception:
            pass  # Form may have submitted without full load

        # Check success
        success = True
        if req.success_indicator:
            try:
                await page.wait_for_selector(req.success_indicator, timeout=5000)
            except Exception:
                success = False

        return ActionResponse(
            success=success,
            url=page.url,
            title=await page.title(),
            data={"email": email, "password": password, "username": fields.get("username")},
            duration_ms=int((time.time() - start) * 1000),
        )
    except Exception as e:
        return ActionResponse(success=False, error=str(e), duration_ms=int((time.time() - start) * 1000))
    finally:
        if page:
            await pool.release_page(page)

@app.post("/workflow", response_model=WorkflowResponse)
async def workflow(req: WorkflowRequest):
    """Execute a multi-step workflow with session persistence"""
    start = time.time()
    page, ctx = None, None
    results = []
    session_id = req.session_id or f"sess_{int(time.time())}_{random.randint(1000,9999)}"

    try:
        page, ctx = await pool.get_page(session_id)

        # Load session if exists
        if req.session_id:
            await pool.load_session(page, ctx, session_id)

        for i, step in enumerate(req.steps):
            step_start = time.time()
            result = {"step": i + 1, "action": step.action, "success": True, "data": {}}

            try:
                if step.action == "navigate":
                    url = step.params.get("url")
                    await page.goto(url, wait_until="networkidle", timeout=req.timeout)
                    result["data"] = {"url": page.url, "title": await page.title()}

                elif step.action == "fill":
                    selector = step.params.get("selector")
                    value = step.params.get("value")
                    await _human_type(page, selector, value)

                elif step.action == "click":
                    selector = step.params.get("selector")
                    await _human_click(page, selector)
                    await _human_delay(300, 1000)

                elif step.action == "extract":
                    selectors = step.params.get("selectors", {})
                    data = {}
                    for key, sel in selectors.items():
                        el = await page.query_selector(sel)
                        data[key] = (await el.text_content()).strip() if el else None
                    result["data"] = data

                elif step.action == "scroll":
                    pixels = step.params.get("pixels", 800)
                    await _scroll_like_human(page, pixels)

                elif step.action == "screenshot":
                    result["data"] = {"screenshot_b64": await _take_screenshot(page)}

                elif step.action == "wait":
                    ms = step.params.get("ms", 1000)
                    await asyncio.sleep(ms / 1000)

                elif step.action == "wait_for":
                    selector = step.params.get("selector")
                    await page.wait_for_selector(selector, timeout=req.timeout)

                result["duration_ms"] = int((time.time() - step_start) * 1000)
            except Exception as e:
                result["success"] = False
                result["error"] = str(e)

            results.append(result)
            if req.screenshot_each:
                result["data"]["screenshot_b64"] = await _take_screenshot(page)

        # Save session
        await pool.save_session(page, ctx, session_id)

        return WorkflowResponse(
            success=all(r["success"] for r in results),
            steps_completed=len(results),
            results=results,
            total_duration_ms=int((time.time() - start) * 1000),
        )
    except Exception as e:
        return WorkflowResponse(success=False, steps_completed=len(results), results=results, total_duration_ms=int((time.time() - start) * 1000), error=str(e))
    finally:
        if page:
            await pool.release_page(page)

@app.post("/smart-navigate")
async def smart_navigate(req: SmartNavigateRequest):
    """LLM-guided navigation to achieve a goal"""
    start = time.time()
    page, ctx = None, None
    actions_taken = []
    try:
        page, ctx = await pool.get_page()
        await page.goto(req.start_url, wait_until="networkidle", timeout=req.timeout)

        for step in range(req.max_steps):
            # Get page state
            title = await page.title()
            url = page.url
            elements = await _get_visible_elements(page)

            # Ask LLM what to do
            guidance = await _llm_guide_next_action(
                req.goal,
                {"title": title, "url": url, "elements": elements}
            )

            action = guidance.get("action", "done")
            reason = guidance.get("reason", "")
            actions_taken.append({"step": step + 1, "action": action, "reason": reason})

            if action == "done":
                break
            elif action == "click":
                selector = guidance.get("selector", "")
                if selector:
                    await _human_click(page, selector)
                    await _human_delay(500, 1500)
            elif action == "fill":
                selector = guidance.get("selector", "")
                value = guidance.get("value", "")
                if selector:
                    await _human_type(page, selector, value)
            elif action == "navigate":
                new_url = guidance.get("url", "")
                if new_url:
                    await page.goto(new_url, wait_until="networkidle", timeout=req.timeout)
            elif action == "scroll":
                await _scroll_like_human(page, 800)
            elif action == "wait":
                await _human_delay(1000, 2000)

        return ActionResponse(
            success=True,
            url=page.url,
            title=await page.title(),
            data={"actions": actions_taken, "goal": req.goal},
            duration_ms=int((time.time() - start) * 1000),
        )
    except Exception as e:
        return ActionResponse(success=False, error=str(e), duration_ms=int((time.time() - start) * 1000))
    finally:
        if page:
            await pool.release_page(page)

@app.post("/export")
async def export_data(req: ExportRequest):
    """Export scraped data to JSON or CSV"""
    try:
        if req.format == "csv":
            if not req.data:
                return {"success": False, "error": "No data to export"}
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=req.data[0].keys())
            writer.writeheader()
            writer.writerows(req.data)
            content = output.getvalue()
            b64 = base64.b64encode(content.encode()).decode()
            return {
                "success": True,
                "format": "csv",
                "filename": req.filename or f"export_{int(time.time())}.csv",
                "rows": len(req.data),
                "content_b64": b64,
            }
        else:
            json_str = json.dumps(req.data, indent=2, ensure_ascii=False)
            b64 = base64.b64encode(json_str.encode()).decode()
            return {
                "success": True,
                "format": "json",
                "filename": req.filename or f"export_{int(time.time())}.json",
                "rows": len(req.data),
                "content_b64": b64,
            }
    except Exception as e:
        return {"success": False, "error": str(e)}

# ── Session Management ──

@app.get("/sessions")
async def list_sessions():
    return {"sessions": session_store.list()}

@app.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    session_store.delete(session_id)
    return {"success": True}

@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    data = session_store.load(session_id)
    return {"success": bool(data), "session": data}

# ── Legacy Endpoints ──

@app.post("/search")
async def search(req: ExtractRequest):
    """Legacy search - uses extract internally"""
    return await extract(req)

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "version": "3.0.0",
        "browser_pool_size": len(pool.contexts),
        "sessions": len(session_store.list()),
        "skills": [
            "navigation", "form_filling", "data_extraction",
            "deep_scraping", "account_creation", "workflow_automation",
            "session_persistence", "human_like_behavior", "llm_guidance",
            "export",
        ],
    }

@app.post("/screenshot")
async def screenshot(req: NavigateRequest):
    req.screenshot = True
    return await navigate(req)
