#!/bin/bash
# Packages only the Chrome extension files into extension.zip
# Works on Windows (Git Bash / WSL / PowerShell fallback) and Unix
# Usage: bash build-extension.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# --list flag: show what would be included
if [ "${1:-}" = "--list" ]; then
  echo "Files that would be included in extension.zip:"
  for item in manifest.json logo.png options.html src/ assets/ icons/ LICENSE README.md; do
    if [ -d "$item" ]; then
      find "$item" -type f 2>/dev/null | sort
    elif [ -f "$item" ]; then
      echo "$item"
    else
      echo "  [missing] $item"
    fi
  done
  exit 0
fi

rm -f extension.zip

FILES=(
  manifest.json
  logo.png
  options.html
  src/
  assets/
  icons/
  LICENSE
  README.md
)

if command -v zip >/dev/null 2>&1; then
  zip -r extension.zip "${FILES[@]}"
elif command -v powershell.exe >/dev/null 2>&1; then
  # Windows fallback using PowerShell Compress-Archive
  powershell.exe -NoProfile -Command "
    \$files = @($(printf "'%s'," "${FILES[@]}" | sed 's/,$//' ))
    \$paths = @()
    foreach (\$f in \$files) {
      if (Test-Path \$f) { \$paths += (Get-Item \$f).FullName }
    }
    Compress-Archive -Path \$paths -DestinationPath 'extension.zip' -Force
  "
elif command -v python3 >/dev/null 2>&1 || command -v python >/dev/null 2>&1; then
  # Python fallback
  PY=$(command -v python3 || command -v python)
  $PY -c "
import zipfile, os, sys
with zipfile.ZipFile('extension.zip', 'w', zipfile.ZIP_DEFLATED) as zf:
    for item in sys.argv[1:]:
        if os.path.isdir(item):
            for root, dirs, files in os.walk(item):
                for f in files:
                    fp = os.path.join(root, f)
                    zf.write(fp)
        elif os.path.isfile(item):
            zf.write(item)
" "${FILES[@]}"
else
  echo "ERROR: No zip tool found. Install zip, or use PowerShell/Python." >&2
  exit 1
fi

if [ -f extension.zip ]; then
  SIZE=$(wc -c < extension.zip | tr -d ' ')
  echo "Built extension.zip ($(( SIZE / 1024 ))KB)"
else
  echo "ERROR: extension.zip was not created" >&2
  exit 1
fi
