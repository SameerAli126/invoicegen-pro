# One Command Start

This repo supports a single command to run the backend and Next.js frontend together.

## Prereqs (one-time)
1) Create `backend/.env` from `backend/.env.example` and set `MONGODB_URI` and `JWT_SECRET`.
2) Create `frontend-nextjs/.env.local` with:
   `NEXT_PUBLIC_API_URL=http://localhost:5001/api`
3) Install root dev tools (one-time):
   `npm install`

## Run everything
From the repo root:
```
npm run dev
```

This starts:
- Backend: `http://localhost:5001`
- Frontend: `http://localhost:3000`

## Run backend + Tailscale Funnel (public URL)
From the repo root:
```
npm run dev:backend:funnel
```

This starts the backend and publishes it via Tailscale Funnel at:
`https://<your-device>.ts.net/`

Append `/api` for the frontend, for example:
`https://<your-device>.ts.net/api`

Make sure the Tailscale client is running and logged in before you start.

## Stop
Press `Ctrl+C` in the terminal running `npm run dev`.
