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
```

## Architecture & Structure

### Internationalization (i18n)
- **Supported locales**: Spanish (`es`) and English (`en`)
- **Default locale**: Spanish (`es`)
- **Routing**: `/[locale]/` pattern with automatic redirection via `middleware.ts`
- **Translations**: Centralized in `/lib/translations.ts`
- **Language detection**: Based on Accept-Language header or URL path

### Component Architecture
The project uses Tailark components with shadcn CLI:
- **Registry**: `https://tailark.com/r/{name}.json` (configured in `components.json`)
- **Installation**: `pnpm dlx shadcn add @tailark/<component-name>`
- **Component hierarchy**:
  - `/components/ui/` - Reusable UI primitives (buttons, cards, forms)
  - `/components/` - Page sections and features (hero, footer, pricing)
  - `/components/sections/` - Additional section components
  - Internationalized variants: Components ending with `-intl.tsx` or `-es.tsx`/`-en.tsx`

### Key Dependencies
- **Animation**: `motion` package for text effects and animations
- **Icons**: `lucide-react` for icon components
- **Styling**: Tailwind CSS v4 with CSS variables via `cn()` utility
- **Forms**: Radix UI primitives for accessible components

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
- **Video**: PandaVideo player integration
- **Analytics**: Google Tag Manager support
- **Meetings**: HubSpot meeting scheduler
- **Communication**: WhatsApp integration

## Deployment Configuration

### Vercel Settings (`vercel.json`)
- **Region**: `iad1` (US East)
- **Max duration**: 30 seconds for locale pages
- **Security headers**: CSP, XSS protection, referrer policy
- **Cache**: Static assets cached for 1 year
- **Auto-redirects**: Based on Accept-Language header

### Content Security Policy
Configured to allow:
- PandaVideo player embeds
- HubSpot meeting scheduler
- ImageKit CDN images
- Google Fonts and analytics

## Component Patterns

### Creating New Components
1. Check existing patterns in similar components
2. Use `cn()` utility for conditional styling
3. Import from local paths (`@/components/...`)
4. Follow TypeScript strict mode requirements

### Adding Tailark Components
```bash
# Install new component
pnpm dlx shadcn add @tailark/[component-name]

# Component will be added to /components/ui/
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
1. Add hostname to `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'new-domain.com', pathname: '/**' }
  ]
}
```

### Modifying CSP for New Embeds
Update `vercel.json` headers section with appropriate frame-src or child-src domains.

## Important Notes

- **Component imports**: Always use local paths, never `@tailark/core/...`
- **Server restart**: Restart dev server after configuration changes
- **Hero component**: Includes Header internally, don't duplicate
- **Type safety**: Project uses TypeScript strict mode
- **UTF-8 encoding**: Always use for CSV exports (per global instructions)
- **Responsive testing**: Use Playwright for responsive design verification (per global instructions)