# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.5] - 2025-03-29

### Fixed
- Updated AppleScript for response retrieval (`ask` operation) to target `last static text` within the likely scroll area, based on Accessibility Inspector findings. This should fix issues where responses couldn't be retrieved due to UI changes in the ChatGPT app. Added a fallback check for robustness.

## [1.0.4] - 2025-03-29

### Changed
- Refined tool description in `index.ts` to be more action-oriented and include parameter details (`time_to_wait`) for better AI triggering.

## [1.0.3] - 2025-03-29

### Changed
- Simplified the tool description in `index.ts` to potentially improve triggering by MCP clients.

## [1.0.2] - 2025-03-29

### Changed
- Removed unused dependencies (`@jxa/run`, `@jxa/global-type`) to reduce package size.
- Removed unused `bun.lock` file.
- Minor code simplification in `index.ts`.

## [1.0.1] - 2025-03-29

### Changed
- Enhanced the tool description in `index.ts` to provide clearer guidance to AI models on when to use the `chatgpt` tool.

## [1.0.0] - 2025-03-29

### Added
- Initial release based on Syed Azhar's original work.
- MCP server providing `chatgpt` tool for macOS desktop app interaction.
- `ask` operation to send prompts, with configurable `time_to_wait` parameter for response retrieval.
- `get_conversations` operation to list conversation titles.
- Setup for npm packaging and execution via `npx`.

### Changed
