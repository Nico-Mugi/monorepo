// "/" and "/cv" (unprefixed) are deliberately NOT prerendered here, even though
// they're valid fr routes. Prerendering them would bake a static, French-only
// index.html/cv/index.html into dist/client, which Cloudflare's Workers Static
// Assets serves directly ahead of the Worker for any exact-path match — bypassing
// paraglideMiddleware entirely, so the PARAGLIDE_LOCALE cookie is never consulted.
// Leaving them out of prerenderRoutes means requests always reach the Worker,
// which renders "/" and "/cv" dynamically in whichever locale the cookie/strategy
// resolves to, matching how "/en" and "/en/resume" already behave (never
// prerendered, always dynamic). "/fr" and "/fr/cv" stay static since those URLs
// are explicitly fr regardless of any preference.
export const prerenderRoutes = [
  { path: "/fr", prerender: { enabled: true } },
  { path: "/fr/cv", prerender: { enabled: true } },
];
