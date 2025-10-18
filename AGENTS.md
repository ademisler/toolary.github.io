# AGENTS.md – Toolary Internal Blueprint

## Project Overview

- **Name**: Toolary – Web Productivity Toolkit  
- **Type**: Chrome Extension (Manifest V3)  
- **Purpose**: Unified interface for 9 web inspection, capture, and utility tools with room to scale past 50  
- **Tech Stack**: Vanilla JavaScript (ES6+), Chrome Extension APIs, Jest for testing  
- **Current Version**: 2.0.0  

## High-Level Architecture

- **Popup UI** – Searchable, filterable launcher with favorites, recents, and per-tool visibility controls.  
- **Content Script** – Lazily loads tool modules, manages lifecycle, and provides on-page overlays.  
- **Background Service Worker** – Dispatches activation messages, handles privileged APIs (downloads, screenshots), and tracks keyboard shortcuts.  
- **Core Modules** – Shared registry/loader/constants/message router powering all surfaces.  
- **Shared Utilities** – Helpers, icon factory, and popup UI components.  

### Key Directories

```
extension/
├── manifest.json                 # Chrome extension configuration
├── background.js                 # Service worker
├── content/
│   ├── content.js                # Runtime orchestrator & sticky-note hydration
│   └── content.css               # On-page styles (overlays, modals)
├── popup/
│   ├── popup.html                # Popup shell (search, tabs, settings)
│   ├── popup.css                 # Scalable layout & virtual list styling
│   └── popup.js                  # Search/filter/favorites logic, storage sync
├── core/
│   ├── constants.js              # Message types, categories, shortcut map
│   ├── messageRouter.js          # Abstraction over runtime/tabs messaging
│   ├── toolLoader.js             # Lazy importer with metadata backfill/cache
│   └── toolRegistry.js           # Manifest-driven tool catalogue
├── shared/
│   ├── helpers.js                # Cross-tool helpers (storage, modals, errors)
│   ├── icons.js                  # SVG icon registry + rendering helpers
│   └── ui-components.js          # Popup cards, toasts, virtualized grid
├── tools/
│   ├── inspect/                  # colorPicker, elementPicker, fontPicker, linkPicker
│   ├── capture/                  # mediaPicker, textPicker, screenshotPicker
│   ├── enhance/                  # stickyNotesPicker
│   └── utilities/                # siteInfoPicker
├── config/
│   └── tools-manifest.json       # Authoritative tool metadata & ordering
├── icons/                        # Extension + tool icons (PNG + SVG)
└── _locales/                     # i18n (en, fr, tr)
```

## Tool Module Contract

Every tool exports metadata plus activation hooks:

```js
export const metadata = {
  id: 'color-picker',
  name: 'Color Picker',
  category: 'inspect',
  icon: 'color',
  shortcut: { default: 'Alt+Shift+1' },
  permissions: ['activeTab'],
  tags: ['color', 'design'],
  keywords: ['hex', 'rgb', 'eyedropper']
};

export function activate(deactivate) { /* init */ }
export function deactivate() { /* teardown */ }
```

The loader backfills metadata from `tools-manifest.json` when absent, guaranteeing registry parity.

## Data & Storage

- **chrome.storage.sync**
  - `toolaryFavorites` – starred tools (auto-migrated from legacy Pickachu keys)  
  - `toolaryHiddenTools` – hidden from main grid (still searchable, legacy keys migrated on demand)
- **chrome.storage.local**
  - `toolaryRecentTools` – last five activations (Pickachu recents migrated automatically)  
  - Sticky-note content keyed per site (`toolaryStickyNotes_*`) with migration from legacy prefixes

## Commands & Shortcuts

| Command | Shortcut (Win/Linux) | Shortcut (macOS) | Tool |
|---------|----------------------|------------------|------|
| Toggle Popup | Ctrl+Shift+P | Cmd+Shift+P | Popup |
| Activate Color Picker | Alt+Shift+1 | Alt+Shift+1 | Inspect |
| Activate Element Picker | Alt+Shift+2 | Alt+Shift+2 | Inspect |
| Activate Screenshot Picker | Alt+Shift+3 | Alt+Shift+3 | Capture |
| Fast Search | `/` | `/` | Popup focus |

- All other tools remain available via the popup UI (click or search) without global shortcuts.

## Testing & Quality Gates

- **Automated**: `npm run lint`, `npm test` (Jest + jsdom). 98.3% test coverage across core modules (56 tests passing).  
- **Manual**: All 9 tools validated on representative pages; popup accessibility audited (keyboard, ARIA).  
- **Performance Guardrails**: Popup open <100 ms, search update <50 ms on reference hardware (cold load + cached).  

## Release Checklist

1. `npm run lint && npm test`  
2. Manually verify tools across required websites/themes/languages.  
3. Update `CHANGELOG.md`, bump `package.json` version.  
4. Package: `zip -r toolary-vX.Y.Z.zip extension/` (ensure `node_modules/` excluded).  
5. Smoke test packaged build in Chrome.  
6. Publish assets (screenshots / store description), create tag `vX.Y.Z`.  

## Maintenance Notes

- Keep `tools-manifest.json` as the single source of truth for tool metadata.  
- When adding tools, include localized strings (`_locales/*`), metadata, tests, and icon assets.  
- Popup virtual grid thresholds assume ~110px card height—adjust rowHeight if layout changes.  
- Sticky notes support legacy keys; remove migration after v2.1 when safe.  

## Useful Commands

```bash
npm run lint           # ESLint across extension code
npm test               # Jest suite (jsdom)
zip -r dist/toolary.zip extension -x \"*.DS_Store\" # Package for Chrome Web Store
```

Document last updated for Toolary v2.0.0.
