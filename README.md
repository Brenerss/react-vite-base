# react-vite-base

Base template for React single-page applications built with **Vite**, **React Router 8 (Data Mode)**, and **TypeScript** — preconfigured with testing, linting, formatting, git hooks, and an nginx-based Docker build.

Clone it and start writing features: the project infrastructure is already in place.

## Stack

| Layer         | Tooling                                              |
| ------------- | ---------------------------------------------------- |
| UI            | React 19, Tailwind CSS 4, lucide-react               |
| Routing       | React Router 8 in Data Mode (`createBrowserRouter`)  |
| Build         | Vite 8 (client-only SPA, no SSR)                     |
| Data fetching | TanStack Query (+ Devtools), Axios                   |
| State         | Zustand                                              |
| Forms         | React Hook Form + Zod (via `@hookform/resolvers`)    |
| Utilities     | dayjs, lodash, dompurify, react-error-boundary       |
| Styling utils | clsx + tailwind-merge (`~/utils/cn`)                 |
| Unit tests    | Vitest + Testing Library (jsdom)                     |
| E2E tests     | Playwright (Chromium + Firefox)                      |
| Code quality  | ESLint 9 (flat config), Prettier, Husky, lint-staged |

## Requirements

- Node.js 24+ (the Docker build image uses `node:24-alpine`)
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

| Variable           | Description                          |
| ------------------ | ------------------------------------ |
| `VITE_APP_API_URL` | Base URL of the API the app consumes |

E2E runs have their own file, `.env.example-e2e`, which points the API to `http://localhost:8080/api` and sets `VITE_APP_URL=http://localhost:3000`.

> `.env` is gitignored — never commit credentials.

## Scripts

| Script                    | What it does                                               |
| ------------------------- | ---------------------------------------------------------- |
| `npm run dev`             | Dev server with HMR (port 3000)                            |
| `npm run build`           | Production build into `dist/`                              |
| `npm run start`           | Serves the built output with `vite preview` (port 3000)    |
| `npm run typecheck`       | `tsc --noEmit`                                             |
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
index.html                # SPA entry document
src/
├── main.tsx              # createRoot + StrictMode
├── app/
│   ├── index.tsx         # <App /> = provider + router
│   ├── provider.tsx      # Suspense, ErrorBoundary, QueryClientProvider, Devtools
│   ├── router.tsx        # createBrowserRouter with lazy route modules
│   ├── app.css           # global styles / Tailwind
│   └── routes/           # route modules
├── components/
│   ├── errors/           # MainErrorFallback
│   └── ui/               # shared UI (spinner, …)
├── hooks/                # shared hooks (+ __tests__/)
├── lib/react-query.ts    # query defaults and helper types
├── testing/setup-tests.ts
└── utils/cn.ts           # clsx + tailwind-merge
e2e/                      # Playwright specs
public/                   # static assets
.agents/skills/           # reference skills (React Router) for AI agents
```

The `~/*` alias maps to `src/*` (declared in `tsconfig.json`, picked up by Vite through `resolve.tsconfigPaths`).

### Routing

Routes are plain objects in `src/app/router.tsx`, loaded with `lazy()` for code splitting. A route module default-exports its component and may export `clientLoader` / `clientAction` factories that receive the `QueryClient`:

```tsx
// src/app/routes/example.tsx
export const clientLoader = (queryClient: QueryClient) => async () => {
  return queryClient.ensureQueryData(exampleQueryOptions());
};

const Example = () => { ... };
export default Example;
```

The `convert` helper in `router.tsx` maps those exports onto React Router's `loader` / `action` / `Component`, so the query client is available inside data loading without prop drilling.

## Code conventions

These rules are enforced by ESLint (`eslint-plugin-check-file`) and will fail the lint step:

- **File names** in `kebab-case` (`user-profile.tsx`, not `UserProfile.tsx`)
- **Folder names** in `kebab-case`
- Tests live in `__tests__/` folders
- Components suffixed `.styled.tsx` live under `components/`
- Use `*.models.ts` and `*.utils.ts` (plural) — the singular forms are blocklisted

Formatting (Prettier): semicolons, double quotes, trailing commas everywhere, 100-column width. Two-space indentation and LF line endings via `.editorconfig`.

## Testing

**Unit** — Vitest with the `jsdom` environment, globals enabled, and `@testing-library/jest-dom` loaded in setup. The `e2e/` folder is excluded from the run. Coverage covers `src/**/*.{ts,tsx}`, skipping test files.

**E2E** — Playwright targets `http://localhost:3000` and starts the dev server itself (`webServer`), reusing an already-running server outside CI. On failure it captures a screenshot and a video, plus a trace on the first retry. In CI: 2 retries, 1 worker, and `forbidOnly`.

## Git hooks

Managed by Husky:

- **pre-commit** — `lint-staged`: ESLint `--fix` + Prettier on staged JS/TS files, Prettier on staged JSON/MD/CSS/SCSS/HTML/YAML files.
- **pre-push** — lint, format check, unit tests, and E2E tests. Any failure aborts the push.

Hooks are installed automatically by the `prepare` script on `npm install`.

## CI

`.github/workflows/playwright.yml` runs the E2E suite on pushes and pull requests targeting `main`/`master`, uploading `playwright-report/` as an artifact (30-day retention).

## Docker

The `Dockerfile` builds the app with Node and serves the static output with nginx:

```bash
docker build -t react-vite-base .
docker run -p 8080:80 react-vite-base
```

`nginx.conf` handles what a SPA needs in production:

- SPA fallback (`try_files ... /index.html`) so deep React Router URLs resolve
- immutable long-lived cache for hashed files under `/assets/`
- `no-cache` on `index.html`, so a new deploy reaches the browser
- gzip for text assets

It deploys to any container platform — Cloud Run, ECS, Fly.io, Railway, Azure Container Apps.

## Deploying without Docker

`npm run build` emits a fully static `dist/`. Upload it to any static host (Vercel, Netlify, S3 + CloudFront, GitHub Pages) and configure the host to rewrite unknown paths to `index.html` — without that rewrite, refreshing a nested route returns a 404.
