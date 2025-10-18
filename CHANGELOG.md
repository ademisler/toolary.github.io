# Changelog

All notable changes are documented here. This project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0] – 2025-10-18

### Added
- Manifest-driven tool registry (`core/toolRegistry.js`) and lazy loader with metadata backfill.
- Revamped popup with search, category tabs, favorites, recent tools, and per-tool visibility settings.
- Toast notifications, settings dialog, and virtualized grid via shared UI components.
- Jest unit tests covering registry, loader, and message router.
- Migration guide (`docs/MIGRATION.md`) and refreshed documentation suite.

### Changed
- Rebranded Pickachu to Toolary across manifest, icons, locale strings, and documentation.
- Tool modules relocated to category folders with explicit `metadata` exports.
- Sticky notes storage migrated to `toolaryStickyNotes_*` with legacy support.
- `package.json` metadata updated to new repository and branding.

### Fixed
- Miscellaneous storage access edge cases when fetching legacy sticky-note keys.
- Consistent keyboard accessibility across popup controls.

## [1.1.0] – 2023-XX-XX

- Last stable Pickachu release (reference point for migration).

[2.0.0]: https://github.com/fulexo/toolary/releases/tag/v2.0.0
