# Production Operations Guide

## Objective

Provide a corporate-grade deployment and runtime checklist for XEN TradeHub production environments.

## Release Readiness Checklist

- `npm run build` passes without blocking errors.
- Environment variables are complete and validated.
- Admin-critical flows verified:
  - enquiries inbox load/search/filter/sort/pagination
  - broker management create/edit/reorder/delete
  - user role/status operations
- Homepage/marketing CTAs verified across mobile and desktop.

## Required Production Environment Variables

```env
NEXT_PUBLIC_APP_NAME=XEN TradeHub
NEXT_PUBLIC_APP_DOMAIN=your-production-domain.com
NEXT_PUBLIC_APP_URL=https://your-production-domain.com

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

DATABASE_URL=
```

## Deployment Pipeline Standard

1. **Build stage**
   - Run `npm ci`
   - Run `npm run build`
2. **Artifact promotion**
   - Promote only successful builds.
3. **Release stage**
   - Deploy with immutable environment config.
4. **Smoke tests**
   - Confirm route availability for `/`, `/admin/login`, `/admin/enquiries`, `/admin/brokers`.

## Security & Access Controls

- Enforce strict access for admin APIs and pages.
- Rotate auth and database secrets on a scheduled policy.
- Avoid committing `.env` and runtime secrets.
- Log and monitor admin operations (status updates, broker modifications, user access changes).

## Observability Recommendations

- Track build outcomes and deployment metadata (version, commit, timestamp).
- Capture API error rates for:
  - `/api/admin/enquiries`
  - `/api/admin/brokers`
  - `/api/admin/users`
- Monitor enquiry ingestion volume and response latency.

## Operational Playbook

- **Incident response:** rollback to last known-good deployment if critical admin workflow fails.
- **Data issues:** validate Prisma connectivity and database availability first.
- **Authentication issues:** verify Clerk key validity and middleware behavior.

## Business Continuity Notes

XEN TradeHub’s value proposition depends on confidence and operational reliability. Maintain:

- consistent homepage brand quality,
- uninterrupted enquiry handling,
- predictable admin governance flows.

## Post-Release Validation

- Verify metadata rendering for social previews.
- Verify mobile responsiveness on marketing and admin pages.
- Confirm analytics and enquiries systems are populating new records.
