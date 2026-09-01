# portfolio

Martin Vila's personal site. A small static document: notes, open source, and a
year ledger of GitHub work.

## Stack

| Layer | Technologies |
|-------|---------------|
| **Framework** | [Next.js](https://nextjs.org) 16, [React](https://react.dev) 19 |
| **Language** | [TypeScript](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) 4 |
| **Content** | [fumadocs](https://fumadocs.dev) MDX, [next-intl](https://next-intl-docs.vercel.app) |
| **Data** | GitHub GraphQL + REST via `@octokit/rest` |
| **Monorepo** | [Turborepo](https://turbo.build), [pnpm](https://pnpm.io) workspaces |
| **DX** | [Ultracite](https://ultracite.run) (Biome), [Husky](https://typicode.github.io/husky) |

## Getting Started

```bash
pnpm install
pnpm dev
```
