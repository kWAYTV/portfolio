# Portfolio

Personal portfolio site built with Next.js 16, React 19, and Tailwind CSS v4.

## Stack

- **Runtime**: [Bun](https://bun.com/)
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Linting**: [Biome](https://biomejs.dev/) + [Ultracite](https://www.ultracite.ai/)

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

```env
GITHUB_TOKEN=your_github_token
```

Required for fetching GitHub repositories on the projects page.
