#!/bin/bash
# Ollama Model Setup for Hotels Vendors Swarm
# Detects available RAM and pulls the best fitting model

set -e

OLLAMA_HOST="${OLLAMA_HOST:-http://ollama:11434}"

echo "═══════════════════════════════════════════════════"
echo "  Ollama Model Setup for Hotels Vendors Swarm"
echo "═══════════════════════════════════════════════════"

# Wait for Ollama to be ready
echo "[1/3] Waiting for Ollama to start..."
for i in {1..30}; do
  if curl -sf "${OLLAMA_HOST}/api/tags" > /dev/null 2>&1; then
    echo "✅ Ollama is ready"
    break
  fi
  echo "  Attempt $i/30..."
  sleep 2
done

# Detect available memory
echo "[2/3] Detecting available memory..."
TOTAL_RAM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
TOTAL_RAM_GB=$((TOTAL_RAM_KB / 1024 / 1024))
echo "  Total RAM: ${TOTAL_RAM_GB}GB"

# Choose model based on available RAM
if [ "$TOTAL_RAM_GB" -ge 48 ]; then
  PRIMARY_MODEL="llama3.3:latest"
  FALLBACK_MODEL="qwen2.5:32b"
  echo "  🚀 High-memory VPS detected. Pulling Llama 3.3 (70B) + Qwen 2.5 (32B)"
elif [ "$TOTAL_RAM_GB" -ge 24 ]; then
  PRIMARY_MODEL="qwen2.5:32b"
  FALLBACK_MODEL="llama3.1:8b"
  echo "  ⚡ Good memory. Pulling Qwen 2.5 (32B) + Llama 3.1 (8B)"
elif [ "$TOTAL_RAM_GB" -ge 12 ]; then
  PRIMARY_MODEL="deepseek-r1:14b"
  FALLBACK_MODEL="llama3.1:8b"
  echo "  💪 Medium memory. Pulling DeepSeek-R1 (14B) + Llama 3.1 (8B)"
elif [ "$TOTAL_RAM_GB" -ge 8 ]; then
  PRIMARY_MODEL="qwen2.5:7b"
  FALLBACK_MODEL="llama3.2:3b"
  echo "  ✅ Standard VPS. Pulling Qwen 2.5 (7B) + Llama 3.2 (3B)"
else
  PRIMARY_MODEL="llama3.2:3b"
  FALLBACK_MODEL="phi4:latest"
  echo "  📝 Low memory. Pulling Llama 3.2 (3B) + Phi-4"
fi

# Pull primary model
echo "[3/3] Pulling ${PRIMARY_MODEL}..."
curl -sf "${OLLAMA_HOST}/api/pull" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${PRIMARY_MODEL}\",\"stream\":false}" > /dev/null 2>&1 || {
    echo "  ⚠️  Primary model pull may take time. Continuing..."
  }

# Pull fallback model in background
echo "  Pulling ${FALLBACK_MODEL} (background)..."
curl -sf "${OLLAMA_HOST}/api/pull" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${FALLBACK_MODEL}\",\"stream\":false}" > /dev/null 2>&1 &

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Ollama Setup Complete"
echo "═══════════════════════════════════════════════════"
echo "  Primary:   ${PRIMARY_MODEL}"
echo "  Fallback:  ${FALLBACK_MODEL}"
echo ""
echo "  Test: curl ${OLLAMA_HOST}/api/generate \\"
echo "    -d '{\"model\":\"${PRIMARY_MODEL}\",\"prompt\":\"Hi\"}'"
