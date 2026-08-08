#!/bin/bash
# Fix: Copy static assets to standalone build directory on VPS
# Next.js 16 standalone builds don't include .next/static/ automatically

APP_DIR="/var/www/hotelsvendors-v2"
STANDALONE_STATIC="$APP_DIR/.next/standalone/.next/static"
SOURCE_STATIC="$APP_DIR/.next/static"

echo "=== Copying static assets to standalone ==="

if [ -d "$SOURCE_STATIC" ]; then
    # Ensure the standalone .next/static directory exists
    mkdir -p "$STANDALONE_STATIC"
    
    # Copy static assets
    cp -r "$SOURCE_STATIC"/* "$STANDALONE_STATIC/" 2>&1
    
    echo "Static assets copied"
    echo "=== Verify ==="
    ls -la "$STANDALONE_STATIC/" 2>&1
    find "$STANDALONE_STATIC" -name "*.css" -type f 2>&1
else
    echo "ERROR: Source static directory not found: $SOURCE_STATIC"
fi
