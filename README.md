# SKINAA — Skin, in motion

A full-stack, responsive skincare homepage redesign built for the required assessment stack. It is configured for a split deployment: **Next.js on Vercel** and **Express/MongoDB on Render**.

## Stack

- **`/frontend` — Next.js + React**: responsive homepage and product-discovery interactions, deployed on Vercel.
- **`/backend` — Node.js + Express**: API service, deployed on Render.
- **MongoDB + Mongoose**: persistent `Subscriber`, `Routine`, and `Product` models used by the Render API.

## Run locally

```bash
npm --prefix frontend install
cp frontend/.env.example frontend/.env.local
npm --prefix backend install
cp backend/.env.example backend/.env
# Add MONGODB_URI to backend/.env when persistence is needed.
npm run dev:frontend
# In a second terminal:
npm --prefix backend run dev
```

Open `http://localhost:3000`. The frontend calls `http://localhost:4000` by default.

Without a MongoDB connection string, the API deliberately stays usable in preview mode: the catalogue falls back to local fixture data and save endpoints return a `202` preview response. With `MONGODB_URI` configured, routines and subscriber records are persisted through Mongoose.

## API

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Confirms the full stack and Mongo connection state. |
| `GET /api/catalogue` | Reads products from MongoDB or the local preview catalogue. |
| `POST /api/routines` | Saves a selected AM/PM routine. |
| `POST /api/subscribers` | Saves newsletter sign-ups. |

## Deploy frontend to Vercel

1. Import this repository in Vercel. Set the root directory to `frontend`.
2. Vercel detects Next.js from [vercel.json](./frontend/vercel.json). Its build command is `npm run build` and output directory uses the framework default.
3. After the Render API exists, set `NEXT_PUBLIC_API_URL` in Vercel to its public URL, for example `https://skinaa-api.onrender.com`.
4. Apply that variable to Production and Preview, then redeploy Vercel. `NEXT_PUBLIC_` values are compiled into the browser bundle during the build.

## Deploy backend to Render

1. Create a Render Blueprint from this repository. [render.yaml](./render.yaml) creates a Node web service with `backend` as its root directory.
2. Set `MONGODB_URI` to your MongoDB Atlas connection string.
3. After Vercel creates the frontend URL, set `FRONTEND_ORIGIN` in Render to that exact URL (for example, `https://skinaa.vercel.app`). This controls CORS.
4. Deploy the service. Render will run `npm ci` and `npm start` inside `backend/`; its health probe is `/api/health`.

For a production change, update Render’s `FRONTEND_ORIGIN` first, then update Vercel’s `NEXT_PUBLIC_API_URL` and redeploy the Vercel project. This avoids allowing arbitrary origins or exposing database credentials to the browser.
