# Toolary Privacy Policy

_Effective date: Toolary v1.0.0_

Toolary is built with a privacy-first mindset. The extension operates entirely within your browser and never sends page data, notes, or usage information to external servers (except for AI features which require API calls to Google's Gemini service).

## Data Collection

| Data Type | Stored? | Location | Purpose |
|-----------|---------|----------|---------|
| Favorites & hidden tools | Yes | `chrome.storage.sync` | Synchronise your popup preferences across Chrome profiles |
| Recent tools | Yes | `chrome.storage.local` | Show the last five tools you activated |
| Tool usage statistics | Yes | `chrome.storage.local` | Sort tools by usage frequency |
| Sticky notes | Yes | `chrome.storage.sync` (per-site keys) | Persist your notes across sessions/devices |
| Copy history | Yes | `chrome.storage.local` (per-domain keys) | Track clipboard history for quick access |
| AI settings & API keys | Yes | `chrome.storage.local` | Store your AI preferences and API keys |
| AI tool history | Yes | `chrome.storage.local` | Store recent AI interactions (summaries, translations, etc.) |
| Page content, colors, fonts, links | No (in-memory only) | N/A | Processed on demand, never persisted or transmitted |
| Diagnostic telemetry | No | N/A | Toolary does not send analytics or crash reports |

### Sticky Notes
Notes are stored under keys prefixed with `toolaryStickyNotes_`. Legacy Pickachu keys (`stickyNotes_`) are migrated in place. You can remove notes via the sticky notes manager or by clearing the associated keys in Chrome storage.

### AI Features
Toolary includes AI-powered tools that use Google's Gemini API. When you use AI features:

- **Content Processing**: Selected text or page content is sent to Google's Gemini API for processing
- **API Keys**: Your Gemini API keys are stored locally in `chrome.storage.local` and never shared
- **History Storage**: AI interactions (summaries, translations, etc.) are stored locally for your convenience
- **No Data Mining**: We do not collect, analyze, or monetize your AI interactions
- **User Control**: You can clear AI history and remove API keys at any time

### Copy History Manager
The Copy History Manager tracks clipboard content per domain for quick access:

- **Domain Isolation**: Each website's copy history is stored separately
- **Local Storage Only**: Copy history never leaves your device
- **Automatic Cleanup**: History is limited to 50 items per domain
- **Manual Control**: You can clear history for specific domains or all domains

## Permissions Explained

- **`activeTab` / `tabs` / `scripting`** – Required to inject the content script when you activate a tool.  
- **`downloads`** – Needed so Screenshot/Media tools can save files locally.  
- **`storage` / `clipboardWrite` / `clipboardRead`** – Used for favorites, notes, settings, clipboard operations, and copy history tracking.
- **`tabCapture`** – Required for Video Recorder tool to capture screen activity.

Toolary requests only the permissions needed for the current feature set. Future tool additions will revisit permission requirements during review.

## Third Parties

Toolary does **not** rely on external services, trackers, or CDNs for core functionality. All code ships with the extension bundle and runs locally. 

**Exception**: AI-powered tools require API calls to Google's Gemini service when you choose to use AI features. These calls are made directly from your browser to Google's servers using your own API keys.

## User Controls

- Manage favorites, hidden tools, and notes directly inside the popup UI.
- Clear AI history and remove API keys through the AI settings panel.
- Clear copy history for specific domains or all domains via the Copy History Manager.
- Clear Toolary data via Chrome's extension storage management (`chrome://settings/siteData` → search "toolary").
- Remove the extension at any time to delete all associated storage.

## Updates

Updates are delivered through the Chrome Web Store. Each release is accompanied by changelog entries outlining new features or fixes.

## Contact

For privacy-related questions or issues please open an issue on the GitHub repository or reach out via https://ademisler.com.

Toolary may revise this policy for future releases. The version number at the top of this document indicates the latest update.
