# Workflow Automation SaaS Platform

This repository now contains the initial code scaffold for the Workflow Automation SaaS platform alongside the original project planning brief. The workspace is organised as a pnpm-based monorepo with separate applications for the API and web client plus a shared package for cross-cutting utilities.

- [Project Brief](docs/project-brief.md)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)

## Monorepo Structure

```
.
├── apps
│   ├── api        # Express + TypeScript HTTP API skeleton
│   └── web        # Vite + React TypeScript SPA shell
├── packages
│   └── shared     # Shared TypeScript utilities (e.g., response builders)
├── docs           # Planning and product documentation
├── package.json   # Workspace root with shared scripts
└── pnpm-workspace.yaml
```

## Getting Started

1. Install dependencies using pnpm (recommended version 8+):
   ```bash
   pnpm install
   ```
2. Start the API in development mode:
   ```bash
   pnpm --filter @workflow-saas/api dev
   ```
3. Start the web client:
   ```bash
   pnpm --filter @workflow-saas/web dev
   ```

Both services will reload automatically when files are changed. Environment variables for the API can be set via an `.env` file at the repository root (see the project brief for expected keys).

## Available Scripts

From the repository root you can run:

- `pnpm dev` – shortcut to start the API locally.
- `pnpm build` – build every workspace package (API, web, shared).
- `pnpm typecheck` – run TypeScript checks where configured.

Each package also exposes its own scripts – inspect the respective `package.json` for further commands.
