# Portfolio

[![Changelog-Release](https://github.com/kWAYTV/portfolio/actions/workflows/cr.yml/badge.svg)](https://github.com/kWAYTV/portfolio/actions/workflows/cr.yml)

A modern, fast, and responsive portfolio built with cutting-edge technologies.

> **Note:** This project uses [Umami](https://umami.is/) for analytics. To
> enable analytics:
>
> 1. Set up your Umami instance
> 2. Add to your `.env` file:
>    ```env
>    NEXT_PUBLIC_ENABLE_UMAMI=true/false
>    UMAMI_WEBSITE_ID="your-website-id"
>    ```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with
  [shadcn/ui](https://www.radix-ui.com/)
- **Content**: [MDX](https://mdxjs.com/) for blog posts
- **Query Client** [Tanstack Query](https://tanstack.com/query/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Metrics**: [Umami](https://umami.is/)
- **Development**:
  - [Prettier](https://prettier.io/) for code formatting
  - [ESLint](https://eslint.org/) for code linting
  - [pnpm](https://pnpm.io/) for package management

## Features

- 🌓 Dark/Light mode with system preference detection
- 📱 Fully responsive design
- 🚀 Server-side rendering and static generation
- 📝 MDX blog with frontmatter support
- 🎨 Modern UI with custom animations
- 🔄 Automatic changelog generation
- 🌐 SEO optimized with OpenGraph images
- 📰 RSS feed support
- ⚡ Optimized performance with Next.js App Router
- 🔒 Type-safe environment variables with T3 Env
- 🎯 Proper error handling and loading states

## Inspiration

This portfolio is a complete rewrite inspired by Vercel's minimalist design
approach. While it shares the clean aesthetics, the codebase has been built from
the ground up with custom implementations and additional features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for more details.
