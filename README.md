# Portfolio

Personal portfolio site built with Next.js 16, React 19, and Tailwind CSS v4.

## Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Cache Components)
- **UI**: [shadcn/ui](https://ui.shadcn.com/) (Radix primitives, Tailwind)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [tw-animate-css](https://github.com/antfu/tw-animate-css)
- **Blog**: [Fumadocs](https://fumadocs.vercel.app/) (MDX)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **URL state**: [nuqs](https://nuqs.47ng.com/)
- **Analytics**: [Umami](https://umami.is/) (optional)
- **Linting**: [Biome](https://biomejs.dev/) + [Ultracite](https://ultracite.ai/)

## Development

```bash
bun install
bun dev
```

## Scripts

| Command | Description |
|--------|-------------|
| `bun dev` | Start dev (turbo) |
| `bun run dev:web` | Start web app only |
| `bun build` | Production build |
| `bun run lint` | Lint and fix |
| `bun run format` | Format code |
| `bun run check-types` | Type check all packages |

## Environment

Copy `apps/web/.env.example` to `apps/web/.env.local`. All variables are optional:

```env
# Disable Turborepo telemetry
TURBO_TELEMETRY_DISABLED=1

# GitHub API token (increases rate limits for projects page)
GITHUB_TOKEN=

# Umami Analytics (self-hosted or cloud)
NEXT_PUBLIC_UMAMI_URL=https://your-umami-instance.com/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id

# Site URL
NEXT_PUBLIC_SITE_URL=
```
