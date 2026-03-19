# UNITFORM — Unit Converter

A precision unit conversion PWA (Progressive Web App) built with vanilla HTML, CSS, and JavaScript. Works fully offline and can be installed on Android as a home screen app.

## Features

- **11 unit categories** — Length, Mass, Temperature, Volume, Speed, Area, Pressure, Energy, Data Storage, Time, Angle
- **Live currency converter** — 30 currencies with real-time rates (falls back to cached rates offline)
- **Compare All Units** — convert one value to every unit in a category simultaneously
- **Conversion history** — log entries persist across sessions via localStorage
- **Scientific notation toggle** — switch all outputs to exponential form
- **Dark / Light theme** — full theme swap with smooth transitions
- **Keyboard shortcuts** — S, T, X, C, L, 1–4, ESC
- **Quick reference table** — pre-calculated common values per category
- **Works offline** — service worker caches all assets after first load

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `S` | Toggle scientific notation |
| `T` | Toggle dark/light theme |
| `X` | Swap From/To units |
| `C` | Copy result to clipboard |
| `L` | Log current conversion to history |
| `1` | Switch to Converter view |
| `2` | Switch to Compare All view |
| `3` | Switch to History view |
| `4` | Switch to Currency view |
| `ESC` | Clear input |

## Install on Android (PWA)

1. Host this repo on GitHub Pages (Settings → Pages → main branch)
2. Open your GitHub Pages URL in **Chrome on Android**
3. Tap the **3-dot menu → Add to Home Screen**
4. The app installs with a home screen icon and runs fully offline

## File Structure
unitform/
├── index.html      # Main app — all UI, logic, and styles
├── manifest.json   # PWA manifest — name, icons, display mode
├── sw.js           # Service worker — offline caching strategy
├── icon-192.png    # App icon (192×192)
└── icon-512.png    # App icon (512×512)
## How It Works

- **Conversion engine** — all unit conversions use a base-unit factor table. Temperature uses direct formulas for all 12 pairs (Celsius, Fahrenheit, Kelvin, Rankine).
- **Currency rates** — fetched live from [exchangerate-api.com](https://www.exchangerate-api.com) on first visit to the Currency tab. Response is cached by the service worker so it works offline with the last known rates.
- **Offline strategy** — cache-first for static assets, network-first for currency API with cache fallback, stale-while-revalidate for Google Fonts.
- **History** — stored in `localStorage` under key `uf_h2`, capped at 100 entries.

## Tech Stack

- Vanilla HTML / CSS / JavaScript — zero dependencies, zero frameworks
- Service Worker API for offline support
- Web App Manifest for installability
- Google Fonts (Share Tech Mono + Barlow Condensed)
- [exchangerate-api.com](https://www.exchangerate-api.com) for live currency data

## License

MIT — free to use, modify, and distri
