# Design — Martin Vila

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
editorial (Swiss neo-grotesque slot — no serif anywhere)

## World
A strip-chart recorder. Black ink on white paper, hairline grid, mono readouts.
The GitHub contribution trace is the instrument; everything else is the manual
around it. Dark mode is the same sheet inverted, not a second theme.

## Macrostructure family
- Home: Stat-Led — lede, real contribution total as the figure, worded
  qualifier, the recorder, four readouts, then ruled index rows.
- Content pages (about, notes, privacy): stacked display heads with a 2px ink
  rule above, ruled rows, mono meta. No kickers, no numbered eyebrows.
- Catalogue pages (projects, notes index): ruled rows — title · mono meta ·
  optional sub line. Filters are typographic (underlined input, mono sort links).

## Theme — custom, zero chroma
- `--color-paper`   oklch(99% 0 0)   · dark oklch(9% 0 0)
- `--color-paper-2` oklch(96% 0 0)   · dark oklch(14% 0 0)
- `--color-rule`    oklch(88% 0 0)   · dark oklch(24% 0 0)
- `--color-rule-2`  oklch(76% 0 0)   · dark oklch(34% 0 0)
- `--color-ink`     oklch(12% 0 0)   · dark oklch(97% 0 0)
- `--color-ink-2`   oklch(30% 0 0)   · dark oklch(82% 0 0)
- `--color-muted`   oklch(46% 0 0)   · dark oklch(64% 0 0)
- `--color-focus`   = ink

There is no accent. Emphasis is weight, size, and the 2px ink rule.

## Typography
- Display: Archivo 800, lowercase, tracking -0.045em, line-height ≤ 0.95
- Body: Archivo 400, 1rem, line-height 1.5
- Label voice: JetBrains Mono 500, 0.75rem, uppercase, tracking 0.09em, muted
- Readouts / numerals: tabular-nums everywhere
- Measure: 62ch

## Spacing
4-point named scale in `tokens.css`. Named tokens only.

## Motion
- One focal moment, home only: the trace draws left→right (900ms) while the
  figure counts up (900ms). Both CSS, off the main thread, from a hidden start.
- Motion (motion.dev) owns the recorder stylus: a stiff spring
  (stiffness 520, damping 42) glides the pen between days; keyboard steps jump.
- Feedback only elsewhere: underline draw-in 200ms, row title shifts 6px on
  hover, controls scale 0.96 on press. All `--ease-out`
  cubic-bezier(0.23, 1, 0.32, 1). No scroll reveals, no parallax, no route
  choreography.
- Reduced motion: focal animations resolve instantly; spring jumps.

## Microinteractions stance
- Silent success
- Hover gated behind `(hover: hover) and (pointer: fine)`
- Readout updates through `aria-live="polite"`; the recorder is a slider role

## Nav / footer
- Nav: N6 masthead band — display wordmark + controls, hairline row with mono
  links and the tagline, 2px ink rule below the wordmark.
- Footer: Ft4 colophon — one mono paragraph (type, data source, stack, year)
  and two links.

## Per-page allowances
- Home is the only page that carries the recorder.
- Never invent metrics. Totals, streaks, and the busiest day are computed from
  the GitHub calendar.
- Never clone GitHub's contribution heatmap.

## Rendering
- Everything is prerendered. GitHub data is `use cache` with hourly life.
- Only project search params are dynamic, behind a row skeleton.

## Product constraint
The site is a static document. No IDE chrome, terminals, command palettes, or
fake source views.
