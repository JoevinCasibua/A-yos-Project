# UI Component Mapping

## Source references

| Interface     | Reference                                                               | Implementation target      | Adaptation rule                                                                                                                                                |
| ------------- | ----------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Administrator | `admin-webapp` at `f28b45dbbadf3b5fc4f4cecd240cb03da50f1d85`            | `apps/admin`               | Preserve the blue/navy visual system and interaction structure; replace Vite, React Router, mock data, and fake Auth with Next.js App Router and Supabase SSR. |
| User          | `newuserfrontend` at `f28b45dbbadf3b5fc4f4cecd240cb03da50f1d85`         | `apps/mobile/app/(user)`   | Preserve mobile layouts and flows; replace all static workers, bookings, OTPs, maps, payments, and messages with RLS-protected Supabase data.                  |
| Worker        | `workerfrontend-refactor` at `1bdce1cb4f2c7b8f30b29d0381c8fc6c61b16f0e` | `apps/mobile/app/(worker)` | Preserve dashboard, job, booking, timeline, review, and profile patterns; omit wallet, top-up, role switching, bidding, and user-side booking nodes.           |

## Administrator mapping

| Reference component/page                             | Target responsibility                                                 | Status                              |
| ---------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------- |
| `AdminLayout`, `AdminSidebar`, `AdminNavbar`         | Responsive authenticated shell and navigation                         | Adapted                             |
| `DashboardCard`, Dashboard                           | Live operational metrics and recent operational work                  | Adapted with live counts            |
| `Table`, `Pagination`, `Badge`, `Skeleton`           | Typed record lists with loading, empty, filter, and pagination states | Adapted                             |
| `Drawer`, `Modal`, `Button`, `Input`                 | Record details, confirmations, and validated commands                 | Adapted as forms/actions            |
| Users, Workers, Bookings, Payments, Reviews, Support | Role-appropriate data views and protected RPC actions                 | Connected to Supabase               |
| Notifications, Reports, Settings, Trash, Audit Logs  | Protected administration, exports, configuration, restore, and audit  | Connected to Supabase               |
| Analytics charts                                     | Real aggregates only                                                  | Live aggregate cards; no mock chart |

## Mobile shared mapping

| Reference pattern                       | Target component/behavior                                                                       | Status      |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------- |
| Screen, EmptyState, Button, TextInput   | Shared accessible primitives in `apps/mobile/src/components.tsx`                                | Extended    |
| Theme spacing, typography, radii, cards | Shared role-neutral design tokens                                                               | Adapted     |
| User tabs                               | Home, Browse, Bookings, Messages, Profile; request, alerts, AI, tracking as stack/detail routes | Implemented |
| Worker tabs                             | Dashboard, Job Posts, Bookings, Reviews, Profile; onboarding and tracking as detail routes      | Implemented |
| Map placeholders                        | MapLibre native/web renderers and private tracking data                                         | Replaced    |
| Static cards and timelines              | Live service requests, bookings, status events, payments, and reviews                           | Replaced    |

## Excluded prototype UI

- Wallet, payout, top-up, advertising, premium purchase, role switching, open bidding, non-cash payment actions, and worker-side Hire/Accept Worker/Worker Match nodes.
- Permanent-delete actions remain unavailable while the backend retention policy blocks deletion.
- Pricing, portfolio, login history, emergency contact, translation, and push controls remain absent until their persistence/provider contracts are verified.
