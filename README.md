# SKINAA — Skin, in motion

A responsive skincare storefront redesign built with Next.js and React. The experience includes an interactive product visualization, product discovery, category and concern pages, a routine builder, and a local demo bag.

## Stack

- **Next.js + React** — storefront pages, interactions, and local product catalogue.
- **Browser storage** — demo bag, saved routine, and skin journal, stored only on the visitor's device.

This assessment does not need a separate API or database: it does not process orders, payments, accounts, newsletter subscriptions, or cross-device data. The demo bag is not connected to Shopify checkout. A production Shopify integration should use Shopify's storefront and cart APIs for live product, inventory, and checkout data.

## Run locally

```bash
npm --prefix frontend install
npm run dev:frontend
```

Open `http://localhost:3000`. To create a production build, run:

```bash
npm run build
```

## Deploy to Vercel

1. Import this repository and set the project root directory to `frontend`.
2. Deploy with Vercel's detected Next.js build settings.

No backend URL, database credentials, or API environment variables are required.

## Assessment scope

The storefront demonstrates responsive product discovery, a 3D packaging concept, routine selection, an educational skin journal, and a local demo bag. The routine and journal are saved on this device only. Purchases, newsletter sign-ups, customer accounts, and Shopify checkout are not implemented.

## Design and validation notes

- [Design direction, visual references, homepage features, and conversion rationale](./docs/design-direction.md)
- [Performance, accessibility, responsive checks, and Shopify integration boundary](./docs/performance-accessibility.md)
