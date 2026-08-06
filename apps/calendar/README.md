# Calendar

Full-featured calendar component built with TanStack Start and shadcn/ui. The block
itself lives in `@repo/ui` and is published as an installable shadcn registry item via
`@repo/registry`; this app is its live demo. Day, week, month, year, and agenda views
over a shared event/user data model, with drag-and-drop, resizing, filtering, and
per-user preferences.

[Live site](https://calendar.playground.nicolas-thouvenin.dev)

## Features

- **Five views** — Day, Week, Month, Year, Agenda, switchable from the header tabs.
- **Date navigation** — previous/next per view (day/week/month/year), a "today" shortcut,
  and an event-count badge for the visible range.
- **Month view** — up to 3 events shown per day, with a "+N more" overflow dialog listing
  the rest; multi-day events render a single badge spanning their full width across cells
  (first/middle/last segments); today's date is highlighted; hovering an empty day reveals
  an inline "+ Add Event" button.
- **Week/Day view** — hourly grid (00:00–23:00, half-hour click/drop granularity), a
  dedicated banner row for multi-day events that span into the visible range, and (day
  view only) a sidebar with a mini date-picker and a live "happening now" indicator for
  whatever event overlaps the current moment.
- **Year view** — all 12 months at a glance; days with events show a colored dot (or a
  "+N" badge once a day has more than 2); clicking a day opens the same event-list dialog
  month view uses.
- **Agenda view** — a searchable (cmdk-powered) flat list of the visible month's events,
  grouped either by date or by color (toggle in Settings).
- **Event details** — click any event to see its responsible user, start/end date & time,
  and description, with inline Edit and Delete actions.
- **Create/edit events** — via the header button, an hour slot in day/week view, or an
  empty day cell in month view (each prefills the date/time accordingly); title and
  description are required (Zod-validated).
- **Drag-and-drop** — move an event between days (month view) or between hour slots
  (day/week view), including dropping directly onto a slot another event already
  occupies.
- **Resize** — drag an event block's bottom edge in day/week view to change its end time.
- **Filters** — by color and by user, each multi-select (additive: picking a second color
  or user adds to the set, it doesn't replace it) and composed together via intersection
  (narrowing by user only shows that user's events *within* the active color filter, not
  instead of it); "All" in the user filter clears it, the same way "Clear Filter" does
  for colors.
- **Settings** (persisted to `localStorage`) — badge style (colored vs. dot), 12h/24h
  time format, the hour the day/week grid scrolls to on open ("days start at"), and
  agenda grouping (date vs. color).
- **i18n** — fully bilingual (FR base locale, EN), including pluralized event counts and
  localized date formatting.

## Tech stack

- **Framework**: TanStack Start (React 19, SSR on Cloudflare Workers)
- **Routing**: File-based TanStack Router
- **Component**: the calendar itself is `Calendar` from `@repo/ui`
  (`packages/ui/src/blocks/calendar/`) — a reusable block, not app-local code. This app
  is a thin shell: routing, i18n wiring, and demo data (`src/data/`) around that component.
- **Styling**: Tailwind CSS v4 + `@repo/ui` design tokens (Base UI primitives, `@repo/ui`
  `style: "base-luma"`)
- **Forms**: TanStack Form + Zod (`packages/ui/src/blocks/calendar/schemas.ts`)
- **Drag & drop**: native HTML5 DnD (`draggable`, `dragstart`/`dragover`/`drop`)
- **Resize**: `re-resizable`
- **Dates**: date-fns
- **i18n**: Paraglide JS — `fr` base locale, `en` second
- **Tests**: Playwright E2E
- **Deploy**: Cloudflare Workers via Wrangler
- **Registry**: published as `full-calendar` in the shared `@repo/registry` (see
  [packages/registry](../../packages/registry)), not self-published from this app —
  install it into another project with
  `npx shadcn@latest add https://registry.playground.nicolas-thouvenin.dev/r/full-calendar.json`

## Getting started

This app lives in the [monorepo](../../) — run commands from the repo root or from this directory.

### Bootstrap (first run only)

Paraglide output is gitignored and must be generated before the first dev server start:

```bash
pnpm exec paraglide-js compile --project ../../packages/i18n/project.inlang --outdir ./src/lib/paraglide
```

### Development

```bash
pnpm dev --filter calendar   # http://localhost:3005
```

### Build & preview

```bash
pnpm build --filter calendar
pnpm preview      # serves production build on port 3005
```

### Deploy

```bash
pnpm deploy --filter calendar
```

## Tests

60 Playwright end-to-end tests across 11 spec files (`src/tests/e2e/calendar/`), covering
every feature above — all five views, navigation, event CRUD and validation, event
details, color/user filters, settings, and drag-and-drop/resize. Deterministic by design:
tests run against a hand-authored fixture set (`src/data/e2e-fixtures.ts`,
enabled via `?e2e=1`) instead of the random data real visitors see, so titles, colors,
users, and dates are known in advance regardless of which day the suite runs.

| Spec | What it covers |
| --- | --- |
| `view-navigation.spec.ts` | Tab switching, date navigator prev/next, today button, event-count badge |
| `month-view.spec.ts` | Event badges, 3-event cap + "+N more" dialog, multi-day segments, today highlight, empty-cell add |
| `week-view.spec.ts` / `day-view.spec.ts` | Hourly grid, multi-day banner row, "happening now", mini date-picker, hour-slot add |
| `year-view.spec.ts` | Dot/"+N" indicators, event-list dialog, start-date-only grouping |
| `agenda-view.spec.ts` | Date/color grouping, cmdk search, empty state |
| `event-crud.spec.ts` / `event-details.spec.ts` | Add/edit/delete, Zod validation errors, details dialog fields |
| `filters.spec.ts` | Color filter (multi-select), user filter (multi-select), "All"/clear, color+user intersection |
| `settings.spec.ts` | Badge variant, time format, start-of-day scroll position, `localStorage` persistence |
| `dnd.spec.ts` | Month-view day-to-day drag, day-view hour-to-hour drag, dropping onto an occupied slot, resize |

Playwright tests require the **production build** — do not test against `pnpm dev`.

```bash
pnpm build --filter calendar && pnpm preview   # in one terminal
pnpm test --filter calendar                    # in another
```

### Known issue: resize on Firefox

Resizing an event's bottom edge (day/week view) shrinks it instead of growing it, but
only on Firefox, and only reproduced so far under Playwright automation — not yet
confirmed with a real Firefox session and a physical mouse. `re-resizable` computes the
new size from absolute `event.clientY` (not `movementX`/`Y`), so this isn't the usual
"Firefox WebDriver reports movementY as 0" footgun; the root cause wasn't fully isolated
beyond that. The corresponding test (`dnd.spec.ts`) is skipped on Firefox with this note
rather than asserting a guessed-at outcome. Worth a manual check before ruling out a real
`re-resizable` + Firefox incompatibility.

## Project structure

The calendar UI itself lives in `@repo/ui`, not in this app — this repo only wires it up:

```
apps/calendar/src/
├── components/               # App-local wrappers around @repo/ui (Nav, Logo, NotFound, ...)
├── data/
│   ├── mocks.ts, requests.ts   # Random demo data (real visitors)
│   └── e2e-fixtures.ts          # Deterministic data (?e2e=1, tests only)
├── routes/                   # TanStack Router file-based routes
├── lib/paraglide/             # Generated i18n runtime (gitignored)
└── tests/e2e/                 # Playwright test suites

packages/ui/src/blocks/calendar/   # The actual calendar block (published as @repo/ui's Calendar)
├── calendar.tsx                     # Entry point — providers + header + body
├── contexts/                        # CalendarProvider (state, filters, settings) + DndProvider
├── header/                           # View tabs, date navigator, filter, user select, today button
├── views/                             # month/, week-and-day-view/, year-view/, agenda-view/
├── dialogs/                            # Add/edit event, event details, delete, event list
├── dnd/                                  # DraggableEvent, DroppableArea, ResizableEvent
└── settings/                              # Settings dropdown
```
