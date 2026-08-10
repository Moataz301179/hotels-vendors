#!/bin/bash
# Ollama model pull script for Hotels Vendors VPS
# Run after docker-compose.swarm.yml is up

set -e

OLLAMA_CONTAINER="hv-ollama"
MODEL_CPU="llama3.2:3b"
MODEL_GPU="llama3.1:8b"
EMBED_MODEL="nomic-embed-text"

echo "=== Hotels Vendors Ollama Model Setup ==="

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${OLLAMA_CONTAINER}$"; then
    echo "ERROR: Ollama container '${OLLAMA_CONTAINER}' is not running."
    echo "Start it first: docker-compose -f docker-compose.swarm.yml up -d ollama"
    exit 1
fi

# Detect GPU
if docker exec ${OLLAMA_CONTAINER} nvidia-smi > /dev/null 2>&1; then
    echo "GPU detected. Pulling high-quality model: ${MODEL_GPU}"
    docker exec ${OLLAMA_CONTAINER} ollama pull ${MODEL_GPU}
    docker exec ${OLLAMA_CONTAINER} ollama pull ${EMBED_MODEL}
    echo "Models pulled successfully."
    echo "Set OLLAMA_MODEL=${MODEL_GPU} in your .env"
else
    echo "No GPU detected (CPU-only VPS). Pulling lightweight model: ${MODEL_CPU}"
    docker exec ${OLLAMA_CONTAINER} ollama pull ${MODEL_CPU}
    docker exec ${OLLAMA_CONTAINER} ollama pull ${EMBED_MODEL}
    echo "Models pulled successfully."
    echo "Set OLLAMA_MODEL=${MODEL_CPU} in your .env"
fi

echo ""
echo "Verifying models..."
docker exec ${OLLAMA_CONTAINER} ollama list

echo ""
echo "Testing chat..."
docker exec ${OLLAMA_CONTAINER} ollama run ${MODEL_CPU:-${MODEL_GPU}} "Say hello from Hotels Vendors AI"

echo ""
echo "=== Setup Complete ==="
