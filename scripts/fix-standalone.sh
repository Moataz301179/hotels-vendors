#!/bin/bash
# Fix Next.js standalone static assets placement
# Next.js 16 puts JS/CSS in .next/static/ root but standalone server serves from subdirs

BUILD_STATIC="/var/www/hotelsvendors-v2/.next/static"
STANDALONE_STATIC="/var/www/hotelsvendors-v2/.next/standalone/hotelsvendors-v2/.next/static"

if [ ! -d "$STANDALONE_STATIC" ]; then
  echo "Standalone static dir not found: $STANDALONE_STATIC"
  exit 1
fi

# Create chunks dir and move JS/CSS from static root
mkdir -p "$STANDALONE_STATIC/chunks"
find "$STANDALONE_STATIC" -maxdepth 1 -type f \( -name '*.js' -o -name '*.css' \) -exec mv {} "$STANDALONE_STATIC/chunks/" \;

# Copy media (fonts) if exists
if [ -d "$BUILD_STATIC/media" ]; then
  cp -r "$BUILD_STATIC/media" "$STANDALONE_STATIC/"
fi

# Copy manifest directories (e.g., nm5QSlATqI1grYVbbcznz)
for dir in "$BUILD_STATIC"/*/; do
  dirname=$(basename "$dir")
  if [ "$dirname" != "chunks" ] && [ "$dirname" != "media" ]; then
    cp -r "$dir" "$STANDALONE_STATIC/"
  fi
done

echo "Standalone fix complete."
echo "  chunks: $(ls $STANDALONE_STATIC/chunks/ 2>/dev/null | wc -l) files"
echo "  media: $(ls $STANDALONE_STATIC/media/ 2>/dev/null | wc -l) files"
echo "  manifests: $(ls $STANDALONE_STATIC/nm5QSlATqI1grYVbbcznz/ 2>/dev/null | wc -l) files"
