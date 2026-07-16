# A-YOS Supabase Cloud Setup

## 1. Install the database

1. Create a fresh Supabase project.
2. Open **SQL Editor** in the Supabase dashboard.
3. Copy the complete contents of `supabase/AYOS_CLOUD_INSTALL.sql` into a new query.
4. Run the query once. The installer refuses to overwrite an existing A-YOS schema and commits only when every statement succeeds.

The installer creates the application schema, RLS policies, private Storage buckets, Realtime publication entries, RPCs, grants, and the five current service categories. It does not create demo accounts.

## 2. Optional test accounts

For development or staging only, paste and run `supabase/AYOS_TEST_ACCOUNTS.sql` after the cloud installer. Never run the test-account script in production.

| Role | Email | Password | Initial state |
|---|---|---|---|
| Customer | `customer.demo@ayos.test` | `A-YosDemo123!` | Active, ID approved |
| Worker | `worker.demo@ayos.test` | `A-YosDemo123!` | Active, ID and application approved |
| Administrator | `admin.demo@ayos.test` | `A-YosDemo123!` | Active, admin role |

The script is repeatable. Running it again resets these fixed test accounts to their documented password, roles, active status, approved verification state, worker services, prices, address, and availability. It refuses to run if one of the demo emails belongs to an unexpected Auth user.

The identity paths are test markers only. They do not upload or represent real identity documents, so ID previews remain unavailable until test images are uploaded through the normal private Storage workflow.

## 3. Configure the Expo application

Copy the project URL and anonymous key from **Project Settings → API** into `.env.local`:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Point-to-point screens may additionally be enabled with the existing optional frontend flag:

```dotenv
EXPO_PUBLIC_FEATURE_POINT_TO_POINT=true
```

Never expose the service-role key, Gemini key, or OpenRouteService key through an `EXPO_PUBLIC_` variable.

## 4. Create the first admin

Register the admin account through the application or Supabase Authentication first. Then run the commented admin-promotion statement at the bottom of `supabase/AYOS_CLOUD_INSTALL.sql` after replacing `REPLACE_WITH_ADMIN_EMAIL`.

The account keeps its normal customer role and receives an additional admin role. The application will route an account with the admin role to the protected admin dashboard.

Skip this step in a development or staging project where `AYOS_TEST_ACCOUNTS.sql` created `admin.demo@ayos.test`.

## 5. Deploy Edge Functions

The SQL Editor cannot deploy Deno Edge Functions. From the repository root, install and authenticate the Supabase CLI, then run:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy analyze-service-request
supabase functions deploy translate-workflow-text
supabase functions deploy compute-route
```

Configure provider secrets server-side:

```bash
supabase secrets set \
  GEMINI_API_KEY=YOUR_GEMINI_KEY \
  GEMINI_MODEL=gemini-3.1-flash-lite \
  OPENROUTESERVICE_API_KEY=YOUR_OPENROUTESERVICE_KEY
```

Redeploy a function after changing its source. Secret changes are available to deployed functions without placing those values in the Expo bundle.

Until the three functions are deployed, the frontend calls for issue analysis, English–Filipino translation, and routing will fail. When the functions are deployed without provider keys, the current code returns its limited local analysis/translation fallbacks and straight-line route estimates.

## 6. Verify the installation

Run these checks from the repository root:

```bash
npm run typecheck
npm run build:web
supabase db lint --linked --schema public --level error --fail-on error
```

After registering test accounts, verify customer ID review, worker approval, request publication, recommendations, booking creation, cash confirmation, completion, review submission, private file access, and the admin dashboard before using the project with real users.
