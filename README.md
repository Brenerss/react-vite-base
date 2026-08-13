# react-vite-base

Base template for React applications built with **React Router 8 (Framework Mode)**, **Vite**, and **TypeScript** — preconfigured with testing, linting, formatting, git hooks, and a Docker build.

Clone it and start writing features: the project infrastructure is already in place.

## Stack

| Layer         | Tooling                                              |
| ------------- | ---------------------------------------------------- |
| UI            | React 19, Tailwind CSS 4, lucide-react               |
| Routing / SSR | React Router 8 in Framework Mode (SSR enabled)       |
| Build         | Vite 8                                               |
| Data fetching | TanStack Query, Axios                                |
| State         | Zustand                                              |
| Forms         | React Hook Form + Zod (via `@hookform/resolvers`)    |
| Utilities     | dayjs, lodash, dompurify, react-error-boundary       |
| Unit tests    | Vitest + Testing Library (jsdom)                     |
| E2E tests     | Playwright (Chromium + Firefox)                      |
| Code quality  | ESLint 9 (flat config), Prettier, Husky, lint-staged |

## Requirements

- Node.js 24+ (the Docker image uses `node:24-alpine`)
- npm

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:3000` with HMR.

### Environment variables

Any variable exposed to the client must be prefixed with `VITE_`. See `.env.example`:

| Variable                      | Description                          |
| ----------------------------- | ------------------------------------ |
| `VITE_APP_API_URL`            | Base URL of the API the app consumes |
| `VITE_APP_ENABLE_API_MOCKING` | Toggles API mocking                  |
| `VITE_APP_MOCK_API_PORT`      | Port used by the mock server         |

E2E runs have their own file, `.env.example-e2e`, which points the API to `http://localhost:8080/api`, disables mocking, and sets `VITE_APP_URL=http://localhost:3000`.

> `.env` is gitignored — never commit credentials.

## Scripts

| Script                    | What it does                                               |
| ------------------------- | ---------------------------------------------------------- |
| `npm run dev`             | Dev server with HMR (port 3000)                            |
| `npm run build`           | Production build into `build/` (client + server)           |
| `npm run start`           | Serves the production build with `react-router-serve`      |
| `npm run typecheck`       | Generates route types and runs `tsc`                       |
| `npm run lint`            | ESLint across the project                                  |
| `npm run lint:fix`        | ESLint with autofix                                        |
| `npm run format`          | Prettier, rewriting files                                  |
| `npm run format:check`    | Checks formatting without changing files                   |
| `npm run test`            | Vitest in watch mode                                       |
| `npm run test:run`        | Vitest single run (used by hooks/CI)                       |
| `npm run test:ui`         | Vitest UI                                                  |
| `npm run test:coverage`   | Coverage report (v8 provider, `text` and `html` reporters) |
| `npm run test:e2e`        | Playwright tests                                           |
| `npm run test:e2e:ui`     | Playwright in UI mode                                      |
| `npm run test:e2e:headed` | Playwright with a visible browser                          |

## Project structure

```
src/
└── app/                  # React Router appDirectory
    ├── root.tsx          # root layout, links, error boundary
    ├── routes.ts         # route definitions
    ├── app.css           # global styles / Tailwind
    ├── routes/           # route modules
    └── welcome/          # landing screen components
e2e/                      # Playwright specs
public/                   # static assets
.agents/skills/           # reference skills (React Router) for AI agents
```

The `~/*` alias maps to `src/app/*` (configured in `tsconfig.json`).

SSR is on (`ssr: true` in `react-router.config.ts`), so route modules run on both server and client. Switch to `ssr: false` for SPA mode.

## Code conventions

These rules are enforced by ESLint (`eslint-plugin-check-file`) and will fail the lint step:

- **File names** in `kebab-case` (`user-profile.tsx`, not `UserProfile.tsx`)
- **Folder names** in `kebab-case`
- **No `index` files** (`check-file/no-index`) — import the file explicitly
- Tests live in `__tests__/` folders
- Components suffixed `.styled.tsx` live under `components/`
- Use `*.models.ts` and `*.utils.ts` (plural) — the singular forms are blocklisted

Formatting (Prettier): semicolons, double quotes, trailing commas everywhere, 100-column width. Two-space indentation and LF line endings via `.editorconfig`.

## Testing

**Unit** — Vitest with the `jsdom` environment, globals enabled, and `@testing-library/jest-dom` loaded in setup. The `e2e/` folder is excluded from the run. Coverage covers `src/**/*.{ts,tsx}`, skipping tests and generated types (`src/app/+types/**`).

**E2E** — Playwright targets `http://localhost:3000` and starts the dev server itself (`webServer`), reusing an already-running server outside CI. On failure it captures a screenshot, a video, and a trace on the first retry. In CI: 2 retries, 1 worker, and `forbidOnly`.

## Git hooks

Managed by Husky:

- **pre-commit** — `lint-staged`: ESLint `--fix` + Prettier on staged JS/TS files, Prettier on staged JSON/MD/CSS/SCSS/HTML/YAML files.
- **pre-push** — lint, format check, unit tests, and E2E tests. Any failure aborts the push.

Hooks are installed automatically by the `prepare` script on `npm install`.

## CI

`.github/workflows/playwright.yml` runs the E2E suite on pushes and pull requests targeting `main`/`master`, uploading `playwright-report/` as an artifact (30-day retention).

## Docker

The `Dockerfile` uses a multi-stage build (dev deps, prod deps, build, slim runtime image):

```bash
docker build -t react-vite-base .
docker run -p 3000:3000 react-vite-base
```

It deploys to any container platform — Cloud Run, ECS, Fly.io, Railway, Azure Container Apps.

## Deploying without Docker

The built-in server is production-ready. Build and ship the output:

```
├── package.json
├── package-lock.json
└── build/
    ├── client/   # static assets
    └── server/   # server-side code
```

Then run `npm run start`.
