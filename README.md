# A-YOS

A-YOS is a local service-matching and booking platform with one Expo application for separate User and Worker accounts and a Next.js administrator dashboard. Supabase provides PostgreSQL, Auth, Data APIs, Storage, Realtime, Queues, Cron, Vault, and Edge Functions.

## Main features

- Supabase email/password authentication, email OTP verification and recovery, persistent mobile sessions, and administrator TOTP MFA.
- Immutable single-role accounts, worker verification, categories, availability, matching, booking lifecycle, cash confirmation, receipts, reviews, support, reports, audit, Trash, and Restore.
- Direct RLS-protected reads and low-risk updates; sensitive workflow changes use transactional security-definer RPC functions.
- Private media buckets, signed access, private Realtime channels, PGMQ jobs, and scheduled queue consumption.
- Fail-closed Edge Function boundaries for AI, maps, speech, translation, and push providers.

## Technology used

| Layer                  | Technology and current version                                                                       | Use in A-YOS                                                                                                                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Languages              | TypeScript 5.9.3, JavaScript, Shell, PL/pgSQL                                                        | TypeScript is the application language; JavaScript is limited to ecosystem configuration; guarded Shell scripts orchestrate local/CI work; PL/pgSQL implements RLS helpers, triggers, queues, geospatial queries, and transactional RPCs. |
| User/Worker frontend   | Expo 57.0.7, Expo Router 57.0.7, React 19.2, React Native 0.86, React Native Web 0.21                | Android, iOS, and web route groups for single-role User and Worker accounts.                                                                                                                                                              |
| Administrator frontend | Next.js 16.2.10, React 19.2, `@supabase/ssr` 0.8                                                     | Server-rendered administrator dashboard, secure cookie refresh, role/status checks, and TOTP/AAL2 routes.                                                                                                                                 |
| Maps                   | MapLibre GL JS 5.24, MapLibre React Native 11.3, PostGIS                                             | Platform-specific map rendering, GeoJSON contracts, nearby-worker filtering, distance ordering, private live tracking, and provider-backed route/ETA requests.                                                                            |
| Backend                | Supabase PostgreSQL 17/PostGIS, Auth, Data API, Storage, Realtime, Edge Functions, PGMQ, Cron, Vault | The sole backend and schema authority; no NestJS, Prisma, Redis, Socket.IO, MinIO, or custom token runtime is required.                                                                                                                   |
| Client API             | `@supabase/supabase-js` 2.110, `@supabase/ssr` 0.8                                                   | Direct RLS-protected access, Auth, RPC, Storage, Realtime, Edge Functions, and administrator SSR.                                                                                                                                         |
| AI                     | OpenAI Responses and Transcriptions, Gemini structured output, OpenRouter chat completions           | OpenAI is primary, Gemini is the retryable-failure fallback, and OpenRouter is the final route. Provider responses share one validated result contract.                                                                                   |
| Tooling                | pnpm 11.9, Turborepo 2.5, ESLint 9.38, Prettier 3.6, Supabase CLI 2.109, Docker                      | Workspace builds, static checks, local Supabase, deterministic migrations, generated database types, and CI.                                                                                                                              |

## Prerequisites

- Node.js 22.23 or newer and pnpm 11.9
- Docker Desktop or a running Docker-compatible daemon
- Supabase CLI dependencies installed by `pnpm install`
- Android Studio or Xcode only for native simulator builds

## Local setup

```bash
cp .env.example .env
pnpm install
pnpm supabase:start
pnpm db:reset
pnpm db:types
pnpm admin:bootstrap
pnpm dev
```

Copy the local URL, publishable key, and secret key printed by `supabase start` into `.env`. Never place `SUPABASE_SECRET_KEY` in a `NEXT_PUBLIC_*` or `EXPO_PUBLIC_*` variable.

`pnpm admin:bootstrap` loads `.env.local` when present. It prepares a hashed, ten-minute, single-use database ticket, creates the Auth identity, provisions the protected Administrator account, removes the raw ticket from Auth metadata, and verifies the final records. Creating an Administrator directly in the Supabase Dashboard is intentionally rejected.

Local endpoints use Supabase API `http://127.0.0.1:54321`, database port `54332`, Studio `http://127.0.0.1:54323`, Mailpit `http://127.0.0.1:54324`, admin `http://localhost:3000`, and the Expo URL printed by its development server. Optional local Supabase analytics is disabled because it is not required by the application and its Docker-socket collector is incompatible with the configured Colima mount.

The seed contains development-only legal content and categories. Replace all legal/business content before production.

## Validation

```bash
pnpm db:reset
pnpm db:lint
pnpm test:db
pnpm db:types
pnpm traceability:check
pnpm functions:check
pnpm functions:test
pnpm verify:stack
pnpm verify
```

`db:reset`, database tests, type generation, and local Edge Function execution require the Supabase Docker stack.

## Staging and production

Use separate Supabase projects. Link the target project, inspect migration differences, apply migrations, set Edge Function secrets, deploy functions, configure Auth email templates and redirect URLs, bootstrap the protected administrator, and then deploy the clients. For an existing A-YOS schema that predates the secure bootstrap migration, apply `supabase/sql-editor-admin-bootstrap-fix.sql` once before running the bootstrap command. Store queue invocation values in Vault as `project_url` and `queue_consumer_secret`.

The currently linked hosted `A-yos` project has pre-existing migrations and Auth users. Do not repair its migration history, push this clean-cutover schema, or delete existing accounts without an approved backup and migration/replacement decision.

Configure `OPENAI_API_KEY`, `GEMINI_API_KEY`, and `OPENROUTER_API_KEY` only as Supabase Edge Function secrets. The model defaults are environment-configurable. Configure `EXPO_PUBLIC_MAP_STYLE_URL` only with a style URL/token intended for public clients; map gateway keys remain Edge Function secrets. Missing bindings return stable fail-closed errors.

## Troubleshooting and limitations

- **Supabase will not start:** start Docker Desktop/Colima and rerun `pnpm supabase:start`.
- **Registration unavailable:** publish Terms; the account-provisioning trigger fails closed without them.
- **OTP not received:** inspect local Mailpit or configure hosted Supabase SMTP and email templates.
- **Administrator rejected:** apply the secure bootstrap migration and run `pnpm admin:bootstrap`; Dashboard creation and self-registration as Administrator are prohibited.
- **Administrator command requires MFA:** complete authenticator-app enrollment and use an AAL2 session.
- **Provider unavailable:** configure the corresponding Edge Function provider and secret.
- **Map not rendered:** configure `EXPO_PUBLIC_MAP_STYLE_URL`; this value must be safe for a public client bundle.
- **Database tests unavailable:** start Docker Desktop or Colima before running the local Supabase reset and pgTAP suite.
- Production vendors, legal content, retention rules, performance thresholds, browser/device support, RPO, and RTO remain unspecified. **Insufficient data to verify.**

See [REQUIREMENTS.md](./REQUIREMENTS.md) and [PROJECT_INSPECTION.md](./PROJECT_INSPECTION.md) for requirement-level evidence.
