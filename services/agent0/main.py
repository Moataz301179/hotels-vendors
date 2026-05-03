"""
Agent0 — Lightweight Agent Executor for Hotels Vendors Swarm
Handles: LLM calls, tool execution, memory retrieval, result formatting
"""

import json
import os
import time
from typing import Any, Optional

import httpx
import redis
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# ── Config ──
KIMI_API_KEY = os.getenv("KIMI_API_KEY", "")
XAI_API_KEY = os.getenv("XAI_API_KEY", "")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Redis connection
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

# ── Models ──

class LLMMessage(BaseModel):
    role: str  # system, user, assistant
    content: str

class ToolCall(BaseModel):
    name: str
    arguments: dict[str, Any]

class AgentRequest(BaseModel):
    agent_id: str
    agent_name: str
    system_prompt: str
    user_prompt: str
    model: str = "kimi-k2-6"  # or "grok-4-1-fast"
    temperature: float = 0.3
    max_tokens: int = 4096
    tools: Optional[list[dict]] = None
    memory_context: Optional[str] = None
    job_id: Optional[str] = None

class AgentResponse(BaseModel):
    success: bool
    content: str
    tool_calls: Optional[list[ToolCall]] = None
    model_used: str
    latency_ms: int
    tokens_used: Optional[int] = None
    error: Optional[str] = None

# ── LLM Providers ──

async def call_kimi(messages: list[dict], temperature: float, max_tokens: int) -> dict:
    """Call Kimi API (Moonshot AI)"""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.moonshot.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {KIMI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "kimi-k2-6",
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            },
        )
        response.raise_for_status()
        return response.json()

async def call_grok(messages: list[dict], temperature: float, max_tokens: int) -> dict:
    """Call xAI Grok API"""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.x.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {XAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "grok-4-1-fast",
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            },
        )
        response.raise_for_status()
        return response.json()

async def call_llm(
    model: str,
    messages: list[dict],
    temperature: float,
    max_tokens: int,
) -> tuple[str, dict]:
    """Route to correct provider with fallback"""
    errors = []

    # Try requested model first
    providers = []
    if model.startswith("kimi"):
        providers = [("kimi", call_kimi), ("grok", call_grok)]
    else:
        providers = [("grok", call_grok), ("kimi", call_kimi)]

    for provider_name, call_fn in providers:
        try:
            result = await call_fn(messages, temperature, max_tokens)
            content = result["choices"][0]["message"]["content"]
            usage = result.get("usage", {})
            return content, {
                "model_used": provider_name,
                "tokens_used": usage.get("total_tokens"),
            }
        except Exception as e:
            errors.append(f"{provider_name}: {str(e)}")
            continue

    raise Exception(f"All providers failed: {'; '.join(errors)}")

# ── Memory Helpers ──

def get_memory_context(agent_id: str, query: str, limit: int = 5) -> str:
    """Retrieve relevant memories from Redis"""
    try:
        # Simple keyword-based retrieval (replace with vector search later)
        pattern = f"swarm:memory:*"
        keys = redis_client.scan_iter(match=pattern, count=100)
        memories = []
        for key in keys:
            data = redis_client.get(key)
            if data:
                mem = json.loads(data)
                if mem.get("agent_id") == agent_id or mem.get("category") == "general":
                    memories.append(mem)

        # Sort by recency and relevance (simplified)
        memories.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        top = memories[:limit]

        if not top:
            return ""

        lines = ["## Relevant Context from Memory:"]
        for m in top:
            lines.append(f"- [{m.get('memory_type')}] {m.get('content', '')[:200]}")
        return "\n".join(lines)
    except Exception as e:
        return f"# Memory retrieval error: {e}"

def store_memory(agent_id: str, agent_name: str, content: str, memory_type: str, category: str, job_id: Optional[str] = None):
    """Store a memory in Redis with TTL"""
    try:
        mem_id = f"swarm:memory:{agent_id}:{int(time.time() * 1000)}"
        data = {
            "agent_id": agent_id,
            "agent_name": agent_name,
            "content": content,
            "memory_type": memory_type,
            "category": category,
            "job_id": job_id,
            "created_at": time.time(),
        }
        redis_client.setex(mem_id, 7 * 24 * 3600, json.dumps(data))  # 7 days TTL
    except Exception as e:
        print(f"Memory store error: {e}")

# ── FastAPI App ──

app = FastAPI(title="Agent0", version="2.0.0")

@app.post("/execute", response_model=AgentResponse)
async def execute_agent(req: AgentRequest):
    start = time.time()

    try:
        # Build messages
        messages = [{"role": "system", "content": req.system_prompt}]

        # Add memory context if available
        if req.memory_context:
            messages.append({"role": "system", "content": f"Context:\n{req.memory_context}"})
        else:
            memory = get_memory_context(req.agent_id, req.user_prompt)
            if memory:
                messages.append({"role": "system", "content": memory})

        messages.append({"role": "user", "content": req.user_prompt})

        # Call LLM
        content, meta = await call_llm(
            req.model,
            messages,
            req.temperature,
            req.max_tokens,
        )

        # Try to parse tool calls from content
        tool_calls = None
        if "TOOL_CALL:" in content or "tool_call" in content.lower():
            try:
                # Extract JSON tool calls
                import re
                json_match = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
                if json_match:
                    tool_data = json.loads(json_match.group(1))
                    if isinstance(tool_data, list):
                        tool_calls = [ToolCall(**t) for t in tool_data]
                    elif isinstance(tool_data, dict):
                        tool_calls = [ToolCall(**tool_data)]
            except Exception:
                pass

        # Store result as memory
        store_memory(
            req.agent_id,
            req.agent_name,
            f"Task: {req.user_prompt[:200]}... Result: {content[:500]}",
            "ACTION",
            "execution",
            req.job_id,
        )

        return AgentResponse(
            success=True,
            content=content,
            tool_calls=tool_calls,
            model_used=meta["model_used"],
            latency_ms=int((time.time() - start) * 1000),
            tokens_used=meta.get("tokens_used"),
        )

    except Exception as e:
        return AgentResponse(
            success=False,
            content="",
            model_used=req.model,
            latency_ms=int((time.time() - start) * 1000),
            error=str(e),
        )

@app.post("/execute-batch")
async def execute_batch(requests: list[AgentRequest]):
    """Execute multiple agents in parallel"""
    import asyncio
    tasks = [execute_agent(req) for req in requests]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [{"success": not isinstance(r, Exception), "result": r if not isinstance(r, Exception) else str(r)} for r in results]

@app.get("/health")
async def health():
    redis_ok = False
    try:
        redis_client.ping()
        redis_ok = True
    except Exception:
        pass

    return {
        "status": "healthy",
        "redis": "connected" if redis_ok else "disconnected",
        "kimi_key_set": bool(KIMI_API_KEY),
        "xai_key_set": bool(XAI_API_KEY),
    }

@app.post("/memory/store")
async def store_memory_endpoint(agent_id: str, content: str, memory_type: str = "FACT", category: str = "general"):
    store_memory(agent_id, "api", content, memory_type, category)
    return {"success": True}

@app.get("/memory/retrieve")
async def retrieve_memory(agent_id: str, query: str, limit: int = 5):
    context = get_memory_context(agent_id, query, limit)
    return {"success": True, "context": context}
