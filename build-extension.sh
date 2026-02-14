#!/bin/bash
# Packages only the Chrome extension files into extension.zip
# Usage: bash build-extension.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

rm -f extension.zip

zip -r extension.zip \
  manifest.json \
  logo.png \
  options.html \
  src/ \
  assets/ \
  LICENSE \
  README.md

echo "Built extension.zip ($(du -h extension.zip | cut -f1))"
