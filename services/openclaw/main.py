"""
OpenClaw — Browser Automation Bridge for Hotels Vendors Swarm
Provides: page navigation, form filling, data extraction, screenshot capture
"""

import asyncio
import base64
import hashlib
import json
import os
from contextlib import asynccontextmanager
from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from pydantic import BaseModel, Field

# ── Config ──
BROWSER_POOL_SIZE = int(os.getenv("BROWSER_POOL_SIZE", "2"))
MAX_PAGES_PER_CONTEXT = int(os.getenv("MAX_PAGES_PER_CONTEXT", "5"))
DEFAULT_TIMEOUT = int(os.getenv("DEFAULT_TIMEOUT", "30000"))

# ── Models ──

class NavigateRequest(BaseModel):
    url: str
    wait_for: Optional[str] = None  # CSS selector to wait for
    timeout: int = DEFAULT_TIMEOUT
    screenshot: bool = False

class FillFormRequest(BaseModel):
    url: str
    fields: dict[str, str]  # selector -> value
    submit_selector: Optional[str] = None
    wait_for: Optional[str] = None
    timeout: int = DEFAULT_TIMEOUT

class ExtractRequest(BaseModel):
    url: str
    selectors: dict[str, str]  # key -> CSS selector
    wait_for: Optional[str] = None
    timeout: int = DEFAULT_TIMEOUT
    screenshot: bool = False

class SearchRequest(BaseModel):
    query: str
    engine: str = "google"  # google, duckduckgo
    max_results: int = 10
    timeout: int = DEFAULT_TIMEOUT

class ActionResponse(BaseModel):
    success: bool
    url: Optional[str] = None
    title: Optional[str] = None
    data: Optional[dict] = None
    screenshot_b64: Optional[str] = None
    html_snippet: Optional[str] = None
    error: Optional[str] = None
    duration_ms: int = 0

# ── Browser Pool ──

class BrowserPool:
    def __init__(self):
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.contexts: list[BrowserContext] = []
        self._lock = asyncio.Lock()

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
            ctx = await self.browser.new_context(
                viewport={"width": 1920, "height": 1080},
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
            )
            self.contexts.append(ctx)

    async def stop(self):
        for ctx in self.contexts:
            await ctx.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def get_page(self) -> Page:
        async with self._lock:
            for ctx in self.contexts:
                pages = ctx.pages
                if len(pages) < MAX_PAGES_PER_CONTEXT:
                    return await ctx.new_page()
            # All contexts full — create temp context
            ctx = await self.browser.new_context()
            self.contexts.append(ctx)
            return await ctx.new_page()

    async def release_page(self, page: Page):
        try:
            await page.close()
        except Exception:
            pass

pool = BrowserPool()

# ── FastAPI App ──

@asynccontextmanager
async def lifespan(app: FastAPI):
    await pool.start()
    yield
    await pool.stop()

app = FastAPI(title="OpenClaw", version="2.0.0", lifespan=lifespan)

# ── Helpers ──

async def _take_screenshot(page: Page) -> str:
    screenshot = await page.screenshot(full_page=False)
    return base64.b64encode(screenshot).decode("utf-8")

async def _get_html_snippet(page: Page, max_chars: int = 5000) -> str:
    html = await page.content()
    return html[:max_chars]

# ── Endpoints ──

@app.post("/navigate", response_model=ActionResponse)
async def navigate(req: NavigateRequest):
    import time
    start = time.time()
    page = None
    try:
        page = await pool.get_page()
        await page.goto(req.url, wait_until="networkidle", timeout=req.timeout)
        if req.wait_for:
            await page.wait_for_selector(req.wait_for, timeout=req.timeout)

        screenshot_b64 = None
        if req.screenshot:
            screenshot_b64 = await _take_screenshot(page)

        return ActionResponse(
            success=True,
            url=page.url,
            title=await page.title(),
            screenshot_b64=screenshot_b64,
            html_snippet=await _get_html_snippet(page),
            duration_ms=int((time.time() - start) * 1000),
        )
    except Exception as e:
        return ActionResponse(
            success=False,
            error=str(e),
            duration_ms=int((time.time() - start) * 1000),
        )
    finally:
        if page:
            await pool.release_page(page)

@app.post("/extract", response_model=ActionResponse)
async def extract(req: ExtractRequest):
    import time
    start = time.time()
    page = None
    try:
        page = await pool.get_page()
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
            success=True,
            url=page.url,
            title=await page.title(),
            data=data,
            screenshot_b64=screenshot_b64,
            duration_ms=int((time.time() - start) * 1000),
        )
    except Exception as e:
        return ActionResponse(
            success=False,
            error=str(e),
            duration_ms=int((time.time() - start) * 1000),
        )
    finally:
        if page:
            await pool.release_page(page)

@app.post("/fill-form", response_model=ActionResponse)
async def fill_form(req: FillFormRequest):
    import time
    start = time.time()
    page = None
    try:
        page = await pool.get_page()
        await page.goto(req.url, wait_until="networkidle", timeout=req.timeout)

        for selector, value in req.fields.items():
            await page.fill(selector, value)

        if req.submit_selector:
            await page.click(req.submit_selector)
            await page.wait_for_load_state("networkidle")

        if req.wait_for:
            await page.wait_for_selector(req.wait_for, timeout=req.timeout)

        return ActionResponse(
            success=True,
            url=page.url,
            title=await page.title(),
            duration_ms=int((time.time() - start) * 1000),
        )
    except Exception as e:
        return ActionResponse(
            success=False,
            error=str(e),
            duration_ms=int((time.time() - start) * 1000),
        )
    finally:
        if page:
            await pool.release_page(page)

@app.post("/search", response_model=ActionResponse)
async def search(req: SearchRequest):
    import time
    start = time.time()
    page = None
    try:
        page = await pool.get_page()

        if req.engine == "duckduckgo":
            search_url = f"https://duckduckgo.com/html/?q={req.query.replace(' ', '+')}"
        else:
            search_url = f"https://www.google.com/search?q={req.query.replace(' ', '+')}"

        await page.goto(search_url, wait_until="networkidle", timeout=req.timeout)

        # Extract search results
        results = []
        if req.engine == "duckduckgo":
            links = await page.query_selector_all(".result__a")
            snippets = await page.query_selector_all(".result__snippet")
            for i, link in enumerate(links[:req.max_results]):
                href = await link.get_attribute("href")
                title = await link.text_content()
                snippet = await snippets[i].text_content() if i < len(snippets) else ""
                results.append({"title": title, "url": href, "snippet": snippet})
        else:
            # Google results
            links = await page.query_selector_all("h3")
            for link in links[:req.max_results]:
                title = await link.text_content()
                parent = await link.evaluate("el => el.closest('a')")
                href = parent.get("href") if parent else None
                results.append({"title": title, "url": href})

        return ActionResponse(
            success=True,
            url=page.url,
            data={"results": results, "query": req.query, "engine": req.engine},
            duration_ms=int((time.time() - start) * 1000),
        )
    except Exception as e:
        return ActionResponse(
            success=False,
            error=str(e),
            duration_ms=int((time.time() - start) * 1000),
        )
    finally:
        if page:
            await pool.release_page(page)

@app.get("/health")
async def health():
    return {"status": "healthy", "browser_pool_size": len(pool.contexts)}

@app.post("/screenshot")
async def screenshot(req: NavigateRequest):
    req.screenshot = True
    return await navigate(req)
