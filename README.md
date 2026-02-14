# DoomScrollingFix

A Chrome extension designed to promote mindful browsing by preventing doomscrolling on social media platforms.

## Features

- Two-factor authentication for accessing social media sites (captcha + password)
- Greyscale mode to reduce visual stimulation
- Time tracking for social media usage
- Periodic re-authentication to maintain mindfulness (timer + scroll-triggered)
- Customizable settings (password, monitored sites, reprompt interval)

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. After installation, the extension will automatically monitor specified social media sites
2. When visiting a monitored site:
   - Solve a simple math captcha
   - Enter your password
   - Site content will be displayed in greyscale
3. After the reprompt interval (default 2 minutes) or significant scrolling, you'll be re-prompted
4. Access options by right-clicking the extension icon and selecting "Options"

## Configuration

In the options page, you can:
- Set your access password
- Customize the list of monitored websites
- Adjust re-authentication timing (1-60 minutes)
- View usage statistics

## Project Structure

```
DoomScrollingFix/
├── src/
│   ├── js/
│   │   ├── content.js      # Content script (overlay, captcha, reprompting)
│   │   ├── background.js   # Service worker (alarms, badge, install handler)
│   │   └── options.js      # Options page logic
│   └── css/
│       ├── styles.css       # Content script styles (overlay, timer, greyscale)
│       └── options.css      # Options page styles
├── assets/                  # Extension images
├── manifest.json            # Extension manifest (MV3)
├── options.html             # Options page
├── logo.png                 # Extension icon
├── LICENSE                  # MIT License
└── README.md
```

## Supported Sites (default)

- YouTube
- Twitter / X
- Facebook
- Instagram
- Reddit
- TikTok

## License

MIT License - See [LICENSE](LICENSE) file for details.
