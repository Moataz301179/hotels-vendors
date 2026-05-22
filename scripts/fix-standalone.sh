#!/bin/bash
set -e

BUILD_STATIC="/var/www/hotelsvendors-v2/.next/static"
STANDALONE_STATIC="/var/www/hotelsvendors-v2/.next/standalone/hotelsvendors-v2/.next/static"

if [ ! -d "$BUILD_STATIC" ]; then
  echo "Build static dir not found: $BUILD_STATIC"
  exit 1
fi

# Create standalone static dir if missing
mkdir -p "$STANDALONE_STATIC"

# Create chunks dir and move JS/CSS from static root
mkdir -p "$STANDALONE_STATIC/chunks"
find "$STANDALONE_STATIC" -maxdepth 1 -type f \( -name '*.js' -o -name '*.css' \) -exec mv {} "$STANDALONE_STATIC/chunks/" \; 2>/dev/null || true

# Copy all build static contents into standalone static
cp -r "$BUILD_STATIC"/* "$STANDALONE_STATIC/" 2>/dev/null || true

# Copy media (fonts) if exists
if [ -d "$BUILD_STATIC/media" ]; then
  cp -r "$BUILD_STATIC/media" "$STANDALONE_STATIC/" 2>/dev/null || true
fi

echo "Standalone fix complete."
echo "  static dirs: $(ls $STANDALONE_STATIC/ 2>/dev/null | wc -l)"
