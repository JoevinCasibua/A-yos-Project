# Project Inspection

## Source inspection

- `SRS.docx` rendered as 25 pages and contains FR-01–FR-104 and NFR-01–NFR-18.
- `AI workflow.docx` rendered as three pages; administrator, user, and worker workflow images were inspected.
- `requirements/catalog.json` preserves all 122 canonical requirements.

## Approved architecture decisions

- Supabase PostgreSQL, Auth, Data APIs, Storage, Realtime, Queues, Cron, Vault, and Edge Functions replace the prior NestJS/Prisma/Redis platform.
- Clients access authorized data directly; sensitive writes use transactional RPC functions.
- Supabase SQL migrations are the only schema authority.
- Administrator authenticator-app TOTP replaces administrator email 2FA.
- Expo uses SecureStore-backed Supabase sessions; Next.js uses SSR cookies.
- AI uses OpenAI directly, Gemini, and OpenRouter in that order; only retryable failures fall through. Maps use PostGIS/MapLibre with a configurable, fail-closed route/geocoding gateway.
- Cash only, protected bootstrap administrator, single immutable roles, blocked permanent deletion, excluded worker fees/advertising, and administrator recommendation priority remain approved.

## Missing information and blockers

- Production credentials, quotas, callback contracts, and acceptance environments for OpenAI, Gemini, OpenRouter, the map gateway/style, translation, push, and production email delivery.
- Final legal/business content, retention/deletion policy, performance thresholds, browser/device matrix, production project topology, RPO, and RTO.
- The repository is linked to hosted project `qsurouiyvisykjkgjqmz` (`A-yos`). The secure administrator-bootstrap patch was explicitly approved, applied, and verified there without deleting existing data. A future clean cutover or destructive replacement still requires a backup and migration decision.
- For these items: **Insufficient data to verify.**

## Security controls and risks

| Risk                                     | Control/status                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Direct client data bypass                | Every public table enables RLS; sensitive tables lack direct mutation grants; commands use RPCs.       |
| User creates Administrator               | Provisioning accepts Administrator only from service-controlled app metadata; negative probe executed. |
| Stale or insufficient admin assurance    | Server layouts, Route Handlers, RLS helpers, and sensitive RPCs check role/status/AAL.                 |
| Cross-booking messages/location/payment  | Booking-party RPC/RLS, geography tables, and conversation-membership policies protect private data.    |
| Public files or channels                 | Six private buckets and private Realtime policies; deployment must also disable public channels.       |
| Duplicate/concurrent workflow commands   | Unique constraints, idempotency keys, row locks, and optimistic booking versions.                      |
| Provider adapter mistaken for production | Stable fail-closed errors are returned without secrets; live-provider status remains unverified.       |
| Permanent deletion                       | RPC always fails closed and audits authorized attempts.                                                |

## Verified defects and corrections

| Issue                                                             | Severity | Root cause                                                                              | Correction                                                                                                             | Validation                                                        | Status           |
| ----------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------- |
| Realtime trigger accessed fields absent from the active table     | High     | One CASE expression referenced all possible record shapes                               | Use table-specific conditional branches and only `NEW` for insert/update triggers                                      | PostgreSQL workflow execution                                     | Resolved         |
| RPC parameters conflicted with column names                       | High     | PostgreSQL could not resolve names in matching/payment/review statements                | Rename conflicting parameters/variables and update client RPC payloads                                                 | Complete SQL workflow execution                                   | Resolved         |
| User metadata could request Administrator                         | Critical | Provisioning allowed `ADMIN` after enum parsing regardless of metadata source           | Require service-controlled app metadata for Administrator                                                              | Negative self-registration probe                                  | Resolved         |
| Worker could attempt approval-field updates                       | Critical | Whole-table update grant was broader than RLS intent                                    | Replace with column-level grants and approval-aware RLS                                                                | SQL grant inspection                                              | Resolved         |
| Admin session previously trusted proxy presence                   | High     | Proxy cookie existence was the primary boundary                                         | Revalidate Supabase user, role, status, and AAL in Server Components and handlers                                      | Type/lint inspection; hosted Auth E2E pending                     | Resolved         |
| Protected admin bootstrap required published Terms                | High     | The Auth trigger applied public-registration prerequisites to service bootstrap         | Exempt only service-controlled Administrator provisioning from the Terms gate                                          | PostgreSQL bootstrap/registration probe                           | Resolved         |
| Auth rejected Administrator creation before applying app metadata | Critical | The provisioning trigger depended on `raw_app_meta_data` during the initial Auth insert | Authorize provisioning with a hashed, expiring, single-use bootstrap ticket and remove the raw token after use         | 28 pgTAP bootstrap tests; local and hosted bootstrap/login probes | Resolved         |
| Disabled Remember Me could leave an older persisted session       | High     | Switching to volatile storage did not remove the prior SecureStore record               | Delete the Supabase Auth storage key whenever persistence is disabled                                                  | Strict client type check; device E2E pending                      | Resolved         |
| PostgreSQL implicitly granted RPC execution to `PUBLIC`           | Critical | New functions inherit PostgreSQL's default function privilege                           | Revoke schema-wide anonymous/public execution and retain explicit role grants                                          | Routine privilege query                                           | Resolved         |
| Selected workers could not download committed request media       | High     | Storage read policy covered owners, administrators, and conversation media only         | Add request/review relationship checks to the private Storage policy                                                   | Clean migration replay                                            | Resolved         |
| Edge MFA assurance data was treated as non-null                   | Medium   | Supabase client can return a null assurance payload on error                            | Fail closed on MFA API error or missing/non-AAL2 assurance                                                             | Deno check for all five functions                                 | Resolved         |
| Application account became active before email verification       | Critical | Auth rejected sessions, but the application row was immediately `ACTIVE`                | Keep User/Worker rows pending until the Auth email-confirmation trigger runs                                           | Pending-to-active PostgreSQL probe                                | Resolved         |
| Queue work could be archived after a failed Supabase mutation     | High     | Consumer did not inspect errors returned in mutation result objects                     | Check every result, deduplicate effects, retry failures, and archive only success                                      | Deno check and clean schema replay                                | Resolved         |
| CSV exports could preserve spreadsheet formula prefixes           | Medium   | Quoting alone does not neutralize formula interpretation                                | Prefix formula-leading cell values before CSV quoting                                                                  | Deno check                                                        | Resolved         |
| Numeric coordinates were the location authority                   | High     | Matching and tracking lacked PostGIS radius/index semantics                             | Use geography points, generated projections, GiST indexes, `ST_DWithin` and `ST_Distance`                              | Static security checks; local pgTAP blocked                       | Resolved in code |
| AI analysis endpoint always returned unavailable                  | High     | Only a fail-closed placeholder existed                                                  | Implement private media, transcription, three-provider chain, strict output validation, idempotency, and attempt audit | Deno check and two provider-chain tests                           | Resolved in code |
| Native and web clients had no map renderer                        | High     | MapLibre dependencies and platform implementations were absent                          | Add MapLibre GL JS/React Native, Expo plugin, typed GeoJSON view, and tracking screen                                  | Expo web and Android bundle exports                               | Resolved         |
| Migrations changed privileged PL/pgSQL setting                    | High     | Three migrations used a server-level `plpgsql.variable_conflict` assignment             | Remove the unnecessary assignment and use unambiguous parameter naming                                                 | Two clean Supabase database resets                                | Resolved         |
| Three RPCs retained ambiguous parameter/column names              | High     | Cancellation, support resolution, and refund SQL reused column names as arguments       | Rename parameters, qualify columns, use the named constraint, and update typed client payloads                         | SQL lint, clean reset, pgTAP, generated types                     | Resolved         |
| Default local database port was reserved by Docker                | Medium   | Colima's port allocator rejected `54322` despite no visible host listener               | Move only the A-yos local database port to `54332`                                                                     | Local stack health and two clean resets                           | Resolved         |
| Local analytics could not mount the Colima Docker socket          | Medium   | Optional collector attempted an unsupported host-socket mount                           | Disable optional unauthenticated local analytics; application logging remains unchanged                                | Local stack health check                                          | Resolved         |
| Expo web invoked the native SecureStore module                    | High     | A shared Supabase Auth adapter imported `expo-secure-store` on every platform           | Split platform adapters; use browser storage on web and SecureStore on native                                          | Adapter tests, fresh exports, browser reload                      | Resolved         |

## Executed validation

- ESLint and strict TypeScript passed for all 11 workspace packages.
- Twenty-three Vitest tests passed across contracts, domain logic, configuration, observability, Supabase helpers, security, platform contracts, and traceability.
- Deno strict checking passed for all six Edge Functions; two isolated provider-chain tests verified retryable OpenAI-to-Gemini fallback and permanent-error termination.
- Next.js 16 production build, Expo web export with MapLibre CSS/bundle, and Expo Android JavaScript export with the native MapLibre module passed.
- Stack/source-secret verification passed, and the traceability gate confirmed FR-01–FR-104 and NFR-01–NFR-18.
- Colima and the complete local Supabase stack started successfully. Two clean resets applied all five migrations and the seed deterministically.
- Database lint found no application-schema errors after corrections. Six remaining lint reports originate in Supabase's installed `extensions` schema (PostGIS helper functions), not project functions.
- All 26 pgTAP assertions passed, covering PostGIS, geography fields/indexes, geospatial RPC presence, AI persistence, RLS, and invariants.
- Supabase generated database types from the validated local schema; strict TypeScript passed after client repositories adopted those generated RPC names and argument types.
- The repository is safely linked to the hosted `A-yos` project, and mobile/admin ignored environment files contain only the hosted URL and publishable key.
- Live AI, transcription, map gateway, tile, Auth, Storage, Realtime, and queue-provider calls were not executed because credentials/services are unavailable. **Insufficient data to verify.**

## Current status

The requested TypeScript/Supabase/PostGIS/MapLibre/AI implementation is present and passes local database replay, pgTAP, static, unit, provider-adapter, web, administrator, and Android bundle gates. The secure administrator bootstrap is deployed and login-verified on the hosted project; broader hosted migration replacement was not performed. Live providers, native binary builds, and cross-application E2E remain unverified. The project is not declared production-complete.
