# Changelog

All notable changes to DoomScrollingFix will be documented in this file.

## [1.0.0] - 2026-02-19

### Added
- Breathing pause overlay with rotating messages (4 variations)
- Intention prompt with rotating questions (5 variations) to reduce habituation
- Password protection for the "Continue" button (optional)
- Dynamic content script registration for user-added custom domains
- Host permission request when adding custom domains
- Permission revocation when removing custom domains
- Onboarding welcome banner on first install
- Export/import settings for backup and transfer
- Clear stats button on dashboard
- Remove password option
- Total tracked time stat on dashboard
- Dismiss rate percentage stat on dashboard
- Dismiss count tracking ("went back" counter)
- ESC key to dismiss the intervention overlay
- ARIA roles, labels, and modal attributes for accessibility
- Loading spinner skeleton for website
- 404 page for website
- Lazy loading for below-the-fold website components
- Smoke test script (validates manifest-referenced files)
- Root package.json with orchestration scripts
- .editorconfig for consistent formatting
- STORE_LISTING.md with CWS submission copy and checklist
- CONTRIBUTING.md for contributors
- CHANGELOG.md

### Fixed
- Input validation for reprompt interval (clamp 1-60, NaN check)
- XSS prevention in options page (escape all user-supplied HTML)
- Reprompt interval cleared before showing overlay (prevents duplicates)
- ESC keydown listener cleaned up on dismiss/proceed (prevents accumulation)
- Background alarm scoped to current window only
- Skip non-HTTP URLs in background tab checks
- Graceful fallback if chrome.storage fails
- Install guard checks domains instead of password
- Badge cleared on non-monitored sites

### Changed
- README rewritten to match actual product (breathing + intention, not captcha)
- Privacy policy updated for scripting permission and optional host permissions
- Time saved estimate improved with dismiss data
- window.open calls include noreferrer
- Website document.title set on Privacy and 404 pages
- ESLint plugins installed as direct devDeps

### Removed
- Unused STORAGE_KEYS constant
- Unused origProceedClick variable
- Dead JSDoc typedef import
- Unused assets/ from build script
