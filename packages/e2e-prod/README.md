# @repo/e2e-prod

Production smoke tests: Playwright specs that hit the real deployed apps on
`nicolas-thouvenin.dev` and its subdomains, not a local build. There is no
`webServer` in the Playwright config on purpose: the point is to verify
behavior that only exists once things are actually deployed (e.g. a locale
cookie carrying across subdomains), which a local build can't reproduce.

Run manually after a deploy, not as part of `pnpm test` in CI/dev.

## Running

```bash
pnpm --filter @repo/e2e-prod test:prod
```

## What's covered

- `src/tests/cookie-domain.spec.ts`: the `PARAGLIDE_LOCALE` cookie set on one
  subdomain (e.g. portfolio) is scoped to `.nicolas-thouvenin.dev` and picked
  up by another subdomain (e.g. playground) without re-prompting for a locale.
- `src/tests/facturation-invoice.spec.ts`: the full create-invoice flow on
  `facturation.playground.nicolas-thouvenin.dev`, including a real PDF
  download — the PDF step needs Cloudflare Browser Rendering, which only
  works once deployed (local dev/preview reliably fails with a Workers-
  runtime-shim limitation). Also exercises a real, live B2Brouter API call
  (creates a draft invoice, reads its validation result, deletes it — see
  `apps/facturation/src/lib/server-fns/validate-invoice.ts`), so this test
  depends on that account's credentials staying valid.

## Conventions

- Uses `@repo/e2e-utils` for locale-switcher helpers shared with each app's own suite.
- `fullyParallel: false`, `workers: 1`: tests run against live infra, so keep
  them sequential and low-traffic rather than hammering production.
- Add a new spec under `src/tests/` when a behavior can only be verified
  cross-subdomain or post-deploy; anything testable against a single app's
  local production build belongs in that app's own `src/tests/e2e/` instead.
