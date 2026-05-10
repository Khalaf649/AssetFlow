![AssetFlow Logo](logo/logo.jpeg)

# AssetFlow — Frontend

AssetFlow is the frontend application for the AssetTrack platform — an asset lifecycle management system designed for hardware inventory, allocations, condition reporting, and admin reporting. This repository contains a Next.js (App Router) application built with Tailwind CSS, TanStack Query, React Hook Form, Zod, and a small design system.

**Status:** Active development

## Key Features

- Authentication (register / login) with JWT-backed `AuthContext`
- Role-based views: `DEVELOPER`, `MANAGER`, `ADMIN`
- Asset inventory (create / update / decommission)
- Asset allocation lifecycle (assign / return)
- Condition reports (developers submit, admins manage)
- Reports & analytics dashboard for admins/managers
- In-app notifications and user preferences

## Tech Stack

- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Forms: React Hook Form + Zod
- Server-state: TanStack Query v5
- Icons: Lucide React
- Language: TypeScript

## Repo Layout (high level)

- `app/` — main Next.js app routes and pages
- `app/assets` — asset list, details, modals, hooks, schemas
- `app/auth` — login/register, auth API and context
- `app/condition-reports` — condition reports feature
- `app/dashboard` — protected dashboard, notification bell
- `app/reports` — admin analytics and reports
- `app/users` — user management and RBAC
- `lib/` & `src/` — shared clients, utils, UI primitives
- `logo/` — brand assets (logo.jpeg)

See the `CLAUDE.md` and `AGENTS.md` files for feature specs and agent notes.

## Local Development

Prerequisites:

- Node.js 18+ (recommended) or matching runtime for Next 16
- A package manager: `npm`, `pnpm`, or `yarn`

Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn
```

Run development server (hot reload):

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Build for production:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Environment & API

The frontend expects a backend API following the project's API envelope pattern. Default base URL used in the project code is `http://localhost:8080/api/v1`. Authentication uses Bearer JWTs sent in the `Authorization` header.

Common env variables (check `src/lib/api-client.ts` for exact names):

- `NEXT_PUBLIC_API_BASE_URL` — base URL for API requests (default `http://localhost:8080/api/v1`)

## Contributing

- Follow existing code conventions (TypeScript, Tailwind utilities)
- Use React Hook Form + Zod for new forms and validation
- Server errors and validation must be mapped into forms using `setError` (see CLAUDE.md)
- Respect URL-as-State pattern (filters/pagination in search params)

When opening PRs, include a concise description, screenshots for UI changes, and link any backend contract changes.

## Developer Notes

- Authentication: `app/auth/context/AuthContext.tsx` manages login/logout and localStorage persistence.
- Queries & mutations: `src/lib/query-keys.ts` and the hooks under `app/**/hooks` use TanStack Query v5 patterns.
- Zero-local-state pattern: filters live in URL search params, not in component state.

## Files to Inspect

- Feature specs: [CLAUDE.md](CLAUDE.md)
- Agent rules & notes: [AGENTS.md](AGENTS.md)

## License

This repository does not include a license file. Add `LICENSE` if you intend to make it open-source.

## Contact

If you need help, open an issue or reach out to the maintainers listed in the project metadata.

