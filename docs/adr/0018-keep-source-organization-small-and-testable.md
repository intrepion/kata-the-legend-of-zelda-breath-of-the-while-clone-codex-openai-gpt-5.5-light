# Keep Source Organization Small and Testable

The initial codebase should use small modules for game, input, camera, player, world, UI, persistence, and tests/debug rather than an entity-component-system or custom engine architecture. Hidden test hooks may exist under a non-production `window.__wildreachTest` interface for setup and reset, but normal browser smoke tests must still prove the real keyboard and mouse play path.
