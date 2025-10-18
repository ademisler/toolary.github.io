# Toolary Refactor & Expansion Plan

## 1. Goals & Scope

### Main Purpose

Transform Pickachu into **Toolary** - a comprehensive multi-tool web assistant for all browser users (not just developers). Scale from 9 tools to support 50+ tools across 5 categories: Inspect, Capture, Enhance, AI, and Utilities.

### Target Audience

- **Primary**: All browser users (designers, content creators, researchers, students, professionals)
- **Secondary**: Web developers (maintain existing developer tools)

### Key Constraints

- **Manifest V3** compliance maintained
- **No external dependencies** for core tools (vanilla JavaScript ES6+)
- **Optional external APIs** for AI tools only (OpenAI, Anthropic, etc.)
- **Privacy-first**: All non-AI tools process data locally
- **Performance**: Lazy-loading architecture for 50+ tools

### Backward Compatibility (No Migration Needed)

- All 9 existing tools preserved and functional
- Keyboard shortcuts streamlined to popup toggle plus Alt+Shift+1–3 (Color, Element, Screenshot); remaining tools accessible from the popup
- Multi-language support (en, fr, tr) expanded
- Module interface pattern (activate/deactivate) preserved
- Chrome storage structure extended, not replaced

---

## 2. Architecture & Directory Design

### Proposed Folder Structure

```
extension/
├── manifest.json                    # Updated to Toolary
├── background.js                    # Enhanced with tool registry
├── popup/
│   ├── popup.html                   # Enhanced with search/filter UI
│   ├── popup.css                    # Updated branding + search styles
│   └── popup.js                     # Tool registry + lazy loading logic
├── content/
│   ├── content.js                   # Message routing + tool loader
│   └── content.css                  # Updated CSS variables
├── core/
│   ├── toolRegistry.js              # Central tool registration system
│   ├── toolLoader.js                # Lazy-loading module loader
│   ├── messageRouter.js             # Popup ↔ content ↔ background messaging
│   └── constants.js                 # Categories, tags, tool IDs
├── tools/
│   ├── inspect/                     # Developer inspection tools
│   │   ├── colorPicker.js           # Migrated from modules/
│   │   ├── elementPicker.js
│   │   ├── fontPicker.js
│   │   └── linkPicker.js
│   ├── capture/                     # Content capture tools
│   │   ├── mediaPicker.js
│   │   ├── textPicker.js
│   │   └── screenshotPicker.js
│   ├── enhance/                     # Page enhancement tools
│   │   ├── stickyNotesPicker.js
│   │   └── [future: darkMode, translator, etc.]
│   ├── ai/                          # AI-powered tools (optional APIs)
│   │   └── [future: summarizer, chatAssistant, etc.]
│   └── utilities/                   # General utilities
│       ├── siteInfoPicker.js
│       └── [future: qrGenerator, passwordGen, etc.]
├── shared/
│   ├── helpers.js                   # Migrated from modules/helpers.js
│   ├── icons.js                     # Migrated from modules/icons.js
│   └── ui-components.js             # Reusable UI components
├── config/
│   └── tools-manifest.json          # Tool metadata registry
├── icons/
│   └── [updated Toolary branding icons]
└── _locales/
    ├── en/messages.json             # Updated strings
    ├── fr/messages.json
    └── tr/messages.json
```

### Message Flow Architecture

```
Popup (popup.js)
   ↓ chrome.tabs.sendMessage
Content Script (content.js)
   ↓ import() lazy load
Tool Module (tools/category/toolName.js)
   ↓ chrome.runtime.sendMessage (if needed)
Background Worker (background.js)
```

**Flow Details:**

1. User clicks tool in popup → `popup.js` sends `{action: 'activate', toolId: 'colorPicker'}`
2. `content.js` receives message → checks `toolRegistry` → lazy loads tool via `toolLoader.js`
3. Tool activates → performs action → sends results back through message chain
4. Background worker handles storage, downloads, tab management

### Module Interface Pattern

Every tool exports:

```javascript
export const metadata = {
  id: 'colorPicker',
  name: 'Color Picker',
  category: 'inspect',
  tags: ['color', 'design', 'css'],
  shortcut: 'Alt+Shift+1',
  icon: '🎨',
  permissions: ['activeTab'],
  requiresAPI: false, // true for AI tools
  apiProvider: null   // 'openai', 'anthropic', etc.
};

export async function activate(deactivate) {
  // Tool initialization
}

export function deactivate() {
  // Cleanup
}
```

---

## 3. Rebranding & Manifest Updates

### Name Changes

- **Extension Name**: "Pickachu" → "Toolary"
- **Variables**: All `pickachu-*` CSS classes → `toolary-*`
- **Storage Keys**: Prefix migration `pickachu_` → `toolary_`
- **Function Names**: Update internal references

### Files Requiring Updates

| File | Changes |

|------|---------|

| `manifest.json` | name, description, short_name, commands |

| `popup/popup.html` | Title, header text, meta tags |

| `popup/popup.js` | Variable names, storage keys |

| `content/content.css` | CSS class prefixes (`.pickachu-*` → `.toolary-*`) |

| `content/content.js` | Variable names, message formats |

| `background.js` | Extension name references |

| `_locales/*/messages.json` | All "extensionName", "extensionDescription" |

| All module files | Comment headers, metadata |


---

## 4. Scalability Strategy (50+ Tools)

### Tool Registration System

**File: `core/toolRegistry.js`**

```javascript
// Central registry of all tools with metadata
// Tools register themselves here at build time
export const toolRegistry = new Map();

export function registerTool(metadata) {
  toolRegistry.set(metadata.id, metadata);
}

export function getToolsByCategory(category) {
  return Array.from(toolRegistry.values())
    .filter(tool => tool.category === category);
}

export function searchTools(query) {
  // Search by name, tags, category
}
```

### Lazy Loading Strategy

**File: `core/toolLoader.js`**

```javascript
const loadedTools = new Map();

export async function loadTool(toolId) {
  if (loadedTools.has(toolId)) {
    return loadedTools.get(toolId);
  }
  
  const metadata = toolRegistry.get(toolId);
  const toolPath = `../tools/${metadata.category}/${toolId}.js`;
  const module = await import(toolPath);
  
  loadedTools.set(toolId, module);
  return module;
}
```

### Tool Metadata Manifest

**File: `config/tools-manifest.json`**

```json
{
  "version": "2.0.0",
  "tools": [
    {
      "id": "colorPicker",
      "name": "Color Picker",
      "category": "inspect",
      "tags": ["color", "design", "css", "developer"],
      "shortcut": "Alt+Shift+1",
      "icon": "palette",
      "enabled": true,
      "premium": false
    }
  ]
}
```

### Performance Optimizations

1. **Startup**: Load only tool metadata (names, icons, categories) - ~10KB
2. **Activation**: Import tool code only when user activates it
3. **Caching**: Keep activated tools in memory, clear on tab close
4. **Background**: Service worker remains lightweight, delegates to content scripts

### Toggle System

- User preferences stored in `chrome.storage.local`
- Tools can be disabled individually in settings
- Disabled tools hidden from popup but remain in registry

---

## 5. Popup UI Plan

### Current Design Preservation

- Keep existing visual style (modern, clean, gradient backgrounds)
- Maintain button grid layout for tools
- Preserve dark/light theme support
- Keep animation and transition styles

### New UI Components

#### Search Bar (Top of Popup)

```html
<div class="toolary-search">
  <input type="text" placeholder="Search tools..." id="tool-search" />
  <button class="clear-search">×</button>
</div>
```

#### Category Filter Tabs

```html
<div class="toolary-categories">
  <button class="category-tab active" data-category="all">All</button>
  <button class="category-tab" data-category="inspect">Inspect</button>
  <button class="category-tab" data-category="capture">Capture</button>
  <button class="category-tab" data-category="enhance">Enhance</button>
  <button class="category-tab" data-category="ai">AI</button>
  <button class="category-tab" data-category="utilities">Utilities</button>
</div>
```

#### Tool Grid (Existing + Enhanced)

```html
<div class="toolary-tools-grid">
  <!-- Dynamically populated from toolRegistry -->
  <!-- Each tool button includes category badge and favorite star -->
</div>
```

#### Favorites System

- Star icon on each tool button
- "Favorites" category filter shows starred tools
- Stored in `chrome.storage.sync` for cross-device sync

### Scalability UI Features

1. **Virtual Scrolling** (if needed): Load visible tools only in viewport
2. **Collapsible Sections**: Each category can collapse/expand
3. **Pagination**: "Load More" button after 20 tools per category
4. **Quick Access**: Recent tools section at top (last 5 used)
5. **Keyboard Navigation**:

   - Tab through tools
   - Enter to activate
   - Arrow keys to navigate grid
   - `/` to focus search
   - Number keys 1-9 for first 9 tools

### Performance Targets

- Popup open time: <100ms (even with 50 tools)
- Search response: <50ms
- Filter change: <30ms
- Smooth 60fps animations

### Accessibility

- ARIA labels for all interactive elements
- Focus indicators for keyboard navigation
- Screen reader announcements for tool activation
- High contrast mode support

---

## 6. Testing & Quality Assurance Plan

### Jest Test Updates

#### New Test Files

- `test/core/toolRegistry.test.js` - Registry functions
- `test/core/toolLoader.test.js` - Lazy loading
- `test/core/messageRouter.test.js` - Message passing
- `test/popup/search.test.js` - Search functionality
- `test/popup/filters.test.js` - Category filtering

#### Updated Test Files

- `test/comprehensive.test.js` - Add new tool paths
- `test/modules.test.js` → `test/tools/all-tools.test.js`
- `test/helpers.test.js` → `test/shared/helpers.test.js`

#### Test Coverage Requirements

- Core systems: 90%+ coverage
- Individual tools: 80%+ coverage
- UI components: 70%+ coverage

### ESLint Rules

- Maintain existing `eslint.config.cjs`
- Add rule: Enforce tool metadata exports
- Add rule: Consistent naming conventions (`toolary-*` prefix)

### Manual Validation Checklist

**Existing 9 Tools (Regression Testing):**

- [ ] Color Picker: EyeDropper API works, colors copy correctly
- [ ] Element Picker: Highlighting works, selectors generated
- [ ] Link Picker: Links extracted, categorized correctly
- [ ] Font Picker: Font info accurate, CSS properties correct
- [ ] Media Picker: Images/videos found, download works
- [ ] Text Picker: Text extraction works, clipboard integration
- [ ] Screenshot Picker: Full page capture, stitching correct
- [ ] Sticky Notes: Notes persist, draggable, color options work
- [ ] Site Info: Analysis complete, tech stack detected

**New Features:**

- [ ] Search finds tools by name and tags
- [ ] Category filters show correct tools
- [ ] Favorites persist across sessions
- [ ] Lazy loading doesn't cause delays
- [ ] Keyboard shortcuts work for all tools
- [ ] Theme switching works correctly
- [ ] Multi-language support intact

### Automated Testing Strategy

1. Run `npm test` after each phase
2. Run `npm run lint` before commits
3. Manual testing in Chrome after each milestone
4. Test on 3 different websites per tool

---

## 7. Versioning & Rollback Strategy

### Git Branch Strategy

```
main (v1.1 - Pickachu stable)
  └── develop/toolary (integration branch)
       ├── feature/phase1-branding
       ├── feature/phase2-architecture
       ├── feature/phase3-modules
       ├── feature/phase4-popup-ui
       └── feature/phase5-testing
```

### Milestone Tagging

- `v1.1.0` - Last Pickachu version (current)
- `v2.0.0-alpha.1` - Phase 1 complete (branding)
- `v2.0.0-alpha.2` - Phase 2 complete (architecture)
- `v2.0.0-beta.1` - Phase 4 complete (full UI)
- `v2.0.0` - Final Toolary release

### Rollback Points

Each phase creates a rollback commit:

```bash
git tag -a "phase-N-complete" -m "Phase N: [description] - Safe rollback point"
```

If issues arise:

```bash
git checkout phase-N-complete
# Or
git revert <commit-range>
```

### Chrome Extension Testing

1. Load unpacked after each phase completion
2. Test on 3 sample websites
3. Export as .crx for beta testing (Phase 5)
4. Version bump in `manifest.json` after each phase

---

## 8. Milestones & Phases

### Phase 0: Planning & Confirmation

**Duration**: Current phase

**Status**: In progress

**Tasks:**

- [x] Review existing codebase
- [x] Define requirements and constraints
- [x] Design architecture and folder structure
- [ ] Review and approve this plan
- [ ] Create `develop/toolary` branch

**Acceptance Criteria:**

- Plan approved by project owner
- All architectural decisions finalized
- Git branch created and ready

**Risks:** None

**Approval Gate:** ✓ Proceed to Phase 1 after plan approval

---

### Phase 1: Branding & Manifest Updates

**Duration**: ~2 hours

**Dependencies**: Phase 0 approved

**Tasks:**

1. Update `manifest.json` with Toolary branding
2. Update all locale files (`_locales/*/messages.json`)
3. Replace CSS class names (`pickachu-*` → `toolary-*`)
4. Update variable names in JavaScript files
5. Create placeholder Toolary icons
6. Update HTML meta tags and titles
7. Update storage key prefixes
8. Update all code comments and headers

**Affected Files:**

- `manifest.json`
- `_locales/en/messages.json`
- `_locales/fr/messages.json`
- `_locales/tr/messages.json`
- `popup/popup.html`
- `popup/popup.css`
- `popup/popup.js`
- `content/content.css`
- `content/content.js`
- `background.js`
- All module files (comments only)

**Acceptance Criteria:**

- Extension loads with "Toolary" name
- All UI text shows "Toolary"
- CSS styling works (no broken classes)
- Storage migration works (old data accessible)
- No console errors

**Risks:**

- Storage key changes break existing functionality
- CSS class renaming causes styling issues

**Mitigation:**

- Create storage migration function
- Test all CSS selectors with global find/replace
- Use regex for consistent renaming

**Approval Gate:** ✓ Manual test in Chrome, verify all 9 tools work

---

### Phase 2: Architecture Redesign

**Duration**: ~4 hours

**Dependencies**: Phase 1 complete

**Tasks:**

1. Create new folder structure (`core/`, `tools/`, `shared/`, `config/`)
2. Implement `core/toolRegistry.js`
3. Implement `core/toolLoader.js` (lazy loading)
4. Implement `core/messageRouter.js`
5. Create `core/constants.js` (categories, tags)
6. Create `config/tools-manifest.json`
7. Move `modules/helpers.js` → `shared/helpers.js`
8. Move `modules/icons.js` → `shared/icons.js`
9. Update import paths in all files
10. Update `background.js` to use new architecture

**Affected Files:**

- New: `core/toolRegistry.js`
- New: `core/toolLoader.js`
- New: `core/messageRouter.js`
- New: `core/constants.js`
- New: `config/tools-manifest.json`
- Moved: `shared/helpers.js`
- Moved: `shared/icons.js`
- Updated: `content/content.js` (import paths)
- Updated: `popup/popup.js` (registry integration)
- Updated: `background.js` (message routing)

**Acceptance Criteria:**

- New folder structure created
- Tool registry loads all 9 tools
- Lazy loading works (tools load on demand)
- Message routing functions correctly
- All imports resolve correctly
- No broken dependencies

**Risks:**

- Import path changes break existing code
- Lazy loading causes timing issues
- Message routing disrupts tool activation

**Mitigation:**

- Test each tool activation individually
- Add error handling to lazy loader
- Implement fallback for failed imports
- Use absolute paths with chrome.runtime.getURL

**Approval Gate:** ✓ All 9 tools activate and deactivate correctly

---

### Phase 3: Module Reorganization

**Duration**: ~3 hours

**Dependencies**: Phase 2 complete

**Tasks:**

1. Create category folders: `tools/{inspect,capture,enhance,utilities}/`
2. Move existing tools to appropriate categories:

   - `colorPicker.js` → `tools/inspect/`
   - `elementPicker.js` → `tools/inspect/`
   - `fontPicker.js` → `tools/inspect/`
   - `linkPicker.js` → `tools/inspect/`
   - `mediaPicker.js` → `tools/capture/`
   - `textPicker.js` → `tools/capture/`
   - `screenshotPicker.js` → `tools/capture/`
   - `stickyNotesPicker.js` → `tools/enhance/`
   - `siteInfoPicker.js` → `tools/utilities/`

3. Add metadata export to each tool module
4. Update `tools-manifest.json` with all tool metadata
5. Update import paths in content.js and toolLoader.js
6. Delete old `modules/` folder
7. Update test file paths

**Affected Files:**

- All 9 tool files (moved + metadata added)
- `config/tools-manifest.json` (populated)
- `core/toolLoader.js` (updated paths)
- `content/content.js` (updated imports)
- All test files (updated paths)

**Acceptance Criteria:**

- All tools in correct category folders
- Each tool exports metadata object
- `tools-manifest.json` has complete data
- All tools load and activate correctly
- Tests pass with new paths
- Old `modules/` folder removed

**Risks:**

- Path changes break tool loading
- Metadata format inconsistencies
- Test failures due to path updates

**Mitigation:**

- Update toolLoader to use manifest paths
- Create metadata validation function
- Update jest.config.js module mappings
- Test each tool individually after move

**Approval Gate:** ✓ npm test passes, all 9 tools work in Chrome

---

### Phase 4: Popup Scalability (Search, Categories, Favorites)

**Duration**: ~5 hours

**Dependencies**: Phase 3 complete

**Tasks:**

1. Add search bar HTML to `popup/popup.html`
2. Add category filter tabs to popup
3. Implement search functionality in `popup/popup.js`
4. Implement category filtering
5. Implement favorites system (star/unstar tools)
6. Add "Recent Tools" section (last 5 used)
7. Update CSS for new components (`popup/popup.css`)
8. Implement keyboard navigation (Tab, Enter, Arrow keys, /)
9. Add loading states for lazy-loaded tools
10. Implement virtual scrolling (if needed for performance)
11. Update ARIA labels and accessibility
12. Create settings panel for tool toggles

**Affected Files:**

- `popup/popup.html` (new UI components)
- `popup/popup.css` (new styles)
- `popup/popup.js` (search, filter, favorites logic)
- `shared/ui-components.js` (new file - reusable components)

**Acceptance Criteria:**

- Search filters tools instantly
- Category tabs show correct tools
- Favorites persist in chrome.storage.sync
- Recent tools section shows last 5 used
- Keyboard navigation works smoothly
- All tools accessible via UI
- Performance: <100ms popup open time
- Accessibility: passes screen reader test

**Risks:**

- Search performance degrades with 50+ tools
- UI becomes cluttered with many tools
- Keyboard navigation conflicts with shortcuts

**Mitigation:**

- Implement debounced search (300ms)
- Use CSS grid with max-height + scroll
- Separate popup shortcuts from tool shortcuts
- Test with 30+ mock tools

**Approval Gate:** ✓ UI works smoothly, performance targets met

---

### Phase 5: Testing & Validation

**Duration**: ~3 hours

**Dependencies**: Phase 4 complete

**Tasks:**

1. Write new Jest tests for core modules
2. Update existing tests for new paths
3. Run full test suite (`npm test`)
4. Manual regression testing of all 9 tools
5. Test on 5 different websites
6. Test in light and dark themes
7. Test keyboard shortcuts (popup toggle plus Alt+Shift+1–3)
8. Test multi-language support (en, fr, tr)
9. Performance profiling (popup open time, memory usage)
10. Accessibility audit (ARIA, keyboard navigation)
11. Fix all discovered bugs
12. Update ESLint rules and fix warnings

**Affected Files:**

- All test files (new + updated)
- Any files with discovered bugs

**Acceptance Criteria:**

- All Jest tests pass (90%+ coverage)
- All ESLint checks pass
- All 9 tools work correctly on test sites
- No console errors or warnings
- Performance targets met (<100ms popup, <50ms search)
- Accessibility audit passes
- Multi-language support verified

**Risks:**

- Hidden bugs discovered late
- Performance issues under load
- Accessibility violations

**Mitigation:**

- Comprehensive manual testing checklist
- Performance monitoring tools
- Automated accessibility testing (Lighthouse)

**Approval Gate:** ✓ Zero critical bugs, all tests pass

---

### Phase 6: Packaging, Documentation & Release Notes

**Duration**: ~2 hours

**Dependencies**: Phase 5 complete

**Tasks:**

1. Update AGENTS.md with new architecture
2. Create/update README.md for Toolary
3. Update PRIVACY_POLICY.md if needed
4. Create CHANGELOG.md for v2.0.0
5. Create migration guide (Pickachu → Toolary)
6. Generate production build
7. Test packaged extension
8. Create Chrome Web Store assets (screenshots, descriptions)
9. Update `package.json` version to 2.0.0
10. Create release tag v2.0.0
11. Merge to main branch

**Affected Files:**

- `AGENTS.md`
- `README.md`
- `PRIVACY_POLICY.md`
- `CHANGELOG.md` (new)
- `package.json`

**Acceptance Criteria:**

- All documentation updated
- README explains new features
- CHANGELOG lists all changes
- Extension packages without errors
- Packaged version works correctly
- Release tag created

**Risks:**

- Documentation incomplete or outdated
- Packaging errors

**Mitigation:**

- Documentation review checklist
- Test packed extension before release

**Approval Gate:** ✓ Final review, ready for release

---

## 9. Work Breakdown Structure (WBS)

### Task Table

| Task ID | Task Name | Description | Affected Files | Dependencies | Acceptance Criteria |

|---------|-----------|-------------|----------------|--------------|---------------------|

| **Phase 1** |

| 1.1 | Update manifest branding | Change name, description in manifest.json | manifest.json | Phase 0 | Extension loads as "Toolary" |

| 1.2 | Update locale files | Change all brand references in translations | _locales/*/messages.json | 1.1 | All UI text shows "Toolary" |

| 1.3 | Rename CSS classes | pickachu- *→ toolary-* in all CSS files | popup/popup.css, content/content.css | 1.1 | No styling breaks |

| 1.4 | Update JS variables | Update variable names and storage keys | All .js files | 1.3 | No console errors |

| 1.6 | Test Phase 1 | Manual testing of all 9 tools | All | 1.1-1.5 | All tools work |

| **Phase 2** |

| 2.1 | Create folder structure | Create core/, tools/, shared/, config/ | Project root | 1.6 | Folders exist |

| 2.2 | Implement toolRegistry | Central tool registration system | core/toolRegistry.js | 2.1 | Registry loads tools |

| 2.3 | Implement toolLoader | Lazy loading system | core/toolLoader.js | 2.2 | Tools load on demand |

| 2.4 | Implement messageRouter | Message passing system | core/messageRouter.js | 2.1 | Messages route correctly |

| 2.5 | Create constants | Categories, tags, IDs | core/constants.js | 2.1 | Constants accessible |

| 2.6 | Create tools manifest | Tool metadata JSON file | config/tools-manifest.json | 2.2 | Manifest parses correctly |

| 2.7 | Move shared utilities | Move helpers.js and icons.js | shared/ | 2.1 | Imports resolve |

| 2.8 | Update import paths | Fix all imports to new structure | All .js files | 2.7 | No import errors |

| 2.9 | Update background.js | Integrate new architecture | background.js | 2.2-2.4 | Messages handled |

| 2.10 | Test Phase 2 | Test tool activation with new system | All | 2.1-2.9 | All tools activate |

| **Phase 3** |

| 3.1 | Create category folders | Create inspect/, capture/, enhance/, utilities/ | tools/ | 2.10 | Folders exist |

| 3.2 | Move tool files | Relocate 9 tools to categories | tools/*/ | 3.1 | Files moved |

| 3.3 | Add tool metadata | Export metadata from each tool | All tool files | 3.2 | Metadata exports work |

| 3.4 | Populate manifest | Add all tool data to tools-manifest.json | config/tools-manifest.json | 3.3 | Manifest complete |

| 3.5 | Update loader paths | Fix toolLoader to use new paths | core/toolLoader.js | 3.2 | Tools load correctly |

| 3.6 | Delete old modules/ | Remove old folder | modules/ | 3.5 | Folder deleted |

| 3.7 | Update test paths | Fix all test file imports | test/ | 3.2 | Tests pass |

| 3.8 | Test Phase 3 | Run npm test + manual test | All | 3.1-3.7 | All tests pass |

| **Phase 4** |

| 4.1 | Add search bar HTML | Insert search input in popup | popup/popup.html | 3.8 | Search bar visible |

| 4.2 | Add category tabs | Insert filter tabs in popup | popup/popup.html | 3.8 | Tabs visible |

| 4.3 | Implement search logic | Filter tools by query | popup/popup.js | 4.1 | Search works |

| 4.4 | Implement category filter | Filter by category | popup/popup.js | 4.2 | Filters work |

| 4.5 | Implement favorites | Star/unstar system with storage | popup/popup.js | 3.8 | Favorites persist |

| 4.6 | Add recent tools | Show last 5 used tools | popup/popup.js | 3.8 | Recent tools display |

| 4.7 | Style new components | CSS for search, filters, favorites | popup/popup.css | 4.1-4.6 | UI looks polished |

| 4.8 | Keyboard navigation | Implement Tab, /, Arrow keys | popup/popup.js | 4.7 | Keyboard nav works |

| 4.9 | Add loading states | Show spinners for lazy loading | popup/popup.js, popup/popup.css | 4.8 | Loading indicators show |

| 4.10 | Accessibility audit | ARIA labels, focus management | popup/popup.html, popup/popup.js | 4.8 | Screen reader compatible |

| 4.11 | Test Phase 4 | Performance + usability testing | All | 4.1-4.10 | Performance targets met |

| **Phase 5** |

| 5.1 | Write core tests | Jest tests for registry, loader, router | test/core/ | 4.11 | Core tests pass |

| 5.2 | Write UI tests | Jest tests for search, filters | test/popup/ | 4.11 | UI tests pass |

| 5.3 | Update existing tests | Fix paths and imports | test/ | 3.8 | All tests pass |

| 5.4 | Run full test suite | npm test | All test files | 5.1-5.3 | 90%+ coverage |

| 5.5 | Manual regression test | Test all 9 tools on 5 websites | All | 5.4 | All tools work |

| 5.6 | Theme testing | Test light/dark themes | All | 5.5 | Themes work |

| 5.7 | i18n testing | Test en, fr, tr | All | 5.5 | Languages work |

| 5.8 | Performance profiling | Measure popup time, memory | All | 5.5 | <100ms popup open |

| 5.9 | Fix discovered bugs | Address all issues | Varies | 5.4-5.8 | Zero critical bugs |

| 5.10 | ESLint check | npm run lint + fix warnings | All | 5.9 | No lint errors |

| **Phase 6** |

| 6.1 | Update AGENTS.md | Document new architecture | AGENTS.md | 5.10 | Documentation complete |

| 6.2 | Update README.md | User-facing documentation | README.md | 5.10 | README accurate |

| 6.3 | Update PRIVACY_POLICY | Update if AI tools added | PRIVACY_POLICY.md | 5.10 | Policy current |

| 6.4 | Create CHANGELOG | List all v2.0.0 changes | CHANGELOG.md | 5.10 | Changelog complete |

| 6.5 | Update package.json | Version bump to 2.0.0 | package.json | 5.10 | Version updated |

| 6.6 | Generate production build | Create packaged extension | dist/ | 6.5 | Build succeeds |

| 6.7 | Test packaged extension | Load .crx in Chrome | All | 6.6 | Packed version works |

| 6.8 | Create release tag | Git tag v2.0.0 | N/A | 6.7 | Tag created |

| 6.9 | Merge to main | Merge develop/toolary → main | N/A | 6.8 | Merge successful |

---

## 10. Risks & Mitigations

### High-Priority Risks

| Risk | Impact | Probability | Mitigation |

|------|--------|-------------|------------|

| Lazy loading breaks tool activation | High | Medium | Implement fallback loading, extensive testing, error handling |

| CSS class rename breaks styling | High | Low | Global find/replace with regex, visual testing |

| Import path changes cause errors | High | Medium | Use absolute paths, test incrementally |

| Performance degrades with 50+ tools | Medium | Medium | Virtual scrolling, debounced search, lazy loading |

| Storage migration loses user data | High | Low | Backup strategy, migration function, rollback plan |

| Keyboard shortcuts conflict | Medium | Low | Separate popup shortcuts from tool shortcuts |

| AI tools violate privacy policy | Medium | Medium | Clear API opt-in, document data flow, separate permissions |

### Medium-Priority Risks

| Risk | Impact | Probability | Mitigation |

|------|--------|-------------|------------|

| Test coverage drops during refactor | Medium | High | Write tests alongside code, enforce coverage thresholds |

| Documentation becomes outdated | Medium | High | Update docs in Phase 6, review checklist |

| UI becomes cluttered | Medium | Medium | User testing, iterative design, hide advanced features |

| Translation strings missing | Low | Medium | Validation script for locale files |

---

## 11. Execution Order & Dependencies

```
Phase 0 (Planning) ✓
    ↓
Phase 1 (Branding) → Tasks 1.1-1.6
    ↓
Phase 2 (Architecture) → Tasks 2.1-2.10
    ↓
Phase 3 (Modules) → Tasks 3.1-3.8
    ↓
Phase 4 (Popup UI) → Tasks 4.1-4.11
    ↓
Phase 5 (Testing) → Tasks 5.1-5.10
    ↓
Phase 6 (Release) → Tasks 6.1-6.9
```

**Critical Path:**

All phases are sequential. No parallelization possible due to dependencies.

**Estimated Total Time:** 19-22 hours of focused work

---

## 12. Approval Gates & Checkpoints

### After Phase 1 (Branding)

- **Check**: Load extension in Chrome as "Toolary"
- **Check**: All 9 tools still work
- **Decision**: ✓ Proceed | ⚠ Review | ✗ Rollback

### After Phase 2 (Architecture)

- **Check**: Tool registry loads all tools
- **Check**: Lazy loading activates tools correctly
- **Decision**: ✓ Proceed | ⚠ Review | ✗ Rollback

### After Phase 3 (Modules)

- **Check**: npm test passes
- **Check**: All tools in correct categories
- **Decision**: ✓ Proceed | ⚠ Review | ✗ Rollback

### After Phase 4 (Popup UI)

- **Check**: Search and filters work
- **Check**: Performance <100ms popup open
- **Decision**: ✓ Proceed | ⚠ Review | ✗ Rollback

### After Phase 5 (Testing)

- **Check**: Zero critical bugs
- **Check**: 90%+ test coverage
- **Decision**: ✓ Proceed | ⚠ Review | ✗ Rollback

### After Phase 6 (Release)

- **Check**: Documentation complete
- **Check**: Packaged extension works
- **Decision**: ✓ Release | ⚠ Final review

---

## 13. Future Expansion (Post v2.0.0)

### Phase 7-10: Adding New Tools (Future)

Once Toolary v2.0.0 is stable, new tools can be added using this workflow:

1. Create tool file in appropriate category folder
2. Add metadata export to tool
3. Add entry to `config/tools-manifest.json`
4. Update locale files with tool name/description
5. Write Jest tests for tool
6. Submit PR with tool implementation

### AI Tools Category (Future)

- Implement API key management UI
- Add settings for AI provider selection
- Create base AI tool class with common functions
- Examples: Text summarizer, chat assistant, image analyzer

### Tool Ideas for Future (50+ goal)

**Inspect Category:**

- CSS Inspector, Network Monitor, Console Logger, Performance Analyzer

**Capture Category:**

- Video Recorder, Audio Recorder, PDF Generator, Markdown Exporter

**Enhance Category:**

- Dark Mode Toggle, Custom CSS Injector, Ad Blocker, Translator, Reader Mode

**AI Category:**

- Text Summarizer, Chat Assistant, Image Analyzer, Code Explainer, Grammar Checker

**Utilities Category:**

- QR Generator, Password Generator, Lorem Ipsum, Color Palette Generator, Unit Converter

---

## Summary

This plan transforms Pickachu into Toolary through 6 structured phases over ~20 hours. The architecture supports scaling to 50+ tools via lazy loading, tool registry, and an enhanced popup UI with search/filter/favorites. All existing functionality is preserved, no users to migrate, and every phase has clear approval gates for safe iteration.

**Next Steps:**

1. Review and approve this plan
2. Create `develop/toolary` branch
3. Begin Phase 1 execution upon your command
