#!/bin/bash
# Auto-commit every change to git so nothing is lost on disconnect

cd /var/www/hotelsvendors-v2

# Only commit if there are changes
if [ -n "$(git status --porcelain)" ]; then
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  git add -A
  git commit -m "auto-save: $TIMESTAMP" --no-verify
  echo "[$TIMESTAMP] Auto-saved $(git diff --cached --numstat | wc -l) changed files"
else
  echo "No changes to save"
fi
