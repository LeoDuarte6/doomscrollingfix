# DoomScrollingFix

A free Chrome extension that interrupts autopilot scrolling with research-backed friction — a breathing pause, an intention prompt, and a choice. Works on Twitter, Reddit, Instagram, TikTok, YouTube, and Facebook.

**Website:** [doomscrollingfix.com](https://doomscrollingfix.com)

## How it works

When you visit a monitored site, DoomScrollingFix shows:

1. **A 6-second breathing pause** — engages your prefrontal cortex and breaks the scroll reflex
2. **An intention prompt** — asks "What are you looking for?" (rotating prompts to reduce habituation)
3. **A choice** — go back or continue. No locks, no guilt

After your set time limit (default: 2 minutes), the cycle repeats — catching the moments you don't catch yourself.

## Features

- **Multi-platform:** works on Twitter/X, Reddit, Instagram, TikTok, YouTube, Facebook, and any custom domain you add
- **Scroll-aware:** detects when you've been scrolling past your time limit and re-prompts
- **Greyscale mode:** makes content less stimulating after you continue
- **Privacy-first:** no account, no cloud sync, no analytics — everything stays on your device
- **Password protection:** optional password gate for extra friction
- **Dashboard:** usage stats, time per site, intention history
- **Keyboard accessible:** ESC to dismiss, Enter to proceed

## The science

| Finding | Source |
|---------|--------|
| A single moment of friction reduced social media use by **57%** | [PNAS, 2024](https://doi.org/10.1073/pnas.2213114120) |
| Implementation intentions have a **d = 0.65** effect size | [Gollwitzer & Sheeran, 2006](https://doi.org/10.1016/S0065-2601(06)38002-1) |
| Choice-based tools outperform hard blocks | [Lyngs et al., 2019](https://doi.org/10.1145/3290605.3300361) |

## Installation

### From source (developer mode)
1. Clone this repository
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the repo root

### From Chrome Web Store
Coming soon.

## Project structure

```
DoomScrollingFix/
├── src/
│   ├── js/
│   │   ├── content.js      # Content script (overlay, breathing, intention prompt)
│   │   ├── background.js   # Service worker (alarms, badge, install handler, dynamic scripts)
│   │   └── options.js       # Options page logic
│   └── css/
│       ├── styles.css       # Content script styles (overlay, timer, greyscale)
│       └── options.css      # Options page styles
├── icons/                   # Extension icons (16, 32, 48, 128)
├── website/                 # Marketing website (React + Vite + Tailwind)
├── scripts/                 # Build & test scripts
├── manifest.json            # Chrome extension manifest (MV3)
├── options.html             # Settings dashboard
├── build-extension.sh       # Build script for extension.zip
├── STORE_LISTING.md         # Chrome Web Store listing copy
└── README.md
```

## Configuration

In the options dashboard:
- **Websites:** add/remove monitored domains
- **Timer:** set re-prompt interval (1–60 minutes)
- **Password:** optional password for extra friction
- **Dashboard:** view intervention count, time per site, intention history

## Development

```bash
# Run smoke test (validates manifest references)
node scripts/smoke-test.js

# Build extension zip
bash build-extension.sh

# Build website
cd website && npm install && npm run build
```

## License

MIT — see [LICENSE](LICENSE).
