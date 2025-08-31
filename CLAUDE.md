# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a B2B landing page built with Next.js 15.5.2, TypeScript, and Tailwind CSS v4. The project uses Tailark components (a shadcn/ui-based component library) for the UI.

## Development Commands

```bash
pnpm dev        # Start development server (usually on port 3000 or 3001)
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Architecture & Key Components

### Component System
The project uses Tailark components installed via shadcn CLI with a custom registry configuration:
- **Tailark Registry**: Configured in `components.json` with URL pattern `https://tailark.com/r/{name}.json`
- **Installation**: Use `pnpm dlx shadcn add @tailark/<component-name>` to add new Tailark components
- **Component Location**: 
  - UI primitives: `/components/ui/`
  - Page sections: `/components/` (header.tsx, hero-section.tsx, logo.tsx)
  - Custom sections: `/components/sections/`

### Key Configuration Files

1. **components.json**: Contains shadcn/Tailark configuration including:
   - Style: "new-york"
   - Base color: "neutral"
   - CSS variables enabled
   - Tailark registry configuration

2. **next.config.ts**: Configured to allow external images from `ik.imagekit.io`

### Component Dependencies
- **Motion animations**: Uses `motion` package with components like `TextEffect` and `AnimatedGroup`
- **Icons**: Lucide React for icons
- **Styling**: Tailwind CSS v4 with CSS variables, using `cn()` utility from `/lib/utils`

### Project Structure Notes
- The `HeroSection` component includes the `Header` component internally - don't duplicate headers in pages
- All Tailark component imports should use local paths (`@/components/...`) not `@tailark/core/...`
- Images from external domains must be configured in `next.config.ts` under `images.remotePatterns`

## Deployment
Project is configured for Vercel deployment with `vercel.json` specifying:
- Framework: nextjs
- Build command: pnpm build
- Dev command: pnpm dev
- Install command: pnpm install

## Common Issues & Solutions

1. **Module not found errors for @tailark/core**: Replace with local imports (e.g., `@/components/logo`, `@/lib/utils`)
2. **Next.js image domain errors**: Add hostname to `next.config.ts` under `images.remotePatterns`
3. **Port conflicts**: Dev server will automatically use port 3001 if 3000 is occupied
- siempre reinicia el servidor despues de aplicar cambios para verlos ejecutados