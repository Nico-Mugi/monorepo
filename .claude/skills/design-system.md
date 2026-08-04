---
description: Shared design-system tokens and theming rules for every app in this monorepo.
  Invoked whenever writing or reviewing className styling, building a new component,
  scaffolding a new app's root/styles, or touching packages/ui/src/styles/theme.css.
tools:
  - Read
  - Edit
  - Write
  - Grep
---

There is exactly one design system for this monorepo, defined in
`packages/ui/src/styles/theme.css`. Every app imports it and consumes it through
semantic Tailwind v4 tokens — never through hardcoded colors, hex values, or the raw
Tailwind neutral/gray palette.

## Source of truth

`packages/ui/src/styles/theme.css` defines `:root` (light) and `.dark` (dark) CSS
variables plus an `@theme inline` block that maps them to Tailwind's `--color-*` and
`--radius-*` namespaces. That mapping is what makes `bg-primary`, `text-foreground`,
`border-input`, etc. valid utility classes in every app.

Never fork or duplicate tokens in an app's own `styles.css`. An app's stylesheet should
only ever contain:
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@repo/ui/styles/theme.css";

@custom-variant dark (&:is(.dark *));
```
Add app-specific rules (e.g. `@page` print rules) below the imports, never above or
in place of them.

## Dark is the default theme

There's no light/dark toggle yet — dark is the shipped default everywhere. Every app's
`__root.tsx` must apply it explicitly, since Tailwind only activates `.dark` values when
that class is present on an ancestor:

```tsx
<html lang="..." className="dark bg-background">
  <head>...</head>
  <body className="bg-background text-foreground">{children}</body>
</html>
```

Do not hardcode `bg-[#0a0a0a]`, `bg-black`, or similar — always `bg-background`, and
always pair it with the `dark` class or the color resolves to the light-mode value.

## Token vocabulary — never use raw neutral/hex

| Instead of...                                  | Use                          |
| ----------------------------------------------- | ----------------------------- |
| `bg-neutral-950`, `bg-[#0a0a0a]`                 | `bg-background`               |
| `bg-neutral-900` (elevated / alternating surface)| `bg-card`                     |
| `bg-neutral-800` (pill/tag fill)                 | `bg-secondary`                |
| `text-white`, `text-neutral-50`                  | `text-foreground`             |
| `text-neutral-300` (slightly dimmer than white)  | `text-foreground/90`          |
| `text-neutral-400` (body copy on dark)           | `text-muted-foreground`       |
| `text-neutral-500` (secondary muted label)       | `text-muted-foreground/70`    |
| `text-neutral-600` (least prominent, e.g. footer)| `text-muted-foreground/50`    |
| `text-neutral-800` (decorative low-contrast text)| `text-muted`                  |
| `border-neutral-800` (card/section border)       | `border-border`               |
| `border-neutral-700` (interactive element border)| `border-input`                |
| `#8FAF83` / any brand-green literal, any opacity | `text-primary` / `bg-primary` / `border-primary` (keep the `/NN` opacity suffix) |
| `bg-[#8FAF83] text-neutral-950` (solid CTA)      | `bg-primary text-primary-foreground` |
| `hover:bg-[#a0c096]` (lighten CTA on hover)      | `hover:brightness-110` (adapts to whatever `--primary` is, works in both modes) |
| `hover:border-neutral-500` (neutral hover accent)| `hover:border-muted-foreground` |
| `hover:bg-white/5` (subtle hover surface)        | `hover:bg-accent`             |
| `fill="white"` / `fill="#8FAF83"` on inline SVG  | `className="fill-foreground"` / `className="fill-primary"` (Tailwind v4 auto-generates `fill-*` for every registered color token) |

If you're about to write `neutral-`, `gray-`, `zinc-`, `slate-`, `white`, `black`, or any
`#RRGGBB`/`bg-[...]` arbitrary color value in an app under `apps/*`, stop — there is
almost always a token for it. Check this table first.

## Brand color

Primary/accent is a sage green (`oklch(0.718 0.071 137.3)` in dark mode,
`oklch(0.548 0.063 138)` in light mode — same hue, different lightness so both modes
read as one brand). It's used for: CTAs, active/hover states, icon accents, section
dividers/gradients that fade `from-primary` to `transparent`. Don't introduce a second
accent color without updating `theme.css` itself.

`--ring` is bound to `var(--primary)` — focus rings are branded, not neutral.

## Radius

`--radius: 0.625rem` drives every `rounded-*` utility via the `@theme inline` block's
multipliers (`radius-lg` = 1×, `radius-2xl` = 1.8×, etc.). Just use the standard
Tailwind classes (`rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`) — never
hardcode a pixel radius. If the scale ever needs to change, change `--radius` once in
`theme.css`, not per-component.

## Font

`Inter Variable` (self-hosted via `@fontsource-variable/inter`, wired as `font-sans` and
the default on `html`). Don't add a second general-purpose font stack to app UI.

**Named exception**: `apps/portfolio`'s `/cv` route (print/résumé view) intentionally
uses Raleway/Lato and a light, print-oriented palette, loaded via its own Google Fonts
`<link>`. That page is a deliberately decoupled design (a résumé document, not a themed
app surface) — don't try to unify it with the token system, and don't treat it as
precedent when styling anything else.

## Charts

`--chart-1` through `--chart-5` are a 5-step ramp in the same sage hue (~137°–138°),
lightest to darkest, shared identically between light and dark mode. Use these for any
data visualization instead of inventing new colors.

## Verifying a change

After touching styling in any app:
1. `Grep` the app's `src/` for `neutral-|#[0-9a-fA-F]{6}|bg-\[#|text-white|fill="` to
   catch anything that slipped through.
2. `tsc --noEmit` in the app.
3. Boot `pnpm dev --filter <app>`, fetch the rendered HTML (curl into the scratchpad
   dir, then Read/Grep it — raw terminal grep on curl output can misdetect it as binary),
   and confirm `<html>` carries `class="dark bg-background"` and elements resolve to
   token classes, not literals.
4. `pnpm kill-dev` when done — backgrounded Vite/Wrangler processes leak past the
   session otherwise (see root `CLAUDE.md`).

## Checklist for new UI

- [ ] No raw `neutral-*`/`gray-*`/hex colors — every color is a semantic token
- [ ] `<html>` has `dark bg-background`, `<body>` has `bg-background text-foreground`
- [ ] Brand color used via `bg-primary`/`text-primary`/`border-primary`, not a literal hex
- [ ] Hover-lighten effects use `hover:brightness-110`, not a second hardcoded shade
- [ ] Radius via standard `rounded-*` classes, not arbitrary pixel values
- [ ] Inline SVG fills use `fill-foreground`/`fill-primary` classes, not `fill="..."` attributes
- [ ] `styles.css` only imports the shared stack — no forked/duplicated tokens