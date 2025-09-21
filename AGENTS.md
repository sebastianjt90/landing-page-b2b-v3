# Repository Guidelines

## Project Structure & Module Organization
The Next.js app lives in `app/`, with locale-aware routes under `app/[locale]/` and server endpoints in `app/api/`. Shared UI is in `components/`, hooks in `hooks/`, and cross-cutting utilities in `lib/` and `types/`. Static assets live in `public/` and brand files in `assets/`. HubSpot automation helpers sit in `scripts/`. Import shared code via the `@/*` path alias defined in `tsconfig.json`.

## Build, Test, and Development Commands
Install dependencies with `pnpm install` (lockfile is PNPM). Use `pnpm dev` for the local server at http://localhost:3000 and `pnpm lint` before opening a PR. Production builds run through `pnpm build` followed by `pnpm start`. For attribution smoke tests, run `node scripts/test-production-api.js` (API health) or `node scripts/analyze-hubspot-attribution.js` (property inventory) once HubSpot env vars are loaded.

## Coding Style & Naming Conventions
TypeScript is strict; prefer typed React function components and async/await. Follow the existing two-space indentation enforced by the Next/TypeScript ESLint config (`eslint.config.mjs`). Co-locate component styles in Tailwind utility classes and keep reusable variants in `components/`. Name files and directories with kebab-case (e.g., `hero-section.tsx`) and keep exported symbols in PascalCase. Fonts and theme tokens are managed centrally in `app/globals.css`.

## Testing Guidelines
There is no Jest suite yet; manual and scripted validation is documented in `TESTING_GUIDE.md`. Run `node scripts/quick-test.js` before releasing and follow the end-to-end HubSpot flow outlined in the guide for major changes. When adding tracking, outline the console log plan in the PR and update the checklist in `TESTING_GUIDE.md` if steps change. Capture new curl examples in `TEST_UTM_TRACKING.md` to keep downstream teams aligned.

## Commit & Pull Request Guidelines
Commits follow `type: summary` (e.g., `feat: Add VSL Pmax page`). Keep them scoped to a single concern and include migrations or script updates in the same commit when needed. PRs should describe intent, note HubSpot configuration changes, and attach screenshots or links for UI updates. Reference Jira or GitHub issues where applicable and call out new env vars so they reach `vercel.json` and project secrets.

## Security & Configuration Tips
Never commit real credentials; `CREDENTIALS.json` is placeholder-only. Confirm that `HUBSPOT_PRIVATE_ACCESS_TOKEN` and related keys exist in `.env.local` before running scripts. Locally, `pnpm dev` loads `.env.local`; in Vercel mirror changes through `npx vercel env pull`/`push` and confirm scopes listed in `FIX_HUBSPOT_SCOPES.md`. Remove temporary logging once attribution tests pass to avoid leaking UTMs.
