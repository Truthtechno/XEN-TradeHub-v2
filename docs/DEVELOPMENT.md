# Development Guide

## Purpose

This guide standardizes local development for XEN TradeHub to ensure consistency across engineering environments and reduce onboarding friction.

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- Access to a configured database URL
- Clerk keys for authenticated flows (optional for limited local pages, required for full auth testing)

## Environment Configuration

Create `.env` at project root:

```env
# App
NEXT_PUBLIC_APP_NAME=XEN TradeHub
NEXT_PUBLIC_APP_DOMAIN=your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=
```

## Local Startup

```bash
npm install
npm run dev
```

App default URL: `http://localhost:3000`

## Build Validation (Pre-PR Standard)

```bash
npm run build
```

This validates:

- TypeScript correctness
- Next.js route compilation
- production bundling viability

## Core Application Areas

- **Marketing layer:** homepage messaging, CTA flows, market proposition.
- **Admin portal:** broker management, enquiries inbox, user and role operations.
- **Analytics:** landing traffic insights and operational activity signals.
- **API services:** admin endpoints and public enquiry/visit processing.

## Engineering Conventions

- Keep UI responsive-first (mobile to desktop).
- Use server-side filtering/pagination for scalable admin lists.
- Preserve consistency with established button variants and design tokens.
- Validate every substantial change with build checks before merge.

## Recommended Development Workflow

1. Pull latest changes.
2. Implement feature/fix in a dedicated branch.
3. Run lint/build checks.
4. Validate mobile + desktop behavior.
5. Open PR with:
   - business context,
   - test plan,
   - risk notes.

## Troubleshooting

- **Build fails on variant types:** verify usage matches button variant definitions in `src/components/ui/button.tsx`.
- **Auth behavior differs locally:** confirm Clerk keys and middleware path conditions.
- **Metadata/OG warnings:** ensure `NEXT_PUBLIC_APP_URL` or `NEXT_PUBLIC_APP_DOMAIN` is set.
