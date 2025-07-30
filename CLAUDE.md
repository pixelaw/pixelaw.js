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

## Detailed Architecture Documentation

### Core Types and Interfaces (packages/core/src/types.ts)

**Core Data Types**:
- `Pixel`: Base pixel data (x, y, action, app, color, owner, text, timestamp)
- `App`: Application definition (system, name, icon, action, plugin)
- `Notification`: User notifications (position, app, color, from, to, text, timestamp)
- `QueueItem`: Transaction queue items (id, timestamp, called_system, selector, calldata)
- `SimplePixelError`: Error representation (coordinate, error, timestamp)

**Store Interfaces** - Core uses a stateful caching layer pattern:
- `PixelStore`: Manages pixel state, queries from blockchain, caches locally
- `AppStore`: Caches application metadata
- `QueueStore`: Manages transaction queue
- `NotificationStore`: Fetches and caches onchain notifications
- `ErrorStore`: Session-based error storage (in-memory only)
- `TileStore`: Manages tile rendering data

**Engine Pattern**:
- `Engine` interface: Abstract blockchain integration (init, prepInteraction, executeQueueItem)
- `EngineStatus`: "ready" | "loading" | "error" | "uninitialized"
- Implementations: `DojoEngine` (StarkNet), `MudEngine` (EVM)

**Event System**:
- `PixelCoreEvents`: Comprehensive event types for all state changes
- Uses `mitt` for event emission throughout
- Key events: cellClicked, boundsChanged, error, notification, statusChanged

### PixelawCore Class (packages/core/src/PixelawCore.ts)

Central orchestration class that:
- Manages all stores (pixel, app, queue, notification, error, tile)
- Handles engine initialization and switching
- Provides viewport rendering via Canvas2DRenderer
- Manages wallet/account state
- Persists user preferences to storage
- Emits events for all state changes

Key properties:
- `_engine`: Active blockchain engine
- `events`: Event emitter for core events
- `storage`: Persistent storage interface (localStorage in browser)
- `viewPort`: Canvas2D renderer instance

### Store Implementation Patterns

All stores follow similar patterns:
1. **Singleton Pattern**: Static `getInstance()` method
2. **Event Emission**: Each store has `eventEmitter` for state changes
3. **Core Reference**: Stores maintain reference to PixelawCore
4. **State Management**: Internal state object for caching

**PixelStore** (DojoSqlPixelStore):
- Uses web worker for SQL queries to Torii
- Subscribes to blockchain updates via SDK
- Maintains local pixel cache
- Handles optimistic updates

**NotificationStore** (DojoNotificationStore):
- Queries historical notifications from Torii
- Subscribes to new notification events
- Filters by radius around center point

**ErrorStore** (DojoErrorStore):
- Simple in-memory array storage
- Limits to 100 errors to prevent memory leaks
- Can filter errors by coordinate

### Engine Architecture

**DojoEngine** (packages/core-dojo/src/DojoEngine.ts):
- Integrates with StarkNet via Dojo SDK
- Initializes all Dojo-specific stores
- Handles Cartridge Controller wallet
- Manages contract interactions

Key components:
- `dojoInit`: Sets up SDK, provider, manifest
- `DojoInteraction`: Handles user interactions with pixels
- `DojoExecutor`: Manages transaction execution
- `DojoWallet`: Cartridge Controller integration

### React Integration (packages/react/)

**PixelawProvider**:
- React context provider for PixelawCore
- Manages core lifecycle in React apps
- Provides hooks for state access
- Handles localStorage persistence

**ChainProvider**:
- Engine-specific wallet/chain management
- Integrates with wallet selection UIs
- Manages account connection state

### Event Flow

1. **User Interaction** → PixelawCore → Engine.prepInteraction()
2. **Engine creates Interaction** → Gets user params → Executes
3. **Transaction sent** → QueueStore updated → Blockchain processes
4. **Blockchain event** → Store subscription → Local cache update → Event emission
5. **UI components** → Listen to events → Re-render

### Error Handling Philosophy

- **Notifications**: Onchain data, persisted, queried from blockchain
- **Errors**: Transient session data, stored in memory, emitted as events
- Core provides both but lets frontends decide display/persistence
- ErrorStore provides convenience methods but is optional

### Performance Optimizations

1. **Web Workers**: SQL queries run in separate thread (DojoSqlPixelStore)
2. **Caching**: All stores maintain local cache to minimize blockchain queries
3. **Query Buffering**: Only re-query when bounds change significantly
4. **Event Batching**: Multiple updates can be processed together
5. **Lazy Loading**: Stores initialized only when needed