#!/bin/bash
# Sets up OpenClaw cron jobs for DoomScrollingFix
# Run this AFTER: openclaw onboard --install-daemon
# Docs: https://docs.openclaw.ai/automation/cron-jobs

set -e

echo "=== Setting up DoomScrollingFix cron jobs ==="

# 1. DAILY BUILD CHECK (every morning at 9am)
# Verifies the extension builds cleanly and reports issues
openclaw cron add \
  --name "daily-build-check" \
  --cron "0 9 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Check the DoomScrollingFix GitHub repo (LeoDuarte6/doomscrollingfix):
1. Pull latest master and run 'bash build-extension.sh' - verify extension.zip builds cleanly
2. Run 'cd website && npm ci && npm run build' - verify website builds
3. Run 'cd website && npm run lint' - check for lint errors
If anything fails, report the exact error. If everything passes, reply with a short OK summary."

# 2. WEEKLY DEPENDENCY AUDIT (Mondays at 10am)
# Checks for security vulnerabilities and outdated packages
openclaw cron add \
  --name "weekly-dep-audit" \
  --cron "0 10 * * 1" \
  --tz "America/New_York" \
  --session isolated \
  --message "Run a dependency audit for DoomScrollingFix:
1. cd website && npm audit - check for vulnerabilities
2. npm outdated - list outdated packages
3. Check if any critical/high severity issues exist
Report findings with severity levels. If critical issues found, suggest the fix commands."

# 3. GITHUB ISSUE TRIAGE (every 4 hours during business hours)
# Monitors for new issues and PRs
openclaw cron add \
  --name "github-triage" \
  --cron "0 9,13,17 * * 1-5" \
  --tz "America/New_York" \
  --session isolated \
  --message "Check GitHub repo LeoDuarte6/doomscrollingfix:
1. List any new/unresolved issues from the last 4 hours
2. Check for any open pull requests needing review
3. Check if the latest Actions workflow run passed
Brief summary only. Skip if nothing new."

# 4. WEEKLY CHROME EXTENSION ECOSYSTEM CHECK (Fridays at 2pm)
# Stays on top of MV3 changes and Chrome updates
openclaw cron add \
  --name "weekly-chrome-check" \
  --cron "0 14 * * 5" \
  --tz "America/New_York" \
  --session isolated \
  --message "Quick Chrome Extension ecosystem check for DoomScrollingFix:
1. Any new Chrome MV3 deprecations or API changes that affect our manifest?
2. Any changes to the content_scripts or service_worker APIs we use?
3. Check if minimum_chrome_version 88 is still reasonable
Only report if there are actionable findings."

# 5. MONTHLY RELEASE READINESS (1st of each month at 11am)
# Preps release notes and checks if version bump is warranted
openclaw cron add \
  --name "monthly-release-check" \
  --cron "0 11 1 * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Monthly release readiness for DoomScrollingFix:
1. Summarize all commits since the last git tag
2. Assess if changes warrant a version bump (patch/minor/major)
3. Draft release notes if a release is warranted
4. Check that extension.zip builds cleanly
Provide a recommendation: release now, or wait for more changes."

echo ""
echo "=== Cron jobs configured! ==="
echo "Run 'openclaw cron list' to verify."
echo ""
