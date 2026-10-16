# Design — Martin Vila

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
editorial poster, not a quiet index and not a card-stack clone

## World
A shop ticket on gray paper. The name is a condensed stamp across the first
viewport. Both modes carry a fixed grain. Dark mode is black, white, and
gray. The stamp, the masthead rule, and the status dot stay in
that scale. Sections are a stack — identity, scrolling stack, experience,
pinned work, contribution grid.

## Macrostructure family
- Home: Poster Ticket — status line, display name, bio, socials, Madrid clock,
  then a marquee, a timeline, featured repos, the activity grid.
- Content pages (about, privacy): the same paper and display titles, smaller
  than the home stamp.
- Catalogue pages (projects): the shell paints immediately. The repo list
  streams behind search params.

## Theme — gray paper
- `--color-paper`   oklch(96.8% 0 0) · dark oklch(12% 0 0)
- `--color-ink`     oklch(16% 0 0)   · dark oklch(94% 0 0)
- `--color-stamp`   oklch(18% 0 0)   · dark oklch(92% 0 0)
- `--color-focus`   = stamp

A fixed fractal-noise grain sits over both modes. Chroma stays at 0.
The contribution grid stays ink at five opacity steps, never GitHub green.

## Typography
- Display: Barlow Condensed, weight 700, uppercase only on the home name.
- Body: Geist Sans. Geist Mono for the clock, dates, and counts.
- Body size stays `--text-md`. Measure 62ch.

## Shell
- `--shell: 68rem`. One column. The marquee bleeds to the shell padding.
- Masthead keeps wordmark, about, projects, locale, sound, theme.

## Motion
- Sections rise once on mount (opacity + 10px). Reduced motion kills it.
- Stack names scroll on a 28s linear marquee and pause on hover.
- The open-to-work dot pulses. Row hovers stay color-only.
- Clicks on links and buttons play a 40ms square blip. A header toggle
  persists mute in `localStorage` under `sound:v1`.

## Rendering
- Home activity and featured repos are `use cache` and belong in the static
  shell. Project search stays dynamic.
- Repo listing is one GitHub page (a second only if the first is full), cached
  for days. Do not paginate the whole account on the request path.

## Product constraint
Personal site for Martín Vila. No invented metrics, no IDE chrome, no copied
third-party portfolio layout.
