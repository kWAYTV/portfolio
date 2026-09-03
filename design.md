# Design — Martin Vila

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
modern-minimal (Geist school — single sans family, monochrome, composed, quiet)

## World
A concise portfolio index on a wide editorial sheet. The home introduction
uses an asymmetric two-column composition, then returns to full-width indexes.
The GitHub contribution grid is the one piece of instrumentation; everything
else is a list. Surfaces are softly rounded, never pill-shaped. Dark mode is
the same sheet inverted.

## Macrostructure family
- Home: Index-First — large identity at the leading edge, summary and social
  links at the trailing edge, then stacked full-width indexes: activity grid
  and pinned work. No hero figure.
- Content pages (about, privacy): the same document rhythm — small title, lede,
  sections with a body-size heading and a hairline above.
- Catalogue pages (projects): rows with a letter mark, title, sub line, and mono
  meta. Filters are a rounded input and small sort tabs.

## Theme — custom "graphite", zero chroma
- `--color-paper`   oklch(100% 0 0)  · dark oklch(12% 0 0)
- `--color-paper-2` oklch(97% 0 0)   · dark oklch(16% 0 0)
- `--color-paper-3` oklch(94% 0 0)   · dark oklch(20% 0 0)
- `--color-rule`    oklch(91% 0 0)   · dark oklch(24% 0 0)
- `--color-rule-2`  oklch(84% 0 0)   · dark oklch(32% 0 0)
- `--color-ink`     oklch(16% 0 0)   · dark oklch(94% 0 0)
- `--color-ink-2`   oklch(36% 0 0)   · dark oklch(78% 0 0)
- `--color-muted`   oklch(52% 0 0)   · dark oklch(62% 0 0)
- `--color-focus`   = ink

There is no accent. Emphasis is weight and proximity. The contribution grid is
ink at five opacity steps (`color-mix` against paper) so it always matches the
sheet it sits on.

## Typography
- One family: Geist Sans. Geist Mono only for numerals, dates, and labels.
- Home name: fluid up to `--text-2xl` (4rem), weight 600, tracking -0.03em
- Page title: `--text-xl` (1.75rem), weight 500, tracking -0.03em
- Section heading: `--text-lg` (1.125rem), weight 600, ink. Never uppercase.
- Body: `--text-md` (1rem), weight 400, line-height 1.6, ink-2
- Meta: `--text-sm` (0.8125rem), muted; mono + tabular-nums for numbers
- Measure: 62ch

## Shell
- `--shell: 64rem`. Inline padding clamp(1.25rem, 5vw, 2.5rem).
- Home intro: 2:3 split above 40rem, one column below.
- Sections separated by `--space-3xl`; inside a section, `--space-md`.

## Radius
- `--radius-cell` 2px — heatmap cells
- `--radius-control` 6px — inputs, chips, nav hover, buttons
- `--radius-mark` 8px — 32px letter marks
- `--radius-surface` 10px — row hover surface, cookie banner
Nothing is a pill. `corner-shape: squircle` is applied as a progressive
enhancement on surfaces.

## Motion
- Composed page: no reveals, no route choreography, no counters.
- Feedback only: colour and background transitions 120–200ms, `--ease-out`.
- Theme changes snap; transitions are suppressed for the swap.
- The heatmap readout swaps text instantly; hover is enough.
- Reduced motion: transitions collapse to 0s.

## Microinteractions stance
- Silent success
- Hover gated behind `(hover: hover) and (pointer: fine)`
- Row hover paints a `--radius-surface` background that bleeds 12px past the
  content edge (`inset` pseudo), so text never shifts.
- Readouts update through `aria-live="polite"`; the grid is a labelled list.

## Nav / footer
- Nav: N1 — wordmark left, two text links (about, projects), then the locale
  and theme controls. One row, hairline below, no tagline.
- Footer: Ft2 — one inline row: year · source · privacy. Hairline above.

## Per-page allowances
- Home is the only page that carries the contribution grid.
- Never invent metrics. Totals, streaks, and active days are computed from the
  GitHub calendar; levels come from GitHub's own quartiles.
- The grid mirrors GitHub's 7 × 53 layout on purpose — it is the reader's
  mental model — but is coloured with the site's ink, not GitHub's green.

## Rendering
- Everything is prerendered. GitHub data is `use cache` with hourly life.
- Only project search params are dynamic, behind a row skeleton.

## Product constraint
The site is a static document. No IDE chrome, terminals, command palettes,
blog, or fake source views.
