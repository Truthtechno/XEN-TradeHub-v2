# XEN TradeHub

XEN TradeHub is an independent asset management service provider offering trading services on predefined strategies and agreed terms.

## Overview

This project contains the XEN TradeHub marketing website and user onboarding experience. The homepage highlights the core offering:

- Markets: Gold, Crypto, Forex, and Commodities
- Trusted broker partners: Exness, Equiti, and HFM
- Daily support, trading signals, and regulated partner access
- Secure sign-in and sign-up flow with Clerk

## Tech Stack

- Next.js
- Tailwind CSS
- shadcn/ui
- Magic UI
- Aceternity UI
- Prisma
- MongoDB
- Clerk
- React Hook Form

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in a `.env` file:
   ```
   # app
   NEXT_PUBLIC_APP_DOMAIN=
   NEXT_PUBLIC_APP_NAME=XEN TradeHub

   # clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   # database
   DATABASE_URL=
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License. See `LICENSE` for details.
