# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-language B2B landing page built with Next.js 15.5.2, TypeScript, and Tailwind CSS v4. The application features internationalization (i18n) with Spanish and English support, and uses Tailark components (a shadcn/ui-based component library).

## Development Commands

```bash
pnpm dev        # Start development server (port 3000, fallback to 3001)
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm install    # Install dependencies (use pnpm, not npm or yarn)
```

### Development Workflow Notes
- **Package Manager**: Always use `pnpm` - this is specified in the project configuration
- **No TypeScript Check Script**: The project doesn't have a separate `typecheck` command configured
- **ESLint Configuration**: Uses Next.js TypeScript preset with flat config format (eslint.config.mjs)

## Architecture & Structure

### Internationalization (i18n)
- **Supported locales**: Spanish (`es`) and English (`en`)
- **Default locale**: Spanish (`es`)
- **Routing**: `/[locale]/` pattern with automatic redirection via `middleware.ts`
- **Translations**: Centralized in `/lib/translations.ts`
- **Language detection**: Based on Accept-Language header or URL path
- **Middleware matcher**: Excludes API routes, static files, assets, and public resources

### Component Architecture
The project uses Tailark components with shadcn CLI:
- **Registry**: `https://tailark.com/r/{name}.json` (configured in `components.json`)
- **Installation**: `pnpm dlx shadcn add @tailark/<component-name>`
- **Component hierarchy**:
  - `/components/ui/` - Reusable UI primitives (buttons, cards, forms) from Tailark/shadcn
  - `/components/` - Page sections and features (hero, footer, pricing, stats, integrations)
  - `/components/sections/` - Additional section components
  - Internationalized variants: Components ending with `-intl.tsx` or locale-specific `-es.tsx`/`-en.tsx`

### shadcn/ui Configuration
- **Style**: New York variant
- **Base Color**: Neutral
- **CSS Variables**: Enabled (in `app/globals.css`)
- **RSC (React Server Components)**: Enabled
- **Icon Library**: Lucide React

### Key Dependencies
- **Animation**: `motion` v12.23.12 for text effects and animations
- **Icons**: `lucide-react` for icon components
- **Styling**: Tailwind CSS v4 with CSS variables via `cn()` utility from `/lib/utils`
- **UI Primitives**: Radix UI components (@radix-ui/react-*)
- **Utilities**: `clsx` and `tailwind-merge` for className management

### Application Routes
```
/[locale]/          - Main landing page
/[locale]/login     - Login page
/[locale]/signup    - Sign up page
/[locale]/pricing   - Pricing page
/[locale]/vsl       - Video sales letter page
```

### External Integrations
- **Images**: ImageKit CDN (`ik.imagekit.io`)
- **Video**: PandaVideo player (`player-vz-711edda5-617.tv.pandavideo.com`)
- **Analytics**: Google Tag Manager, Google Analytics, Meta Pixel, PostHog
- **Marketing**: HubSpot (forms, meetings, scripts), LinkedIn Snap
- **Communication**: WhatsApp integration

## Deployment Configuration

### Vercel Settings
The project uses dual configuration (both `vercel.json` and `next.config.ts`):
- **Region**: `iad1` (US East)
- **Max duration**: 30 seconds for locale pages
- **Build command**: `pnpm build`
- **Framework**: Next.js auto-detected

### Security Headers
Content Security Policy configured to allow:
- Google services (GTM, Analytics, Ads)
- HubSpot services (forms, meetings, analytics)
- Meta/Facebook services (pixel, connect)
- PostHog analytics
- PandaVideo player embeds
- ImageKit CDN images

Headers are duplicated in both `next.config.ts` and `vercel.json` for redundancy.

## TypeScript Configuration

- **Target**: ES2017
- **Strict mode**: Enabled
- **Module resolution**: Bundler
- **Path alias**: `@/*` maps to project root
- **JSX**: Preserve mode for Next.js

## Component Patterns

### Creating New Components
1. Check existing patterns in similar components
2. Use `cn()` utility for conditional styling
3. Import from local paths (`@/components/...`)
4. Follow TypeScript strict mode requirements

### Adding Tailark Components
```bash
# Install new component from Tailark registry
pnpm dlx shadcn add @tailark/<component-name>

# Components will be added to /components/ui/
# Note: Registry URL is configured as https://tailark.com/r/{name}.json
```

### Internationalization Pattern
```typescript
// Use translations from lib/translations.ts
import { translations } from '@/lib/translations'

// Access translations
const t = translations[locale]
```

## Common Development Tasks

### Adding a New Page
1. Create directory under `/app/[locale]/`
2. Add `page.tsx` with proper locale handling
3. Update navigation components if needed

### Adding External Images
Add hostname to `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'new-domain.com', pathname: '/**' }
  ]
}
```

### Modifying CSP for New Embeds
Update both `vercel.json` and `next.config.ts` CSP headers with appropriate frame-src or child-src domains.

## Project-Specific Patterns

### File Naming Conventions
- Page components: `page.tsx`
- Layout components: `layout.tsx`
- UI components: kebab-case (e.g., `infinite-slider.tsx`)
- Internationalized components: suffix with locale or `-intl`

### State Management
- No global state management library currently
- Component-level state with React hooks
- Server components preferred where possible

### Styling Approach
- Tailwind CSS v4 with CSS variables
- No CSS modules or styled-components
- Utility-first approach with `cn()` helper
- Animation utilities from `tw-animate-css`

## Important Notes

- **Component imports**: Always use local paths, never `@tailark/core/...`
- **Server restart**: Required after modifying `next.config.ts`, `middleware.ts`, or `vercel.json`
- **Hero component**: Includes Header internally, don't duplicate
- **Type safety**: Project uses TypeScript strict mode - no implicit any
- **Package manager**: Always use `pnpm`, not npm or yarn
- **Linting**: Uses flat config format (eslint.config.mjs) with Next.js TypeScript preset
- **Path aliases**: `@/*` maps to project root (configured in tsconfig.json)
- **ESModules**: Configuration files use ESM format (.mjs, .ts with ES modules)