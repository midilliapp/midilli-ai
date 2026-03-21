# Midilli AI Deployment Notes

## What is already integrated

The following routes are already part of the app and are ready to deploy:

- `/price`
- `/terms`
- `/privacy`
- `/refund`

These are implemented in:

- `app/price/page.tsx`
- `app/terms/page.tsx`
- `app/privacy/page.tsx`
- `app/refund/page.tsx`

## Before deploying

Replace local demo values in `.env.local` with real production values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `FAL_KEY`

If your hosting provider uses dashboard-managed environment variables, add them there instead of committing secrets to the repo.

## Recommended deployment flow

1. Install dependencies:

```bash
npm install
```

2. Run a production build:

```bash
npm run build
```

3. Start locally to verify:

```bash
npm run start
```

4. Deploy to your hosting provider.

## Paddle URLs to use after deployment

Use these production URLs in Paddle:

- `https://midilli.app/price`
- `https://midilli.app/terms`
- `https://midilli.app/privacy`
- `https://midilli.app/refund`

## Important note

The current local `.env.local` in this workspace contains placeholder values only for local rendering and build validation. Replace them before using real auth, billing, or generation features in production.
