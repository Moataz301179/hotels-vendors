# Model Selection

Lists the models available for running Claude Code on this machine, both local (Ollama) and cloud (OpenRouter free tier).

## Local Ollama models (default — free, offline)

Run with plain `claude` (or `claude <model> --model <id>`):

| Model | Size | Notes |
|---|---|---|
| `qwen3.5:9b-64k` | 6.6GB | **Default.** 9.7B, 256K ctx, tools+vision |
| `qwen3.5:9b` | 6.6GB | Same, 4K default ctx |
| `granite4.1:8b-64k` | 5.3GB | Fintech/structured reasoning |
| `devstral:24b-64k` | 14GB | Agentic coding — too slow on 16GB, avoid |

```bash
claude                    # uses ANTHROPIC_MODEL (qwen3.5:9b-64k)
claude --model granite4.1:8b-64k
```

## OpenRouter free models (cloud)

Run with `claude-or` (same CLI as `claude`, no other changes). Curated list verified 2026-08-04 — every entry passes Claude Code's full toolset:

| Alias | Model | Notes |
|---|---|---|
| `nemotron` (default) | `nvidia/nemotron-3-ultra-550b-a55b:free` | 1M ctx, best general |
| `ling` | `inclusionai/ling-3.0-flash:free` | 262K |
| `laguna` | `poolside/laguna-s-2.1:free` | code model |
| `super` | `nvidia/nemotron-3-super-120b-a12b:free` | 262K |
| `omni` | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | reasoning |
| `nano` | `nvidia/nemotron-3-nano-30b-a3b:free` | 256K |
| `nano9` | `nvidia/nemotron-nano-9b-v2:free` | fast, small |
| `auto` | `openrouter/free` | auto-routes best free |

```bash
claude-or                 # default nemotron
claude-or ling            # pick a specific free model
claude-or --list          # show current list + full model IDs
```

## Rejected free models (don't use with Claude Code)

- `openai/gpt-oss-20b:free` — provider caps tools at 64 (Claude Code needs >64)
- `google/gemma-4-26b-a4b-it:free`, `google/gemma-4-31b-it:free` — same tool cap
- `cohere/north-mini-code:free` — returns empty responses
- `google/lyria-3-*`, `nvidia/nemotron-3.5-content-safety:free` — no tool support
- DeepSeek / Qwen free models were removed from OpenRouter (as of 2026-08)

## Output

Report:
- Which provider + model is active (`echo $ANTHROPIC_BASE_URL $ANTHROPIC_MODEL`)
- The curated OpenRouter list above
