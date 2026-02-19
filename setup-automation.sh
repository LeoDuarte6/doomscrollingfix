#!/bin/bash
# DoomScrollingFix - Full Automation Setup
# This script sets up OpenClaw + GitHub Actions for hands-off maintenance
#
# Prerequisites:
#   - Node >= 22 (node --version)
#   - Git configured with push access to the repo
#   - GitHub CLI (gh) installed and authenticated
#
# Usage: bash setup-automation.sh

set -e

echo "============================================"
echo "  DoomScrollingFix Automation Setup"
echo "============================================"
echo ""

# --- Step 1: Check prerequisites ---
echo "[1/5] Checking prerequisites..."

command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js not found. Install Node >= 22."; exit 1; }
NODE_VER=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_VER" -lt 22 ]; then
  echo "ERROR: Node $NODE_VER found, need >= 22. Run: nvm install 22"
  exit 1
fi
echo "  Node $(node --version) ✓"

command -v git >/dev/null 2>&1 || { echo "ERROR: git not found."; exit 1; }
echo "  git ✓"

command -v gh >/dev/null 2>&1 && echo "  gh CLI ✓" || echo "  WARN: gh CLI not found (optional, needed for release automation)"

# --- Step 2: Install OpenClaw ---
echo ""
echo "[2/5] Installing OpenClaw..."

if command -v openclaw >/dev/null 2>&1; then
  echo "  OpenClaw already installed ($(openclaw --version 2>/dev/null || echo 'unknown version'))"
  echo "  To update: npm update -g openclaw"
else
  echo "  Installing openclaw globally..."
  npm install -g openclaw@latest
  echo "  OpenClaw installed ✓"
fi

# --- Step 3: Run OpenClaw onboarding ---
echo ""
echo "[3/5] OpenClaw onboarding..."
echo "  Running the setup wizard. Follow the prompts to configure:"
echo "    - API key / auth method"
echo "    - Gateway settings"
echo "    - Channel (optional - Discord, WhatsApp, etc.)"
echo ""

if [ ! -f ~/.openclaw/config.json5 ]; then
  openclaw onboard --install-daemon
else
  echo "  OpenClaw already onboarded. Skipping wizard."
  echo "  To reconfigure: openclaw onboard"
fi

# --- Step 4: Copy workspace files ---
echo ""
echo "[4/5] Setting up OpenClaw workspace..."

WORKSPACE_DIR=~/.openclaw/workspace
mkdir -p "$WORKSPACE_DIR"

# Copy HEARTBEAT.md to the workspace
cp .openclaw/HEARTBEAT.md "$WORKSPACE_DIR/HEARTBEAT.md"
echo "  HEARTBEAT.md -> $WORKSPACE_DIR/HEARTBEAT.md ✓"

# Copy gateway config if not already present
if [ ! -f ~/.openclaw/gateway.json5 ]; then
  cp .openclaw/gateway.json5 ~/.openclaw/gateway.json5
  echo "  gateway.json5 -> ~/.openclaw/gateway.json5 ✓"
else
  echo "  gateway.json5 already exists (not overwriting)"
  echo "  Merge settings from .openclaw/gateway.json5 manually if needed"
fi

# --- Step 5: Register cron jobs ---
echo ""
echo "[5/5] Registering cron jobs..."

# Start gateway if not running
openclaw gateway status >/dev/null 2>&1 || openclaw gateway start

bash .openclaw/cron-jobs.sh

# --- Done ---
echo ""
echo "============================================"
echo "  Setup complete!"
echo "============================================"
echo ""
echo "What's now automated:"
echo ""
echo "  GitHub Actions (runs on push to master):"
echo "    • Extension ZIP build + artifact upload"
echo "    • Website build + lint"
echo "    • Manifest validation"
echo "    • Weekly dependency audit (Sundays)"
echo "    • Version bump workflow (manual trigger)"
echo "    • Auto-attach extension.zip to GitHub Releases"
echo ""
echo "  OpenClaw Cron Jobs:"
echo "    • Daily build check (9am)"
echo "    • Weekly dependency audit (Mon 10am)"
echo "    • GitHub issue triage (3x/day weekdays)"
echo "    • Chrome ecosystem check (Fri 2pm)"
echo "    • Monthly release readiness (1st of month)"
echo ""
echo "  OpenClaw Heartbeat:"
echo "    • Every hour during 9am-11pm"
echo "    • Monitors issues, PRs, CI status"
echo ""
echo "Useful commands:"
echo "  openclaw cron list          # See all scheduled jobs"
echo "  openclaw cron run <id>      # Run a job manually"
echo "  openclaw gateway status     # Check gateway health"
echo "  openclaw dashboard          # Open web dashboard"
echo ""
echo "To push GitHub Actions to remote:"
echo "  git add .github/ && git commit -m 'ci: add automated build pipeline' && git push"
echo ""
