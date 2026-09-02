# instant-nav rig: web

- BUILD: local production build — `EXPOSE_TESTING_API=1 pnpm build` in
  `apps/web`, served by `pnpm start --port 3100` (Playwright's `webServer`
  starts it). Never `next dev`: it does not prefetch and its lock is
  unreliable.
- EXPOSE: `experimental.exposeTestingApiInProductionBuild` is
  `process.env.EXPOSE_TESTING_API === "1"` in `next.config.ts`. Set it at
  build time. It is never set on Vercel production builds.
- RUN: `pnpm test:e2e` (runs `playwright test` from `apps/web`, `testDir`
  `./e2e`, projects `desktop` + `mobile`). Point at an existing server with
  `BASE_URL=http://host:port`.
- TEST USER: none — the site has no authentication. Everything renders for an
  anonymous visitor.
- DRIFT: `GITHUB_TOKEN` must be present at build time, otherwise the activity
  section renders nothing and `home-activity` is absent (false RED). Locale
  comes from the URL (`/` = en, `/es`); the `NEXT_LOCALE` cookie can redirect
  `/projects` to `/es/projects` if a previous test set it — tests start from a
  fresh context so this does not apply. Cookie-consent banner is
  `localStorage`-gated and does not affect the shell.
- LOOP: `EXPOSE_TESTING_API=1 pnpm build && pnpm test:e2e`. Stop any
  previous `next start` on 3100 first (`reuseExistingServer` is on locally, so
  a stale server would be measured). The artifact is the one freshly built; no
  SHA liveness probe is needed.
- LIVENESS: n/a for the local rig.
- WALLS: `GITHUB_TOKEN` is required for a meaningful home-page verdict.
  Playwright browsers: `pnpm exec playwright install chromium`.
