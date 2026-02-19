# Contributing to DoomScrollingFix

Thanks for your interest in contributing!

## Getting started

1. Fork and clone the repo
2. Load the extension in Chrome (`chrome://extensions/` → Developer mode → Load unpacked)
3. Make changes and test locally
4. Submit a PR

## Project layout

- **Extension:** root directory (`manifest.json`, `src/js/`, `src/css/`, `options.html`)
- **Website:** `website/` (React + Vite + Tailwind)
- **Scripts:** `scripts/` (build and test utilities)

## Development

```bash
# Validate manifest and referenced files
node scripts/smoke-test.js

# Build extension zip
bash build-extension.sh

# Website dev server
cd website && npm install && npm run dev

# Website production build
cd website && npm run build
```

## Guidelines

- One commit per logical change
- Test your changes by loading the unpacked extension in Chrome
- Don't fabricate testimonials or fake content
- Keep the extension lightweight — no heavy dependencies
- Follow the existing code style (see `.editorconfig`)

## Areas where help is welcome

- Testing on different Chromium browsers (Brave, Edge, Opera)
- Improving accessibility
- Translations / i18n
- Better onboarding UX
- Screenshot creation for Chrome Web Store

## Questions?

Open an issue on GitHub.
