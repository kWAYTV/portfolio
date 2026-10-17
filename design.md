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
- Masthead keeps wordmark, about, projects, locale, sound, theme. Under
  40rem it is two fixed rows — wordmark + controls, then the links — so label
  length in either language never changes its height.

## Motion
Transform and opacity only. `--ease-out` for everything that settles,
`--dur-micro` 120ms / `--dur-short` 200ms / `--dur-long` 400ms. Hover motion
is gated to `(hover: hover) and (pointer: fine)`. Reduced motion zeroes every
duration and delay, including view transitions.
- Sections rise once on mount (opacity + 10px). The home name stamps in from
  a 1.04 scale. Timeline rows and repo rows cascade by `--i` (35–40ms steps).
- Stack names scroll on a 28s linear marquee and pause on hover.
- The open-to-work dot pulses on transform and opacity only (never
  `box-shadow`).
- The grain is a 256px noise tile repeated over a fixed layer, never a live
  viewport-sized filter and never a blend mode.
- Press: every control, chip, button and skill mark squashes to 0.97 on
  `:active` (icon controls 0.94). Chips lift 1px on hover. Repo rows go
  ink-on-paper on the mark and fill the star on hover; the row itself stays
  color-only. Skill marks lift and grow 1.15 on hover.
- The masthead nav is a `Segment`: a rubber thumb slides to the current page.
- Route changes are React `<ViewTransition>`s. The old document fades out in
  `--dur-micro`; the new one shows live so its mount cascade plays. The
  masthead is anchored by `view-transition-name`, the colophon morphs.
- Projects catalogue: the skeleton exits (`bones-out`), the rows enter
  (`rows-in`) through the same Suspense boundary.
- Theme flips behind a 420ms circular wipe from the toggle via
  `document.startViewTransition`. Skipped without support or under reduced
  motion. Body colours never transition on their own.
- The contribution grid sweeps in column by column (6ms per week) the first
  time it scrolls into view.

## Sound
Synthesised on a shared bus: master gain 0.9 into a soft compressor so peaks
are tamed and quiet voices still read. Each interaction has its own voice.
- Press (buttons, chips): a 2.6kHz click plus a 60ms square drop 420→170Hz.
- Navigate (same-site links): the click plus a square drop 620→300Hz.
- Hover (mouse only, 70ms throttle): an 18ms sine tick 1500→1300Hz.
- Keyboard focus: a 45ms triangle at 720Hz.
- Switch (locale): two square notes 440 then 587Hz.
- Theme: a filtered noise sweep 500→2600Hz under a triangle rise 330→660Hz.
- Mute: a falling triangle pair; unmute: a rising 523/659/784Hz arpeggio.
A header toggle persists mute in `localStorage` under `sound:v1`. Elements opt
into a voice with `data-sound="press|switch|theme"`.

## Rendering
- Home activity and featured repos are `use cache` and belong in the static
  shell. Project search stays dynamic.
- Repo listing is one GitHub page (a second only if the first is full), cached
  for days. Do not paginate the whole account on the request path.

## Product constraint
Personal site for Martín Vila. No invented metrics, no IDE chrome, no copied
third-party portfolio layout.
