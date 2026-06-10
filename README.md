# App Graph Builder

A visual infrastructure graph dashboard for managing and inspecting service deployments across applications.

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd app-graph-builder

# Install dependencies
npm install

# Initialize MSW service worker (run once)
npm run msw:init

# Start dev server
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start development server |
| npm run build | Type-check and build for production |
| npm run preview | Preview production build locally |
| npm run lint | Run ESLint |
| npm run typecheck | TypeScript type checking |

## Key Decisions

**ReactFlow for canvas**: Chosen for its first-class React integration, built-in drag/select/delete behaviors, and TypeScript support.

**MSW for mocking**: Intercepts at the network level so TanStack Query behaves exactly as in production — including loading states, error retries, and caching.

**Zustand over Context**: UI state like selectedNodeId and isMobilePanelOpen changes frequently; Zustand avoids unnecessary re-renders compared to React Context.

**shadcn/ui**: Unstyled-first components that gave full control over the visual design without fighting against default styles.

**CSS Variables**: Centralized theming makes the dark mode design consistent and easy to adjust across all components.

## Architecture

- **`/components/layout`** — Shell components that never contain business logic
- **`/components/canvas`** — ReactFlow-specific components, isolated from the rest of the app
- **`/components/inspector`** — Reads/writes node data via ReactFlow's setNodes, never mutates directly
- **`/hooks`** — TanStack Query hooks, one per resource type
- **`/mocks`** — All MSW handlers and seed data, completely isolated from app code
- **`/store`** — Single Zustand store for UI-only state; server state lives in React Query cache

## Known Limitations

- Node positions are not persisted (resets on page reload)
- The 10% random API failure is intentional for error state demonstration — refresh if graph fails to load
- Mobile layout tested on 375px (iPhone SE) and 390px (iPhone 14)
- Node connections (edges) cannot be created via drag in this version

## Live Demo

[Deploy link here]
