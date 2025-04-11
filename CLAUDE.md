# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build` (compiles TypeScript and makes output executable)
- Start: `npm run start` (runs the compiled server)
- Quick dev cycle: `npm run build && npm run start`

## Code Style Guidelines
- **TypeScript**: Strict type checking enabled with noImplicitAny and noUncheckedIndexedAccess
- **Imports**: Use ES modules syntax (import/export), with .js extension for MCP SDK imports
- **Error Handling**: Use try/catch blocks with detailed error messages and type checking (instanceof Error)
- **Formatting**: Follow existing code style with 2-space indentation
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Types**: Always define explicit types for function parameters and return values
- **AppleScript**: Format multi-line AppleScript strings with consistent indentation
- **Comments**: Add descriptive comments for complex AppleScript interactions

## Project
A Model Context Protocol server that provides a tool for interacting with the ChatGPT macOS desktop application.