# Changelog

All notable changes are documented here. This project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0] – 2024-10-18

### Added
- **Complete architecture redesign** with manifest-driven tool registry (`core/toolRegistry.js`) and lazy loader
- **Enhanced popup UI** with search, category tabs, favorites, recent tools, and per-tool visibility settings
- **Shared UI components** including toast notifications, settings dialog, and virtualized grid
- **Comprehensive test suite** with 98.3% coverage across core modules (56 tests passing)
- **Tool metadata system** with categories, tags, keywords, and i18n support
- **Keyboard shortcuts** for popup toggle (Ctrl/Cmd+Shift+P) and key tools (Alt+Shift+1-3)
- **Multi-language support** for English, French, and Turkish

### Changed
- **Complete rebranding** from Pickachu to Toolary across all files and interfaces
- **Tool organization** into category-based folders (inspect, capture, enhance, utilities)
- **Storage migration** to `toolary*` prefixes with automatic legacy key support
- **Module system** with explicit metadata exports and standardized activation patterns
- **Popup scalability** supporting 50+ tools with search, filtering, and favorites

### Fixed
- **Storage access** edge cases and legacy key migration
- **Keyboard accessibility** with proper ARIA labels and focus management
- **Error handling** with comprehensive error reporting and graceful degradation
- **Performance** with lazy loading and virtualized UI components

## [1.1.0] – 2023-XX-XX

- Last stable Pickachu release (reference point for migration).

[2.0.0]: https://github.com/fulexo/toolary/releases/tag/v2.0.0
