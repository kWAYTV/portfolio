# Design — Martín Vila

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
editorial

## Macrostructure family
- Home: Long Document — name, lede, year tape, work, notes.
- Content pages (about, blog posts, privacy): stacked section heads, hairline
  rules, mono meta. No left-margin numbered eyebrows.
- Catalogue pages (projects, blog index): hairline row lists — name · meta.

## Theme
Newsprint — warm paper, roman serif, iron-oxide accent.

- `--color-paper`   oklch(96.4% 0.014 78)
- `--color-paper-2` oklch(93.2% 0.016 76)
- `--color-ink`     oklch(20% 0.02 52)
- `--color-ink-2`   oklch(34% 0.016 58)
- `--color-rule`    oklch(84% 0.014 74)
- `--color-accent`  oklch(49% 0.155 38)
- `--color-focus`   oklch(49% 0.155 38)
- `--color-tape`    oklch(32% 0.04 48)

Dark mode keeps the same hue anchor; paper drops to warm charcoal.

## Typography
- Display + body: Newsreader, weight 400–500, style normal on headings
- Mono: IBM Plex Mono (ledger totals, month ticks, nav, meta only)
- Display tracking: -0.02em to -0.03em
- Measure: 62ch

## Spacing
4-point named scale in `tokens.css`. Pages use named tokens, never ad-hoc
values for new work.

## Motion
- None on the page itself. Newsprint is print.
- Theme change may use the browser view-transition if present.
- Reduced-motion: durations collapse to 0.

## Microinteractions stance
- Silent success
- Typographic links, no pills
- Year tape uses native SVG titles, no floating chrome

## CTA voice
- Typographic link with a short destination verb ("all projects →")
- Primary form action: iron-oxide fill, 2px radius

## Nav / footer
- Nav: N9 edge-aligned — wordmark left, three links, locale + theme
- Footer: Ft6 letter close — "Yours, Martin." then year · privacy

## Per-page allowances
- Home MAY carry the year tape as the only figure
- Never invent metrics. Contribution totals come from GitHub.
- Never clone GitHub's contribution heatmap.

## What pages MUST share
- Wordmark in Newsreader
- Iron-oxide accent ≤ 5% of any viewport
- Hairline lists, no drop-shadow cards

## Product constraint
The site is a static document. Do not reintroduce IDE chrome, terminals,
command palettes, or fake source views.
