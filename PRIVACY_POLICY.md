# Toolary Privacy Policy

_Effective date: Toolary v2.0.0_

Toolary is built with a privacy-first mindset. The extension operates entirely within your browser and never sends page data, notes, or usage information to external servers.

## Data Collection

| Data Type | Stored? | Location | Purpose |
|-----------|---------|----------|---------|
| Favorites & hidden tools | Yes | `chrome.storage.sync` | Synchronise your popup preferences across Chrome profiles |
| Recent tools | Yes | `chrome.storage.local` | Show the last five tools you activated |
| Sticky notes | Yes | `chrome.storage.sync` (per-site keys) | Persist your notes across sessions/devices |
| Page content, colors, fonts, links | No (in-memory only) | N/A | Processed on demand, never persisted or transmitted |
| Diagnostic telemetry | No | N/A | Toolary does not send analytics or crash reports |

### Sticky Notes
Notes are stored under keys prefixed with `toolaryStickyNotes_`. Legacy Pickachu keys (`stickyNotes_`) are migrated in place. You can remove notes via the sticky notes manager or by clearing the associated keys in Chrome storage.

## Permissions Explained

- **`activeTab` / `tabs` / `scripting`** – Required to inject the content script when you activate a tool.  
- **`downloads`** – Needed so Screenshot/Media tools can save files locally.  
- **`storage` / `clipboardWrite`** – Used for favorites, notes, settings, and clipboard operations.

Toolary requests only the permissions needed for the current feature set. Future tool additions will revisit permission requirements during review.

## Third Parties

Toolary does **not** rely on external services, trackers, or CDNs. All code ships with the extension bundle and runs locally.

## User Controls

- Manage favorites, hidden tools, and notes directly inside the popup UI.
- Clear Toolary data via Chrome’s extension storage management (`chrome://settings/siteData` → search “toolary”).
- Remove the extension at any time to delete all associated storage.

## Updates

Updates are delivered through the Chrome Web Store. Each release is accompanied by changelog entries outlining new features or fixes.

## Contact

For privacy-related questions or issues please open an issue on the GitHub repository or reach out via https://ademisler.com.

Toolary may revise this policy for future releases. The version number at the top of this document indicates the latest update.
