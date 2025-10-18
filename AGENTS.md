# AGENTS.md – Toolary AI Developer Guide

## Project Overview

**Toolary** is a Chrome extension (Manifest V3) providing 9+ web productivity tools with architecture to scale to 50+ tools.

- **Version:** 2.0.0
- **Tech:** Vanilla JavaScript ES6+ modules, Chrome Extension APIs, Jest
- **Languages:** English, Turkish, French (i18n via `_locales/`)
- **Test Coverage:** 98.3% (56 tests passing)

## Architecture

```
User clicks tool → popup.js sends message → background.js injects content.js 
→ content.js lazy loads tool module → tool activates → cleanup on deactivate
```

**Key Principles:**
- **Lazy loading:** Tools load only when activated (via `toolLoader.js`)
- **Single source of truth:** `config/tools-manifest.json` defines all tool metadata
- **Module caching:** Loaded tools stay in memory until tab closes
- **Background service worker:** Handles screenshots, downloads, global shortcuts

## Directory Structure

```
extension/
├── manifest.json              # Extension config, permissions, commands
├── background.js              # Service worker: tool activation, shortcuts, API calls
├── popup/
│   ├── popup.html            # UI: search, categories, tool grid
│   ├── popup.css             # Styling with CSS custom properties
│   └── popup.js              # Search/filter logic, pagination, storage sync
├── content/
│   ├── content.js            # Tool orchestrator, message router
│   └── content.css           # On-page overlays, modals, tooltips
├── core/
│   ├── constants.js          # Message types, categories, shortcut map
│   ├── messageRouter.js      # chrome.runtime/tabs.sendMessage abstraction
│   ├── toolLoader.js         # Lazy import() with cache
│   └── toolRegistry.js       # Loads tools-manifest.json, provides getters
├── shared/
│   ├── helpers.js            # Storage, modals, error handling, i18n
│   ├── icons.js              # SVG icon registry
│   └── ui-components.js      # Tool cards, virtual grid, toasts
├── tools/
│   ├── inspect/              # colorPicker, elementPicker, fontPicker, linkPicker
│   ├── capture/              # mediaPicker, textPicker, screenshotPicker
│   ├── enhance/              # stickyNotesPicker
│   └── utilities/            # siteInfoPicker
├── config/
│   └── tools-manifest.json   # Tool metadata (id, name, category, icon, tags, etc.)
├── icons/                    # PNG icons + SVG tool icons
└── _locales/                 # en/fr/tr messages.json
```

## Adding a New Tool

### 1. Create tool module in `tools/<category>/<toolName>.js`

```javascript
import { showError, handleError } from '../../shared/helpers.js';

export const metadata = {
  id: 'my-tool',
  name: 'My Tool',
  category: 'utilities',
  icon: 'info',
  shortcut: { default: 'Alt+Shift+9', mac: 'Alt+Shift+9' }, // optional
  permissions: ['activeTab'],
  tags: ['utility', 'helper'],
  keywords: ['search', 'terms']
};

export async function activate(deactivate) {
  try {
    // Tool logic here
    console.log('Tool activated');
    
    // Call deactivate when done:
    // deactivate();
  } catch (error) {
    handleError(error, 'my-tool.activate');
    showError('Failed to activate tool');
    deactivate();
  }
}

export function deactivate() {
  // Cleanup: remove listeners, overlays, etc.
  console.log('Tool deactivated');
}
```

### 2. Add to `config/tools-manifest.json`

```json
{
  "id": "my-tool",
  "name": "My Tool",
  "category": "utilities",
  "module": "utilities/myTool.js",
  "order": 10,
  "icon": "info",
  "i18n": {
    "label": "myTool",
    "title": "myToolTitle"
  },
  "tags": ["utility", "helper"],
  "keywords": ["search", "terms"],
  "permissions": ["activeTab"]
}
```

### 3. Add icon to `extension/icons/tools/my-tool.svg` (optional)

### 4. Add i18n strings to `_locales/*/messages.json`

```json
{
  "myTool": { "message": "My Tool" },
  "myToolTitle": { "message": "My Tool Title" }
}
```

### 5. Add keyboard shortcut to `manifest.json` (optional)

```json
{
  "commands": {
    "activate-my-tool": {
      "suggested_key": { "default": "Alt+Shift+9" },
      "description": "__MSG_cmdMyTool__"
    }
  }
}
```

And update `background.js`:

```javascript
const COMMAND_TOOL_MAP = {
  'activate-my-tool': 'my-tool',
  // ...
};
```

### 6. Write tests in `test/modules.test.js`

```javascript
import { activate as activateMyTool } from '../extension/tools/utilities/myTool.js';

describe('My Tool', () => {
  test('should activate', () => {
    const mockDeactivate = jest.fn();
    expect(() => activateMyTool(mockDeactivate)).not.toThrow();
  });
});
```

## Storage Structure

### chrome.storage.sync (cross-device)
- `toolaryFavorites`: Array of tool IDs
- `toolaryHiddenTools`: Array of hidden tool IDs

### chrome.storage.local (device-specific)
- `toolaryRecentTools`: Array of last 5 used tool IDs
- `toolaryStickyNotes_<domain>`: Per-site sticky notes data

### Legacy migration
Auto-migrates from old Pickachu keys: `pickachuFavorites`, `pickachuHiddenTools`, `pickachuRecentTools`

## Keyboard Shortcuts

| Shortcut | Tool | Scope |
|----------|------|-------|
| `Ctrl+Shift+P` (Win) / `Cmd+Shift+P` (Mac) | Toggle popup | Global |
| `Alt+Shift+1` | Color Picker | Global |
| `Alt+Shift+2` | Element Picker | Global |
| `Alt+Shift+3` | Screenshot Picker | Global |
| `/` | Focus search in popup | Popup only |

Shortcuts work globally (even when popup is closed) via `chrome.commands` API handled in `background.js`.

## Important Features

### Sticky Menu Fix (screenshotPicker.js)
When capturing full-page screenshots, sticky/fixed elements are temporarily hidden:
1. `findStickyElements()` – Detects `position: fixed/sticky` elements
2. `hideStickyElements()` – Sets `visibility: hidden` before capture
3. `restoreStickyElements()` – Restores original styles after capture
4. Uses `finally` block to ensure cleanup even on errors

### Virtual Scrolling (ui-components.js)
`VirtualizedGrid` class renders only visible tools in viewport:
- **Threshold:** 24 tools (switches to virtual mode above this)
- **Overscan:** 6 rows (pre-renders for smooth scroll)
- **RowHeight:** 96px (card height for calculations)

### Search & Filter (popup.js)
- Real-time search across tool names, tags, keywords
- Category filtering (all, inspect, capture, enhance, utilities)
- Hidden tools still searchable but not shown in main grid
- Pagination: 6 tools per page

### Lazy Loading (toolLoader.js)
```javascript
loadToolModule(toolId) // Returns cached or imports module
activateTool(toolId, deactivate) // Loads + activates
clearToolModule(toolId) // Clears cache
```

## Testing & Quality

```bash
npm test          # Run Jest tests (56 tests, 98.3% coverage)
npm run lint      # ESLint check (must pass)
```

**Test files:**
- `test/core.test.js` – Core modules (registry, loader, router)
- `test/modules.test.js` – All tool activation
- `test/comprehensive.test.js` – Integration tests
- `test/helpers.test.js` – Utility functions

**Manual testing checklist:**
- All tools activate without errors
- Keyboard shortcuts work globally
- Search/filter performs well
- Storage persists across sessions
- i18n works in all languages
- Dark/light themes apply correctly

## Common Tasks

### Update version
1. Edit `manifest.json` → `version`
2. Edit `package.json` → `version`
3. Run `npm test && npm run lint`

### Add new category
1. Edit `core/constants.js` → `TOOL_CATEGORIES`
2. Edit `popup/popup.html` → Add category button
3. Edit `_locales/*/messages.json` → Add category name
4. Add icon in category menu SVG

### Debug tool not loading
1. Check `config/tools-manifest.json` → module path correct?
2. Check tool file exports `metadata`, `activate`, `deactivate`
3. Open DevTools → Console for errors
4. Verify `chrome.runtime.getURL('tools/...')` resolves

### Performance profiling
```javascript
// In popup.js
console.time('popup-open');
// ... initialization code
console.timeEnd('popup-open'); // Should be <100ms
```

## File Size Limits

- `tools-manifest.json`: ~173 lines (9 tools) → keep under 1000 lines
- `popup.js`: 1293 lines → consider splitting if >2000 lines
- Total extension: 544KB → target <2MB for fast installation

## Code Style

- **ES6 modules:** Use `import/export`, no CommonJS
- **Async/await:** Prefer over `.then()` chains
- **Error handling:** Always wrap in try/catch, use `handleError()`
- **No external deps:** Keep vanilla JS (except tests)
- **Comments:** JSDoc for public APIs only
- **Naming:** camelCase for variables, PascalCase for classes

## Deployment

1. `npm run lint && npm test` (must pass)
2. Test manually in Chrome: Load unpacked from `extension/`
3. Package: `zip -r toolary-vX.Y.Z.zip extension/ -x "*.DS_Store"`
4. Upload to Chrome Web Store Developer Dashboard
5. Tag release: `git tag vX.Y.Z && git push --tags`

---

**Last updated:** 2025-10-18 for Toolary v2.0.0
