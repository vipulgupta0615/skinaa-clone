# SKINAA — Skin, in motion

A full-stack, responsive skincare homepage redesign built for the required assessment stack.

## Stack

- **Next.js + React**: responsive homepage and all product-discovery interactions.
- **Node.js + Express**: one application server that serves Next in development and exposes JSON APIs.
- **MongoDB + Mongoose**: persistent `Subscriber`, `Routine`, and `Product` models.

## Run locally

```bash
npm install
cp .env.example .env
# Add MONGODB_URI to .env when persistence is needed.
npm run dev
```

Open `http://localhost:3000`.

Without a MongoDB connection string, the API deliberately stays usable in preview mode: the catalogue falls back to local fixture data and save endpoints return a `202` preview response. With `MONGODB_URI` configured, routines and subscriber records are persisted through Mongoose.

## API

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Confirms the full stack and Mongo connection state. |
| `GET /api/catalogue` | Reads products from MongoDB or the local preview catalogue. |
| `POST /api/routines` | Saves a selected AM/PM routine. |
| `POST /api/subscribers` | Saves newsletter sign-ups. |

## Production UI build

```bash
npm run build
npm start
```

`next build` creates a static `out/` export for the private design preview. The Express/Mongo service is intentionally included as a Node deployment target; configure `MONGODB_URI` and run `npm start` in a Node-capable environment to enable persistence in production.
