# Project Structure

```text
A-YOS/
├── apps/
│   ├── mobile/                 Expo User/Worker application, MapLibre views, and Supabase repositories
│   └── admin/                  Next.js administrator dashboard and SSR Auth boundary
├── packages/
│   ├── contracts/              Shared validation, enums, errors, and event payloads
│   ├── domain/                 Pure booking, matching, payment, and review rules
│   ├── supabase/               Generated database types, Storage paths, Realtime topics
│   ├── config/                 Public/provider configuration validation
│   ├── observability/          Redaction and structured-log helpers
│   └── test-utils/             Shared test builders
├── supabase/
│   ├── config.toml             Local Auth, Storage, Realtime, and Edge settings
│   ├── migrations/             Authoritative schema, RPC, RLS, Storage, queue migrations
│   ├── functions/              AI chain, maps, report, auth, provider, and queue functions
│   ├── tests/database/         pgTAP security and invariant tests
│   └── seed.sql                Development-only content and categories
├── tests/                      Platform, security, traceability, and E2E suites
├── playwright.config.ts        Admin and Expo web executable browser smoke configuration
├── scripts/                    Bootstrap, traceability, local Supabase, stack, and CI Shell tooling
├── infra/admin.Dockerfile      Optional administrator container build
└── required Markdown files    Synchronized project documentation
```

## Responsibilities and dependencies

- Supabase SQL migrations are the only schema authority. Every exposed table enables RLS.
- Expo and Next.js depend on `@supabase/supabase-js`, shared contracts, and generated database types; neither receives the secret key.
- Next.js uses `@supabase/ssr` cookie sessions and repeats administrator/AAL checks in Server Components and Route Handlers. Proxy refresh is not the sole authorization gate.
- Atomic business changes use RPC functions. Edge Functions are limited to credentials, providers, reports, mobile-identifier sign-in, and job consumption.
- PGMQ/Cron replaces external Redis workers. Private Broadcast topics replace Socket.IO.

## Conventions

- Database identifiers use unquoted `snake_case`; TypeScript uses `camelCase`; shared enums retain canonical uppercase values.
- Storage paths start with the authenticated account UUID. Application buckets are private.
- Realtime topics use `booking:<id>:status`, `booking:<id>:location`, `conversation:<id>:messages`, and `user:<id>:notifications`.
- Sensitive RPCs use fixed search paths, transactions, role/ownership checks, idempotency, and stable domain errors.
- `packages/supabase/src/database.generated.ts` is regenerated after every migration and checked in CI.

## Requirement mapping

- Identity: Auth configuration, account provisioning trigger, Expo session provider, Next.js SSR Auth, TOTP routes.
- Worker/discovery: worker tables, verification RPCs, availability/skill policies, deterministic matching RPC.
- Booking/payment/review: transactional domain RPC migration plus pure-domain tests.
- Communication/location: PostGIS RPCs and GiST indexes, MapLibre native/web views, participant RLS, private Storage, and private Realtime Broadcast.
- Administration: AAL2 admin RPCs, audit tables, dashboard server queries, report Edge Function.
- Provider workflows: OpenAI/Gemini/OpenRouter analysis chain, map-gateway boundary, fail-closed Edge Functions, and PGMQ consumers.
