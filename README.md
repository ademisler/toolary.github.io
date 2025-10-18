# Toolary – Web Productivity Toolkit

Toolary bundles nine essential inspection, capture, and utility tools into a single Chrome extension. Version 2.0.0 introduces a scalable popup with search, categories, favorites, recent history, and tool visibility settings – all while keeping data on-device.

## Features

| Category | Tool | Shortcut | Highlights |
|----------|------|----------|------------|
| Inspect  | Color Picker | Alt + Shift + 1 | Eyedropper with RGB/HSL, copy to clipboard |
| Inspect  | Element Picker | Alt + Shift + 2 | CSS/XPath paths, overlay inspector |
| Inspect  | Link Picker | Popup | Link extraction & validation |
| Inspect  | Font Picker | Popup | Typography snapshot (family, weights, CSS) |
| Capture  | Media Picker | Popup | Image/video discovery & download |
| Capture  | Text Picker | Popup | Copy-protected text extraction |
| Capture  | Screenshot Picker | Alt + Shift + 3 | Full-page stitching with download |
| Enhance  | Sticky Notes | Popup | Persistent notes per site (syncable) |
| Utilities| Site Info | Popup | Tech stack, performance, accessibility hints |

Additional highlights:
- **Search & Filters** – Find tools instantly by name, tags, or keywords.
- **Favorites & Recents** – Pin frequently used tools; revisit the last five actions.
- **Per-tool Visibility** – Hide tools from the main grid while keeping them searchable.
- **Local-first Privacy** – No external services, no telemetry, no remote storage.
- **Multi-language** – English, French, Turkish with locale auto-detect.
- **Accessibility** – Keyboard-first navigation (Tab/Shift+Tab, arrow keys, `/` for search), ARIA-labelled sections, toast notifications.
- **Keyboard workflow** – Global shortcuts cover the popup toggle plus color, element, and screenshot pickers; everything else launches instantly from the popup search.

## Getting Started

### Install from source

1. Clone the repository and install dev dependencies (optional for lint/tests):
   ```bash
   git clone https://github.com/fulexo/toolary.git
   cd toolary
   npm install
   ```
2. Load the unpacked extension:
   - Open `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the `extension/` folder
3. Pin Toolary, open the popup, and start exploring.

### Developer commands

| Command | Description |
|---------|-------------|
| `npm run lint` | ESLint across all extension JavaScript |
| `npm test` | Jest unit tests (jsdom) with 98%+ coverage |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `zip -r toolary-v2.0.0.zip extension -x "node_modules/*"` | Package for Chrome Web Store |

## Architecture Overview

- **Manifest v3** service worker (`background.js`) coordinates privileged APIs and keyboard commands.
- **Lazy-loading content script** (`content/content.js`) imports tool modules on demand, manages tool lifecycles, and hydrates sticky notes.
- **Popup** (`popup/popup.js`) consumes a manifest-driven registry for search/filtering, persists preferences in `chrome.storage.sync`, and renders with virtualized grids via shared UI components.
- **Core modules** (`extension/core/`) ensure all surfaces share the same tool metadata, loader, and message pipeline.

Tool metadata lives in `extension/config/tools-manifest.json` and every tool module exports matching metadata (`metadata { id, name, ... }`) alongside `activate`/`deactivate`.

## Building for Release

1. Run automated checks:
   ```bash
   npm run lint
   npm test
   ```
2. Package the extension:
   ```bash
   mkdir -p dist
   zip -r dist/toolary-v2.0.0.zip extension -x "node_modules/*" "*.map"
   ```
3. Smoke test the zipped build by loading it in Chrome.
4. Capture updated screenshots of the popup (light/dark themes) for the Chrome Web Store.
5. Publish the archive and update store listing text/metadata.

## Migration Notes (Pickachu → Toolary)

- **No user action required** – The extension reads legacy sticky-note keys (`stickyNotes_`) and migrates them to the new prefix automatically.
- **Favorites & history** – Stored under new keys (`toolaryFavorites`, `toolaryRecentTools`) in sync/local storage. Legacy Pickachu keys migrate on first run so existing stars and recents carry over automatically.
- **Branding** – Manifest name, icons, descriptions, and README were updated to Toolary; shortcuts now focus on color, element, and screenshot pickers while other tools launch from the popup.
- **Architecture** – Complete redesign with tool registry, lazy loading, and scalable popup UI with search, categories, and favorites.

## Privacy

Toolary never transmits page data, tool usage, or notes to external services. All processing happens locally in the browser. See `PRIVACY_POLICY.md` for full details.

## Contributing

1. Fork & branch from `main`
2. Update or add tool metadata (`tools-manifest.json`, locales, icons)
3. Include automated tests where possible
4. Run `npm run lint && npm test`
5. Submit a PR with a description of changes, manual test notes, and updated documentation where relevant

## License

MIT © Adem İsler and contributors.
