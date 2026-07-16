# A-yos MVP

A-yos is an Expo customer/worker marketplace backed by Supabase Auth, PostgreSQL/PostGIS, private Storage, Realtime, and Edge Functions. The existing customer and worker visual design is preserved. A separate Expo web admin dashboard is available at `/admin`.

## Local setup

Requirements: Node.js, Docker Desktop, Supabase CLI, and an Expo development-build toolchain for native MapLibre testing.

```bash
npm install
npm run db:start
npm run db:reset
npm run db:types
cp .env.example .env.local
npm run dev
```

The checked-in `.env.example` uses the standard local Supabase URL and anonymous key. Never place the service-role key, `GEMINI_API_KEY`, or `OPENROUTESERVICE_API_KEY` in an Expo environment variable.

If the CLI reports slow local service health checks on Docker Desktop, use `npm run db:start`; it preserves the containers and lets their health checks finish in the background. Confirm the API, Storage, Realtime, Functions, and Studio URLs with `supabase status`.

## Demo accounts

All local demo passwords are `A-YosDemo123!`.

| Role | Email | Local state |
|---|---|---|
| Approved customer | `customer.demo@ayos.test` | Active, ID approved |
| Pending customer | `customer.pending@ayos.test` | Active, ID pending |
| Approved worker | `worker.demo@ayos.test` | ID and application approved |
| Pending worker | `worker.pending@ayos.test` | ID and application pending |
| Administrator | `admin.demo@ayos.test` | Admin role |

Seed accounts exist only after a local reset and must never be copied to production.

## Server secrets and Edge Functions

Set optional provider secrets locally:

```bash
supabase secrets set GEMINI_API_KEY=your_key GEMINI_MODEL=gemini-3.1-flash-lite
supabase secrets set OPENROUTESERVICE_API_KEY=your_key
```

AI analysis and English–Filipino translation return clearly labeled deterministic fallback output if Gemini is unavailable. Routing returns a labeled straight-line estimate if OpenRouteService is unavailable. Identity documents are never sent to Gemini.

For a hosted project, link the CLI, apply migrations, set function secrets, deploy the three functions, and copy only the hosted project URL and anonymous/publishable key into `.env.local`:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase functions deploy analyze-service-request
supabase functions deploy translate-workflow-text
supabase functions deploy compute-route
```

## Verification

```bash
npm run typecheck
npm run lint
npm run build:web
npm run db:test
supabase db lint
```

Native maps use `@maplibre/maplibre-react-native` and require an Expo custom development build. Web uses `maplibre-gl`. Both use OpenFreeMap Liberty with provider attribution. Expo Location captures customer coordinates and one consented worker snapshot when a booking enters `en_route`; it does not continuously track workers.

## MVP boundaries

Cash is the only persisted payment method. Open Bidding, negotiation, chat messages, GCash, and card payments remain visible previews and return `FEATURE_LOCKED`; no tables or fake local success paths exist for them. Customer accounts are active immediately, while ID verification begins as `pending`. Publishing requests and creating bookings require an approved ID.
