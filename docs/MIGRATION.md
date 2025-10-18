# Migration Guide: Pickachu → Toolary v2.0.0

Toolary v2.0.0 is a direct upgrade from Pickachu v1.1.0. This guide highlights key changes for developers, QA, and store reviewers.

## At a Glance

| Area | Status | Notes |
|------|--------|-------|
| Extension ID | Unchanged | Same Chrome Web Store listing |
| Permissions | Unchanged | activeTab, scripting, clipboardWrite, storage, tabs, downloads |
| Keyboard shortcuts | Adjusted | Ctrl/Cmd + Shift + P plus Alt + Shift + {1,2,3} (Color, Element, Screenshot). Other tools launch via the popup. |
| Data storage | Automatic migration | Sticky notes migrate from `stickyNotes_` → `toolaryStickyNotes_` keys |
| Branding | Updated | Name, icons, descriptions, README |
| Architecture | Enhanced | Manifest-driven registry, new popup UI, shared UI components |

## Developer Checklist

1. **Update documentation**  
   - README now references Toolary branding and scalable popup features.  
   - AGENTS.md reflects new folder structure.  
   - Privacy policy clarifies storage keys.

2. **Confirm data migration**  
   - Sticky notes: open pages with existing notes and verify they appear automatically.  
   - Favorites/hidden tools migrate from legacy Pickachu keys on first launch.

3. **Verify tools**  
   - Exercise all nine core tools across representative websites.  
   - Confirm popup search, favorites, recents, and per-tool visibility settings persist.

4. **Testing**  
   ```bash
   npm run lint
   npm test
   ```
   - New Jest coverage exists for registry, loader, and message router.

5. **Packaging & Release**  
   - Bump `package.json` version to 2.0.0.  
   - Generate build: `zip -r dist/toolary-v2.0.0.zip extension -x "node_modules/*" "*.map"`  
   - Smoke test by loading the zip in Chrome.  
   - Capture updated Chrome Web Store screenshots (light/dark popup states).  
   - Publish changelog + tag `v2.0.0`.

## User-Facing Changes

- New popup design with search, category tabs, favorites, recents, and tool settings.
- Toast notifications after activations and state changes.
- Shortcut set streamlined to three high-traffic tools; all other tools remain available from the popup UI.

## Rollback Plan

If issues arise post-launch:
1. Revert to the previous tag (`v1.1.0`) in the Chrome Web Store dashboard.
2. Restore the prior package zip and assets.
3. Investigate via GitHub issues and re-run the QA checklist above.

## Support

Questions or migration issues? File an issue on GitHub or contact the maintainer via https://ademisler.com/en.
