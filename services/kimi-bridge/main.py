"""
Kimi Bridge — Uses your existing Kimi Code CLI $40 subscription
Starts kimi web server, automates the browser UI with Playwright,
exposes a clean HTTP API for the swarm to call.
"""

import asyncio
import os
import subprocess
import time
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from pydantic import BaseModel

KIMI_WEB_PORT = int(os.getenv("KIMI_WEB_PORT", "5494"))
KIMI_WEB_AUTH = os.getenv("KIMI_WEB_AUTH", "kimi-bridge-token")
KIMI_CONFIG_DIR = os.path.expanduser("~/.kimi")

kimi_web_process: Optional[subprocess.Popen] = None


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    model: str = "kimi-k2-6"
    messages: list[ChatMessage]
    temperature: float = 0.3
    max_tokens: int = 4096


class ChatResponse(BaseModel):
    content: str
    model: str
    provider: str = "kimi-bridge"
    latency_ms: int


async def start_kimi_web():
    global kimi_web_process
    subprocess.run(["pkill", "-f", "kimi web"], capture_output=True)
    await asyncio.sleep(1)

    env = os.environ.copy()
    env["KIMI_CONFIG_DIR"] = KIMI_CONFIG_DIR

    kimi_web_process = subprocess.Popen(
        ["kimi", "web", "--port", str(KIMI_WEB_PORT), "--no-open", "--auth-token", KIMI_WEB_AUTH, "--lan-only"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env,
    )

    import httpx
    for _ in range(30):
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(f"http://127.0.0.1:{KIMI_WEB_PORT}/healthz", timeout=2)
                if resp.status_code == 200:
                    print(f"[KimiBridge] kimi web ready on port {KIMI_WEB_PORT}")
                    return
        except Exception:
            pass
        await asyncio.sleep(1)

    raise RuntimeError("kimi web failed to start")


def stop_kimi_web():
    global kimi_web_process
    if kimi_web_process:
        kimi_web_process.terminate()
        try:
            kimi_web_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            kimi_web_process.kill()
        kimi_web_process = None


class KimiBrowser:
    def __init__(self):
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        self._lock = asyncio.Lock()

    async def start(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
        )
        self.context = await self.browser.new_context(
            viewport={"width": 1280, "height": 800},
        )
        self.page = await self.context.new_page()
        await self.page.goto(f"http://127.0.0.1:{KIMI_WEB_PORT}?token={KIMI_WEB_AUTH}")
        await self.page.wait_for_load_state("networkidle")
        await asyncio.sleep(3)
        print("[KimiBridge] Browser automation ready")

    async def stop(self):
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def send_message(self, prompt: str) -> str:
        async with self._lock:
            if not self.page:
                raise RuntimeError("Browser not started")

            selectors = [
                "textarea[placeholder]",
                "[data-testid='chat-input']",
                "div[contenteditable='true']",
                "textarea",
            ]

            input_el = None
            for selector in selectors:
                try:
                    input_el = await self.page.query_selector(selector)
                    if input_el:
                        break
                except Exception:
                    continue

            if not input_el:
                screenshot = await self.page.screenshot()
                with open("/tmp/kimi-bridge-debug.png", "wb") as f:
                    f.write(screenshot)
                raise RuntimeError("Chat input not found. Debug screenshot saved.")

            await input_el.fill(prompt)
            await asyncio.sleep(0.5)
            await input_el.press("Enter")

            start_time = time.time()
            max_wait = 120
            last_response = ""

            while time.time() - start_time < max_wait:
                await asyncio.sleep(2)
                try:
                    messages = await self.page.query_selector_all(".message, .chat-message, .bubble, [class*='message']")
                    if messages:
                        last_msg = messages[-1]
                        text = await last_msg.text_content()
                        if text and text != last_response and len(text) > len(prompt):
                            last_response = text
                            typing = await self.page.query_selector(".typing, .loading, [class*='typing']")
                            if not typing:
                                return last_response.strip()
                except Exception:
                    pass

            return last_response.strip() or "Response timed out"


browser = KimiBrowser()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[KimiBridge] Starting kimi web server...")
    await start_kimi_web()
    print("[KimiBridge] Starting browser automation...")
    await browser.start()
    yield
    print("[KimiBridge] Shutting down...")
    await browser.stop()
    stop_kimi_web()


app = FastAPI(title="Kimi Bridge", version="1.0.0", lifespan=lifespan)


@app.post("/v1/chat/completions")
async def chat_completions(req: ChatRequest):
    start = time.time()

    system_msg = ""
    user_msgs = []
    for msg in req.messages:
        if msg.role == "system":
            system_msg = msg.content
        elif msg.role == "user":
            user_msgs.append(msg.content)

    prompt = ""
    if system_msg:
        prompt += f"[System: {system_msg}]\n\n"
    prompt += "\n\n".join(user_msgs)

    try:
        content = await browser.send_message(prompt)
        latency = int((time.time() - start) * 1000)
        return ChatResponse(content=content, model=req.model, latency_ms=latency)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "healthy", "kimi_web_port": KIMI_WEB_PORT}
