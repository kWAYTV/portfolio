# portfolio

Martin Vila's personal site. One narrow page: who I am, a year of GitHub
contributions, and the open source work I pin.

## Stack

| Layer | Technologies |
|-------|---------------|
| **Framework** | [Next.js](https://nextjs.org) 16, [React](https://react.dev) 19 |
| **Language** | [TypeScript](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) 4, hand-written tokens (`tokens.css`) |
| **Content** | [next-intl](https://next-intl-docs.vercel.app) (en · es) |
| **Data** | GitHub GraphQL + REST via `@octokit/rest` |
| **Monorepo** | [Turborepo](https://turbo.build), [pnpm](https://pnpm.io) workspaces |
| **DX** | [Ultracite](https://ultracite.run) (Biome), [Husky](https://typicode.github.io/husky) |

## Getting Started

```bash
pnpm install
pnpm dev
```

Set `GITHUB_TOKEN` in `apps/web/.env` to render the contribution grid and the
project lists; see `apps/web/.env.example`.
