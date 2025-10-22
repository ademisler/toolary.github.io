# AGENTS.md – Toolary Developer Guide

## Project Overview

**Toolary** is a Chrome extension (Manifest V3) providing 24 web productivity tools with AI integration and favorite system.

- **Version:** 1.0.0
- **Tech:** Vanilla JavaScript ES6+ modules, Chrome Extension APIs, Jest
- **Languages:** English, Turkish, French (i18n via `_locales/`)
- **AI Support:** Gemini API integration with key rotation and model selection
- **Test Coverage:** 36.01% (84 tests passing, 2 failed)

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
│   ├── toolRegistry.js       # Loads tools-manifest.json, provides getters
│   ├── aiConfig.js           # AI models, languages, tool-to-model mapping
│   └── aiManager.js          # AI API key rotation, model selection, API calls
├── shared/
│   ├── helpers.js            # Storage, modals, error handling, i18n
│   ├── icons.js              # SVG icon registry
│   └── ui-components.js      # Tool cards, virtual grid, toasts
├── tools/
│   ├── inspect/              # colorPicker, elementPicker, fontPicker, linkPicker
│   ├── capture/              # mediaPicker, textPicker, screenshotPicker, pdfGenerator, qrCodeGenerator, videoRecorder
│   ├── enhance/              # stickyNotesPicker, textHighlighter, readingMode, bookmarkManager, darkModeToggle
│   ├── utilities/            # siteInfoPicker, colorPaletteGenerator, copyHistoryManager
│   └── ai/                   # textSummarizer, textTranslator, contentDetector, emailGenerator, seoAnalyzer, aiChat
├── config/
│   ├── tools-manifest.json   # Tool metadata (id, name, category, icon, tags, etc.)
│   └── ai-tools-config.json  # AI tool model preferences
├── icons/                    # PNG icons + SVG tool icons
└── _locales/                 # en/fr/tr messages.json
```

## AI Integration System

### Overview

Toolary includes a comprehensive AI integration system built around Google's Gemini API, designed to support future AI-powered tools while maintaining performance and reliability.

### Key Features

- **API Key Rotation:** Automatic load balancing across multiple API keys
- **Model Selection:** Smart model selection (Gemini 2.5 Flash vs Flash-Lite)
- **Language Support:** 40+ languages with auto-detection
- **Error Handling:** Robust retry logic and rate limit management
- **Settings UI:** User-friendly configuration in popup settings

### Architecture

```
AI Tool → aiManager.js → Gemini API
         ↓
    Key Rotation & Model Selection
         ↓
    Language Processing & Error Handling
```

### Core Components

#### 1. `core/aiManager.js`
Main AI service managing API calls, key rotation, and model selection.

**Key Methods:**
- `callGeminiAPI(prompt, options)` - Main API call method
- `testAPIKey(apiKey)` - Test API key validity
- `getNextAvailableKey()` - Smart key rotation
- `selectModel(toolId, preference)` - Model selection logic

#### 2. `core/aiConfig.js`
Configuration for AI models, languages, and tool-to-model mapping.

**Key Exports:**
- `GEMINI_MODELS` - Available models
- `AI_LANGUAGES` - Supported languages (40+)
- `TOOL_MODEL_MAPPING` - Tool-specific model preferences

#### 3. Settings Integration
AI settings are integrated into the popup settings panel with dedicated UI.

**Settings Sections:**
- **Model Selection:** Auto/Smart/Lite options
- **Language Selection:** 40+ languages + auto-detection
- **API Key Management:** Add, test, remove API keys

**UI Features:**
- Real-time API key testing
- Key health status indicators
- Model preference persistence
- Language auto-detection

### Adding AI to a Tool

#### 1. Import AI Manager
```javascript
import { aiManager } from '../../core/aiManager.js';
```

#### 2. Make AI Call
```javascript
export async function activate(deactivate) {
  try {
    const prompt = "Analyze this text: " + selectedText;
    const response = await aiManager.callGeminiAPI(prompt, {
      toolId: 'my-ai-tool',
      userModelPreference: 'auto' // optional
    });
    
    // Use AI response
    showResult(response);
  } catch (error) {
    handleError(error, 'my-ai-tool.activate');
    showError('AI processing failed');
  }
}
```

#### 3. Configure Tool Model Preference
Add to `config/ai-tools-config.json`:
```json
{
  "my-ai-tool": "smart"
}
```

### AI Settings Management

#### API Key Management
- **Add Keys:** Users can add multiple Gemini API keys
- **Test Keys:** Built-in API key testing functionality
- **Key Rotation:** Automatic load balancing across keys
- **Error Handling:** Automatic key health monitoring

#### Model Selection
- **Auto:** Tool decides based on complexity
- **Smart:** Always use Gemini 2.5 Flash
- **Lite:** Always use Gemini 2.5 Flash-Lite

#### Language Support
- **Auto:** Detect browser language
- **Manual:** Choose from 40+ supported languages
- **Fallback:** English if language not supported

### Error Handling

#### API Errors
- **Rate Limiting:** Automatic retry with exponential backoff
- **Invalid Keys:** Mark as unhealthy, try next key
- **Network Issues:** Retry with different key
- **Quota Exceeded:** Graceful degradation

#### User Feedback
- **Toast Messages:** Success/error notifications
- **Status Indicators:** Key health status in UI
- **Loading States:** Visual feedback during API calls

### Best Practices

#### For AI Tools
1. **Always handle errors gracefully**
2. **Provide clear user feedback**
3. **Use appropriate model for task complexity**
4. **Include language instructions in prompts**
5. **Test with multiple API keys**

#### For Performance
1. **Cache responses when appropriate**
2. **Use lite model for simple tasks**
3. **Implement proper cleanup**
4. **Monitor API usage and costs**

## Favorite System

Toolary includes a comprehensive favorite system that allows users to mark tools as favorites and prioritize them in the tool grid.

### Features
- **Star Icon:** Each tool card displays a star icon in the top-right corner
- **Smart Sorting:** Favorite tools always appear at the top, sorted by usage count among themselves
- **Persistent Storage:** Favorites are stored in `chrome.storage.local` with key `toolaryFavoriteTools`
- **Real-time Updates:** Clicking the star immediately toggles favorite status and reorders the grid
- **Smooth Animations:** Grid reordering with CSS transitions for better UX

### Implementation
- **Storage:** `chrome.storage.local` with `toolaryFavoriteTools` key
- **State Management:** `state.favoriteTools` as a `Set` for O(1) lookups
- **Sorting Logic:** Two-tier sorting (favorite status → usage count)
- **UI Integration:** Star icon using existing `icons.createIconElement()` system

## Coffee Message System

Toolary includes a modern glassmorphism coffee toast system that displays humorous coffee-themed messages after successful tool operations, encouraging users to support the developer through Buy Me a Coffee donations.

### Features
- **Modern Glassmorphism Design:** Translucent glass effect with backdrop blur
- **Coffee-Themed Messages:** Humorous messages in Turkish, English, and French
- **Responsive Layout:** Horizontal layout with coffee emoji, centered text, and compact button
- **Smart Text Wrapping:** 5 words per line for optimal readability
- **Auto-Dismiss:** Messages automatically disappear after 6 seconds
- **Language Detection:** Automatically detects user's browser language
- **Buy Me a Coffee Integration:** Direct link to https://buymeacoffee.com/ademisler

### Design Specifications

#### Layout Structure
```
[☕] [     Centered Text     ] [Kahve Ismarla]
```
- **Coffee Emoji:** Left-aligned, 24px size
- **Text:** Center-aligned, 16px size, max-width 180px (5 words per line)
- **Button:** Right-aligned, compact "Kahve Ismarla" text

#### Visual Design
- **Background:** `rgba(255, 255, 255, 0.25)` with `backdrop-filter: blur(20px)`
- **Border:** `1px solid rgba(255, 255, 255, 0.18)`
- **Shadow:** Multi-layer box-shadow for depth
- **Hover Effect:** Increased opacity and blur on hover
- **Button:** Yellow gradient (`#FFDE00` to `#FFA500`) with 16px border-radius

#### Responsive Behavior
- **Desktop:** Horizontal layout with centered text
- **Mobile:** Vertical layout with left-aligned text
- **Text Sizing:** Adaptive font sizes based on message length
- **Button Sizing:** Compact design (90px min-width)

### Implementation

#### Core Components
- **`core/coffeeMessages.js`:** Message data for all 24 tools in 3 languages
- **`shared/coffeeToast.js`:** Custom toast component with donation button
- **`content/content.css`:** Modern glassmorphism styling with animations

#### Message Display
- **Trigger:** After successful tool operations (color picked, text extracted, etc.)
- **Position:** Fixed bottom-left corner (20px from edges)
- **Duration:** 6 seconds with slide-in/out animations
- **Styling:** Glassmorphism effect with backdrop blur and subtle shadows

#### Language Support
- **Auto-Detection:** Uses `chrome.i18n.getUILanguage()` with fallback to English
- **Supported Languages:** Turkish (tr), English (en), French (fr)
- **Button Text:** Localized compact button text:
  - Turkish: "Kahve Ismarla"
  - English: "Buy Coffee"
  - French: "Acheter Café"

#### Integration
- **Tool Integration:** All 24 tools call `showCoffeeMessageForTool(toolId)` after success
- **Error Handling:** Graceful fallback if messages fail to load
- **Performance:** Minimal impact with efficient toast management

### Message Examples
- **Color Picker (TR):** "Bu rengi bulana kadar 3 kahve içtim, 2 sinir krizi geçirdim. Bir fincanla moral olur!"
- **AI Summarizer (EN):** "Even AI doesn't work without coffee. Believe me, I've tested it."
- **Screenshot Picker (FR):** "En prenant la capture d'écran, ce n'est pas la souris qui tremblait, c'était ma main… faute de café."

## Adding a New Tool

### 1. Create tool module in `tools/<category>/<toolName>.js`

```javascript
import { showError, handleError } from '../../shared/helpers.js';

export const metadata = {
  id: 'my-tool',
  name: 'My Tool',
  category: 'utilities',
  icon: 'info',
  // shortcut: { default: 'Alt+Shift+9', mac: 'Alt+Shift+9' }, // ❌ DO NOT ADD - 4/4 limit reached
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
  // ❌ DO NOT add "shortcut" field - 4/4 limit reached
}
```

### 3. Add icon to `extension/shared/icons.js` (REQUIRED)

**Icon System:**
- Icons are defined in `extension/shared/icons.js` as SVG elements
- Uses Lucide-inspired design system (stroke-based, no fills)
- All icons use `currentColor` for theming compatibility
- 24x24 viewBox with 1.8px stroke width

**Add your icon definition:**

```javascript
// In extension/shared/icons.js, add to ICON_DEFINITIONS object:
'my-tool': {
  title: 'My Tool',
  elements: [
    { tag: 'path', attrs: { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' } }
  ]
}
```

**Icon Guidelines:**
- Keep it simple and minimal (max 3-4 elements)
- Use only `path`, `line`, `rect`, `circle` elements
- No `fill` attributes, only `stroke` and `currentColor`
- Match the style of existing icons
- 24x24 viewBox, elements should fit within bounds

### 4. Add i18n strings to `_locales/*/messages.json`

```json
{
  "myTool": { "message": "My Tool" },
  "myToolTitle": { "message": "My Tool Title" }
}
```

### 5. Add keyboard shortcut to `manifest.json` (❌ NOT RECOMMENDED)

**⚠️ WARNING: Chrome extension shortcut limit is 4/4 reached!**

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

**To add a new shortcut, you MUST first remove an existing one from `manifest.json`.**

And update `background.js`:

```javascript
const COMMAND_TOOL_MAP = {
  'activate-my-tool': 'my-tool',
  // ...
};
```

**Recommendation:** Skip shortcuts for new tools and focus on discoverability through search and categories.

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

## Icon System

### Design Principles
- **Lucide-inspired:** Clean, minimal stroke-based icons
- **Consistent styling:** All icons follow the same visual language
- **Theme compatibility:** Use `currentColor` for automatic dark/light theme support
- **Performance:** SVG elements defined in JavaScript, no external files

### Technical Specifications
- **ViewBox:** 24x24 pixels
- **Stroke width:** 1.8px (default)
- **Stroke cap:** round
- **Stroke join:** round
- **Color:** `currentColor` (inherits from CSS)

### Available Elements
- `path` - Complex shapes and curves
- `line` - Straight lines
- `rect` - Rectangles and squares
- `circle` - Circles and ellipses

### Current Icons
Available icon names for tools:
- `color` - Color picker
- `text` - Text extraction
- `element` - DOM element picker
- `screenshot` - Screenshot capture
- `link` - Link validation
- `font` - Font inspection
- `image` - Media picker
- `media` - Media extraction
- `site` - Site information
- `note` / `notes` - Sticky notes
- `developer` - Developer tools
- `copy` - Copy functionality
- `download` - Download actions
- `export` - Export functionality
- `pdf` - PDF generation
- `favorite` / `star` - Favorites
- `trash` - Delete actions
- `info` - Information display
- `alert` - Warnings
- `success` - Success indicators
- `close` - Close actions
- `plus` - Add actions
- `palette` - Color palette
- `highlighter` - Text highlighting
- `book-open` - Reading mode
- `qrcode` - QR code generation
- `bookmark` - Bookmark manager
- `list` - List view
- `folder` - Folder/collection
- `tag` - Tag/label
- `edit` - Edit/pen
- `upload` - Upload action
- `file-text` - Text document
- `play` - Play button
- `wrench` - Tool/settings
- `book` - Book/document
- `video` - Video recording
- `sun` - Sun icon (light mode)
- `moon` - Moon icon (dark mode)
- `brain` - AI tools
- `sparkles` - AI effects
- `email` - Email/mail functionality

## Storage Structure

### chrome.storage.sync (cross-device)
- `toolaryFavorites`: Array of tool IDs
- `toolaryHiddenTools`: Array of hidden tool IDs

### chrome.storage.local (device-specific)
- `toolaryRecentTools`: Array of last 5 used tool IDs
- `toolaryStickyNotes_<domain>`: Per-site sticky notes data
- `toolaryDarkModeToggle`: Dark mode toggle state and preferences
- `toolaryAIKeys`: Array of AI API keys with metadata
- `toolaryAIModel`: User's AI model preference (auto/smart/lite)
- `toolaryAILanguage`: User's AI language preference
- `toolaryToolUsage`: Tool usage statistics for sorting
- `toolaryFavoriteTools`: Array of favorite tool IDs

### Legacy migration
Auto-migrates from old legacy keys: `toolaryLegacyFavorites`, `toolaryLegacyHiddenTools`, `toolaryLegacyRecentTools`

**Note:** Recent tools feature (`toolaryRecentTools`) is documented but not currently implemented in the codebase.

## Keyboard Shortcuts

### ⚠️ **IMPORTANT: Chrome Extension Shortcut Limitations**

**Chrome extensions are limited to MAXIMUM 4 keyboard shortcuts** defined in `manifest.json`. This is a hard limit imposed by Chrome.

### Current Shortcuts (4/4 used)

| Shortcut | Tool | Scope |
|----------|------|-------|
| `Ctrl+Shift+P` (Win) / `Cmd+Shift+P` (Mac) | Toggle popup | Global |
| `Alt+Shift+1` | Color Picker | Global |
| `Alt+Shift+3` | Screenshot Picker | Global |
| `Alt+Shift+7` | Text Highlighter | Global |
| `Alt+Shift+8` | Reading Mode | Global |
| `/` | Focus search in popup | Popup only |

### Guidelines for New Tools

**❌ DO NOT add shortcuts to new tools** - The 4 shortcut limit is already reached.

**✅ Instead:**
- Use the popup interface for tool access
- Focus on making tools discoverable through search and categories
- Consider tool importance when assigning shortcuts (only most-used tools get shortcuts)

### Shortcut Management

- **Global shortcuts:** Work even when popup is closed via `chrome.commands` API in `background.js`
- **Popup shortcuts:** Only work when popup is open
- **To change shortcuts:** Edit `manifest.json` → `commands` section
- **To add new shortcut:** Must remove an existing one first (4/4 limit)

## Testing & Quality

```bash
npm test          # Run Jest tests (84 tests passing, 2 failed, 36.01% coverage)
npm run lint      # ESLint check (must pass)
```

**Test files:**
- `test/core.test.js` – Core modules (registry, loader, router)
- `test/modules.test.js` – All tool activation (2 tests failing due to test environment limitations)
- `test/comprehensive.test.js` – Integration tests
- `test/helpers.test.js` – Utility functions
- `test/stickyNotesPicker.test.js` – Sticky notes specific tests
- `test/simple.test.js` – Basic functionality tests
- `test/extension.test.js` – Extension-level tests

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

### Fix test environment issues
1. Install missing polyfills: `npm install --save-dev canvas`
2. Add TextEncoder/TextDecoder polyfills to test setup
3. Mock Chrome APIs properly in test environment
4. Update Jest configuration for better compatibility

## Troubleshooting Guide

### Test Failures
**Common Issues:**
1. **TextEncoder/TextDecoder not defined:** Add polyfills for test environment
2. **Canvas context unavailable:** Install canvas package for Jest
3. **Performance API missing:** Mock performance.getEntriesByType in tests
4. **Chrome APIs not available:** Use proper mocks in test environment

**Quick Fixes:**
```javascript
// Add to jest.config.js
setupFilesAfterEnv: ['<rootDir>/test/setup.js']

// In test/setup.js
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
  global.TextDecoder = require('util').TextDecoder;
}
```

### Icons Not Displaying (Showing Circles)
**Symptoms:** Tool icons appear as circles instead of proper icons
**Common Causes:**
1. Icon name not defined in `ICON_DEFINITIONS`
2. Missing SVG file in `icons/tools/`
3. Wrong function name (`renderIcon` vs `createIconElement`)
4. Case sensitivity issues

**Debug Steps:**
1. Check console for "Using icon definition" or "Loading icon" messages
2. Verify icon name in `tools-manifest.json` matches `ICON_DEFINITIONS`
3. Ensure SVG file exists: `icons/tools/icon-name.svg`
4. Use `createIconElement` function, not `renderIcon`
5. Check for JavaScript errors in console

**Quick Fix:**
```javascript
// Add missing icon definition in icons.js
'your-icon': {
  title: 'Your Icon',
  elements: [
    { tag: 'path', attrs: { d: 'M...' } }
  ]
}
```

### Pagination Not Working
**Symptoms:** Page navigation buttons don't work or show wrong page numbers
**Common Causes:**
1. Missing pagination elements in HTML
2. JavaScript errors in pagination functions
3. State not updating correctly

**Debug Steps:**
1. Check `elements.pagination`, `elements.prevPage`, `elements.nextPage` exist
2. Verify `updatePagination()` is called after filtering
3. Check `state.currentPage` and `state.toolsPerPage` values
4. Ensure `renderMainToolsGrid()` updates correctly

### Mouse Wheel Navigation Not Working
**Symptoms:** Mouse wheel doesn't navigate pages
**Common Causes:**
1. Event listener not attached
2. Wrong target element
3. Pagination not visible

**Debug Steps:**
1. Check if wheel event listener is attached to `.tools-virtual-container`
2. Verify pagination is visible (`!elements.pagination.hidden`)
3. Test with `{ passive: false }` option
4. Check for event.preventDefault() calls

## Permissions & Security

### Manifest Permissions

Toolary requests the following permissions in `manifest.json`:

```json
{
  "permissions": [
    "activeTab",      // Access current tab when tools are activated
    "scripting",      // Inject content scripts for tool functionality
    "clipboardWrite", // Copy extracted content to clipboard
    "clipboardRead",  // Read clipboard for Copy History Manager
    "storage",        // Save user preferences and data
    "tabs",          // Access tab information for bookmark management
    "downloads",     // Save captured content and generated files
    "tabCapture"     // Record screen content for Video Recorder
  ],
  "host_permissions": [
    "<all_urls>"     // Work on any website
  ]
}
```

### Permission Usage by Tool Category

#### Inspection Tools
- **Color Picker, Element Picker, Font Picker, Link Picker**
- **Required:** `activeTab`, `scripting`, `<all_urls>`
- **Purpose:** Access DOM elements and CSS properties

#### Capture Tools
- **Screenshot Picker, Media Picker, Text Picker, Video Recorder, QR Generator, PDF Generator**
- **Required:** `activeTab`, `scripting`, `downloads`, `tabCapture` (Video Recorder only), `<all_urls>`
- **Purpose:** Capture and download page content

#### Enhancement Tools
- **Sticky Notes, Text Highlighter, Reading Mode, Bookmark Manager, Dark Mode**
- **Required:** `activeTab`, `scripting`, `storage`, `tabs` (Bookmark Manager only), `<all_urls>`
- **Purpose:** Modify page appearance and manage preferences

#### Utility Tools
- **Site Info Picker, Color Palette Generator, Copy History Manager**
- **Required:** `activeTab`, `scripting`, `clipboardRead`, `clipboardWrite`, `storage`, `<all_urls>`
- **Purpose:** Analyze site information and manage clipboard

#### AI Tools
- **Text Summarizer, Translator, Content Detector, Email Generator, SEO Analyzer, AI Chat**
- **Required:** `activeTab`, `scripting`, `storage`, `<all_urls>`
- **Purpose:** Process content with AI services (external API calls)

### Security Model

- **Explicit Activation:** Tools only access page content when user activates them
- **No Background Access:** No automatic data collection or processing
- **Local Processing:** All data processing happens in user's browser
- **Minimal Permissions:** Each permission tied to specific functionality
- **User Control:** Users can disable tools and clear stored data

### Adding Permissions for New Tools

When adding a new tool, specify required permissions in the tool's metadata:

```javascript
export const metadata = {
  id: 'my-tool',
  name: 'My Tool',
  category: 'utilities',
  icon: 'info',
  permissions: ['activeTab'], // Specify required permissions
  tags: ['utility', 'helper'],
  keywords: ['search', 'terms']
};
```

**Permission Guidelines:**
- Use `activeTab` for tools that need to access current page content
- Add `storage` for tools that save user preferences or data
- Add `downloads` for tools that save files locally
- Add `clipboardWrite` for tools that copy content to clipboard
- Add `clipboardRead` only for clipboard monitoring tools
- Add `tabs` only for tools that need tab information (title, URL, etc.)
- Add `tabCapture` only for screen recording functionality

## File Size Limits

- `tools-manifest.json`: 432 lines (24 tools) → keep under 1000 lines
- `popup.js`: ~2100 lines → consider splitting if >2000 lines
- Total extension: ~1.1MB → target <2MB for fast installation

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

**Pre-deployment Checklist:**
- [ ] All tests passing (or known failures documented)
- [ ] ESLint passes without errors
- [ ] Manual testing completed on multiple sites
- [ ] AI API keys tested and working
- [ ] All 24 tools functional
- [ ] Coffee messages displaying correctly
- [ ] Favorite system working
- [ ] Dark/light theme switching works
- [ ] All languages (en/tr/fr) working
- [ ] Keyboard shortcuts functional
- [ ] Storage persistence verified

---

**Last updated:** 2025-01-27 for Toolary v1.0.0 (24 productivity tools with AI integration, favorite system, and coffee toast messages)

**Current Status:**
- ✅ 24 tools implemented and functional
- ✅ AI integration with Gemini API
- ✅ Favorite system working
- ✅ Coffee toast messages implemented
- ⚠️ Test coverage: 36.01% (needs improvement)
- ⚠️ 2 tests failing due to test environment limitations
- ✅ All core functionality working in production