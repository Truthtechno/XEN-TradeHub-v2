# XEN TradeHub Documentation

XEN TradeHub is an independent asset management service provider delivering structured trading services built on predefined strategies and agreed operational terms.

This documentation hub is designed for internal engineering, operations, and deployment teams.

## Brand Snapshot

- **Core positioning:** Trade smarter with structured support.
- **Primary markets:** Gold, Crypto, Forex, Commodities.
- **Operating model:** Client retains control of their broker account; strategy support and execution guidance are provided by XEN TradeHub.
- **Platform areas:** Marketing website, admin portal, enquiries pipeline, analytics dashboards.

## Homepage Visual Reference

The homepage hero used across product and brand communications:

![XEN TradeHub Homepage Hero](../assets/Screenshot_2026-04-10_at_6.22.26_AM-1f134938-e6b4-47a2-9841-71265f4674bf.png)

Backup local reference:

![XEN TradeHub Homepage Hero (Attached)](/Users/brianamooti/.cursor/projects/Users-brianamooti-BRYAN-PROJECTS-linkify-main/assets/Screenshot_2026-04-10_at_6.22.26_AM-1f134938-e6b4-47a2-9841-71265f4674bf.png)

> If your environment does not resolve either path, copy the screenshot into `docs/images/homepage-hero.png` and update the first image path accordingly.

## Documentation Index

- [Development Guide](./DEVELOPMENT.md)
- [Production Operations Guide](./PRODUCTION.md)

## Technology Footprint

- Next.js 14 (App Router)
- TypeScript + React 18
- Tailwind CSS + shadcn/ui
- Prisma ORM
- Clerk authentication
- API routes for admin and marketing workflows

## Governance Notes

- Admin experiences are built for operational scalability (enquiries triage, broker ordering, user governance).
- Documentation and process updates should be reviewed when APIs, middleware, or auth policies change.
