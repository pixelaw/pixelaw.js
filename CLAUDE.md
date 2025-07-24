# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Building and Development
- `pnpm build` - Build all packages using Turbo
- `pnpm build:deps` - Build dependencies first
- `pnpm dev` - Start development mode with file watching (concurrency 15)
- `pnpm build-cores` - Build only core packages using build script
- `pnpm build-examples` - Build example applications

### Code Quality
- `pnpm lint` - Run Biome linter across all packages
- `pnpm prettier` - Format code using Prettier
- `pnpm prettier-check` - Check code formatting without changes
- `biome check --apply .` - Run Biome formatter and linter with auto-fixes (in individual packages)
- `biome format --write .` - Format code with Biome (in individual packages)

### Testing
- `vitest run` - Run tests (available in packages with test suites like core-dojo)

### Package Management
- `pnpm release` - Publish all packages to npm
- `pnpm release:dry-run` - Test publish without actually publishing

### Documentation
- `pnpm docs` - Generate TypeDoc documentation

## Architecture

This is a monorepo for Pixelaw.js, a JavaScript/TypeScript SDK for interacting with the PixeLAW on-chain autonomous world. The project uses:

- **Package Manager**: pnpm with workspaces
- **Build System**: Turbo for orchestration, tsup for TypeScript compilation
- **Code Quality**: Biome for linting/formatting (4-space indentation, double quotes)
- **Structure**: Lerna-based monorepo with independent package versioning

### Core Architecture

The repository is structured around multiple blockchain engine implementations:

1. **@pixelaw/core** - Base rendering and common functionality
   - Canvas2D renderer for pixel-based graphics
   - Ably integration for real-time updates
   - Storage utilities and event handling
   - Location: `packages/core/`

2. **@pixelaw/core-dojo** - Dojo (StarkNet) blockchain integration
   - DojoEngine for StarkNet interaction
   - Cartridge Controller wallet integration
   - Generated contract bindings and models
   - SQL-based pixel storage with web worker support
   - Location: `packages/core-dojo/`

3. **@pixelaw/core-mud** - MUD blockchain integration
   - Alternative blockchain backend
   - Location: `packages/core-mud/`

4. **React Integration Packages**:
   - `@pixelaw/react` - General React hooks and components
   - `@pixelaw/react-dojo` - Dojo-specific React components and wallet selectors

5. **Tools**:
   - `@pixelaw/imgtool-dojo` - Image processing utilities for Dojo

### Key Files and Patterns

- **Generated Code**: `packages/core-dojo/src/generated/` contains auto-generated contract bindings
- **Web Workers**: DojoSqlPixelStore uses web workers for performance (`DojoSqlPixelStore.webworker.js`)
- **Configuration**: Each package has its own `biome.json`, `tsconfig.json`, and `tsup.config.ts`
- **Build Scripts**: Located in `scripts/` directory for package-specific builds

### Development Workflow

1. The project uses Turbo's dependency graph to build packages in correct order
2. Core packages must be built before dependent packages
3. Development mode (`pnpm dev`) watches all packages concurrently
4. Biome is configured for consistent code style across all packages
5. Each package publishes independently to npm registry

### Engine Pattern

The codebase follows an engine pattern where:
- Core provides base rendering and utilities
- Engine-specific packages (core-dojo, core-mud) implement blockchain interactions
- React packages provide framework-specific integrations
- Applications compose these packages for specific use cases

### Testing

Tests are primarily located in `packages/core-dojo/src/__tests__/` and use Vitest. The main test focuses on simulation parsing and data handling.