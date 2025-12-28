# Portfolio

Personal portfolio site built with Next.js 16, React 19, and Tailwind CSS v4.

## Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Cache Components)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Blog**: [Fumadocs](https://fumadocs.vercel.app/) (MDX)
- **Animations**: [Motion](https://motion.dev/)
- **Analytics**: [Umami](https://umami.is/) (optional)
- **Linting**: [Biome](https://biomejs.dev/) + [Ultracite](https://ultracite.ai/)

## Development

```bash
bun install
bun dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun build` | Production build |
| `bun start` | Start production server |
| `bun run lint` | Lint and fix |
| `bun run format` | Format code |

## Environment

All environment variables are optional:

```env
# GitHub API token (increases rate limits for projects page)
GITHUB_TOKEN=

# Umami Analytics (self-hosted or cloud)
NEXT_PUBLIC_UMAMI_URL=https://your-umami-instance.com/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```