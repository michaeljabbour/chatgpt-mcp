# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-03-29

### Added
- Initial release based on Syed Azhar's original work.
- MCP server providing `chatgpt` tool for macOS desktop app interaction.
- `ask` operation to send prompts, with configurable `time_to_wait` parameter for response retrieval.
- `get_conversations` operation to list conversation titles.
- Setup for npm packaging and execution via `npx`.

### Changed
- Switched from `bun` execution to standard `node` and `npm` build process.
- Made response retrieval optional and wait time configurable in `ask` operation.
