"""
Agent0 — Lightweight Agent Executor for Hotels Vendors Swarm
LLM: xAI Grok (primary) → Kimi (fallback)
Embeddings: Ollama (local, free)
Memory: Redis
"""

import json
import os
import time
from typing import Any, Optional

import httpx
import redis
from fastapi import FastAPI
from pydantic import BaseModel

# ── Config ──
XAI_API_KEY = os.getenv("XAI_API_KEY", "")
KIMI_API_KEY = os.getenv("KIMI_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://ollama:11434")

# Redis connection
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

# ── Models ──

class LLMMessage(BaseModel):
    role: str
    content: str

class ToolCall(BaseModel):
    name: str
    arguments: dict[str, Any]

class AgentRequest(BaseModel):
    agent_id: str
    agent_name: str
    system_prompt: str
    user_prompt: str
    model: str = "grok-4-1-fast"
    temperature: float = 0.3
    max_tokens: int = 4096
    tools: Optional[list[dict]] = None
    memory_context: Optional[str] = None
    job_id: Optional[str] = None
    use_embedding: bool = True

class AgentResponse(BaseModel):
    success: bool
    content: str
    tool_calls: Optional[list[ToolCall]] = None
    model_used: str
    latency_ms: int
    tokens_used: Optional[int] = None
    error: Optional[str] = None

# ── LLM Providers ──

async def call_xai(messages: list[dict], temperature: float, max_tokens: int) -> dict:
    """Call xAI Grok API — PRIMARY"""
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

async def call_groq(messages: list[dict], temperature: float, max_tokens: int) -> dict:
    """Call Groq API — FALLBACK 1"""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            },
        )
        response.raise_for_status()
        return response.json()

async def call_kimi(messages: list[dict], temperature: float, max_tokens: int) -> dict:
    """Call Kimi API — FALLBACK 2"""
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

async def call_llm(
    model: str,
    messages: list[dict],
    temperature: float,
    max_tokens: int,
) -> tuple[str, dict]:
    """Route to correct provider with fallback chain: Grok → Groq → Kimi"""
    errors = []
    providers = [
        ("xai", call_xai),
        ("groq", call_groq),
        ("kimi", call_kimi),
    ]

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

# ── Ollama Embeddings ──

async def create_ollama_embedding(text: str) -> list[float]:
    """Create embeddings using Ollama (free, local)"""
    model = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{OLLAMA_URL}/api/embeddings",
            json={"model": model, "prompt": text},
        )
        response.raise_for_status()
        data = response.json()
        return data.get("embedding", [])

# ── Memory with Vector Search ──

def cosine_similarity(a: list[float], b: list[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = sum(x * x for x in a) ** 0.5
    norm_b = sum(x * x for x in b) ** 0.5
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def get_memory_context(agent_id: str, query: str, query_embedding: list[float], limit: int = 5) -> str:
    """Retrieve relevant memories using vector similarity"""
    try:
        pattern = "swarm:memory:*"
        keys = redis_client.scan_iter(match=pattern, count=100)
        memories = []
        for key in keys:
            data = redis_client.get(key)
            if data:
                mem = json.loads(data)
                if mem.get("agent_id") == agent_id or mem.get("category") == "general":
                    mem_embedding = mem.get("embedding", [])
                    if mem_embedding and query_embedding:
                        mem["_score"] = cosine_similarity(query_embedding, mem_embedding)
                    else:
                        mem["_score"] = 0.0
                    memories.append(mem)

        memories.sort(key=lambda x: x.get("_score", 0), reverse=True)
        top = memories[:limit]

        if not top:
            return ""

        lines = ["## Relevant Context from Memory:"]
        for m in top:
            score = m.get("_score", 0)
            lines.append(f"- [{m.get('memory_type')}] (relevance: {score:.2f}) {m.get('content', '')[:200]}")
        return "\n".join(lines)
    except Exception as e:
        return f"# Memory retrieval error: {e}"

def store_memory(agent_id: str, agent_name: str, content: str, memory_type: str, category: str,
                 embedding: Optional[list[float]] = None, job_id: Optional[str] = None):
    """Store a memory in Redis with TTL + optional embedding"""
    try:
        mem_id = f"swarm:memory:{agent_id}:{int(time.time() * 1000)}"
        data = {
            "agent_id": agent_id,
            "agent_name": agent_name,
            "content": content,
            "memory_type": memory_type,
            "category": category,
            "job_id": job_id,
            "embedding": embedding,
            "created_at": time.time(),
        }
        redis_client.setex(mem_id, 7 * 24 * 3600, json.dumps(data))
    except Exception as e:
        print(f"Memory store error: {e}")

# ── FastAPI App ──

app = FastAPI(title="Agent0", version="3.0.0")

@app.post("/execute", response_model=AgentResponse)
async def execute_agent(req: AgentRequest):
    start = time.time()

    try:
        messages = [{"role": "system", "content": req.system_prompt}]

        # Generate embedding for query (Ollama, free)
        query_embedding: list[float] = []
        if req.use_embedding:
            try:
                query_embedding = await create_ollama_embedding(req.user_prompt)
            except Exception as e:
                print(f"[Agent0] Embedding failed: {e}")

        # Add memory context with vector search
        if req.memory_context:
            messages.append({"role": "system", "content": f"Context:\n{req.memory_context}"})
        else:
            memory = get_memory_context(req.agent_id, req.user_prompt, query_embedding)
            if memory:
                messages.append({"role": "system", "content": memory})

        messages.append({"role": "user", "content": req.user_prompt})

        # Call LLM (Grok primary)
        content, meta = await call_llm(req.model, messages, req.temperature, req.max_tokens)

        # Parse tool calls
        tool_calls = None
        if "TOOL_CALL:" in content or "tool_call" in content.lower():
            try:
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

        # Store result as memory with embedding
        store_memory(
            req.agent_id, req.agent_name,
            f"Task: {req.user_prompt[:200]}... Result: {content[:500]}",
            "ACTION", "execution", query_embedding, req.job_id,
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

    ollama_ok = False
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{OLLAMA_URL}/api/tags")
            ollama_ok = r.status_code == 200
    except Exception:
        pass

    return {
        "status": "healthy",
        "redis": "connected" if redis_ok else "disconnected",
        "ollama": "connected" if ollama_ok else "disconnected",
        "xai_key_set": bool(XAI_API_KEY),
        "groq_key_set": bool(GROQ_API_KEY),
        "kimi_key_set": bool(KIMI_API_KEY),
    }

@app.post("/memory/store")
async def store_memory_endpoint(agent_id: str, content: str, memory_type: str = "FACT", category: str = "general"):
    store_memory(agent_id, "api", content, memory_type, category)
    return {"success": True}

@app.get("/memory/retrieve")
async def retrieve_memory(agent_id: str, query: str, limit: int = 5):
    query_embedding = await create_ollama_embedding(query)
    context = get_memory_context(agent_id, query, query_embedding, limit)
    return {"success": True, "context": context}

@app.post("/embed")
async def embed(text: str):
    """Standalone embedding endpoint"""
    embedding = await create_ollama_embedding(text)
    return {"success": True, "embedding": embedding, "dimensions": len(embedding)}
