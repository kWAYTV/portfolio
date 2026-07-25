# Design — Martín Vila Portfolio

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
modern-minimal

## Macrostructure family
- App shell: Workbench — the IDE chrome *is* the product surface (tabs, explorer, ⌘K, terminal, status bar). Preserve all behavior; restyle only.
- Marketing / home preview: Workbench + left-biased typographic hero (title left, content stack). One graphite band for featured work.
- Content pages (about, blog posts, privacy): Index / tabular — stacked section heads, hairline rules, mono meta. No left-margin numbered eyebrows.
- Catalogue pages (projects, blog index): hairline row lists — name · meta · action. No card grids.

## Theme
Cobalt (catalog) — cool engineered paper, one electric cobalt signal, Space Grotesk display + Geist body + JetBrains Mono.

- `--color-paper`   oklch(98.5% 0.004 250)
- `--color-paper-2` oklch(96% 0.006 250)
- `--color-ink`     oklch(24% 0.02 258)
- `--color-ink-2`   oklch(34% 0.018 257)
- `--color-rule`    oklch(88% 0.01 250)
- `--color-accent`  oklch(58% 0.20 256)
- `--color-focus`   oklch(58% 0.20 256)
- `--color-graphite` oklch(22% 0.016 260)

Dark mode keeps the same hue anchor; paper drops to cool charcoal, accent lightens slightly.

## Typography
- Display: Space Grotesk, weight 500–600, style normal (never italic headers)
- Body: Geist, weight 400–500
- Mono: JetBrains Mono, weight 400–500 (labels, meta, terminal, code)
- Display tracking: -0.02em to -0.035em
- Type scale anchor: `--text-display` = clamp(1.75rem, 2.5vw + 1rem, 2.75rem) inside IDE preview panes

## Spacing
4-point named scale. Values live in `tokens.css`. Pages must use named tokens
(`var(--space-md)`), never raw ad-hoc values for new work.

## Motion
- Easings: `--ease-out` cubic-bezier(0.16, 1, 0.3, 1), `--ease-in`, `--ease-in-out`
- Reveal: fade + 10px rise, once, ≤ 600ms, IntersectionObserver
- Reduced-motion fallback: opacity-only, ≤ 150 ms
- Cap: ≤ 3 motion primitives site-wide (reveal, theme view-transition, link underline grow)

## Microinteractions stance
- Silent success — no celebratory toasts for routine actions
- Hover tooltips delay 800 ms · focus delay 0 ms
- Primary interactive affordance: cobalt underline-grow on text links; 1px border shift to accent on focusable surfaces
- ⌘K command palette remains the keyboard-first nav (N4)

## CTA voice
- Primary CTA: solid cobalt fill, 6px radius, short destination verb ("View on GitHub", "Open projects")
- Secondary CTA: typographic link with 1px underline grow — no pill outlines

## Nav / footer
- Nav: N4 Hidden behind ⌘K + IDE chrome (activity bar, tabs, explorer). Do not add a marketing SaaS nav bar.
- Footer: Ft2 via status bar — branch · file info · locale · theme. No 4-column sitemap footer.

## Per-page allowances
- App shell MUST NOT gain enrichment chrome; it already is the workbench.
- Home MAY use one graphite band (Cobalt signature) for featured projects.
- Content pages: typography only.
- Never invent metrics, testimonials, or logo walls.

## What pages MUST share
- Wordmark / site name set in Space Grotesk
- Cobalt accent ≤ 5% of any viewport
- Display + body + mono pairing
- 6px control radius, hairline borders (no drop-shadow cards)
- Stacked section heads (tag above heading when a tag exists — default OFF)

## What pages MAY differ on
- Preview content rhythm (hero stack vs tabular index vs prose)
- Presence of the graphite band (home only by default)

## Product constraint
The IDE shell (title bar, activity bar, sidebar, tabs, breadcrumbs, preview/source toggle, terminal, status bar, command palette) is product functionality — not decorative chrome to strip. Redesign restyles it; it does not remove it.

## Exports

See `tokens.css` at the project root. shadcn variables in `apps/web/src/index.css` map onto these tokens.
