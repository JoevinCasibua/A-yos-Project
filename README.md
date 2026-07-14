# A-yos — Provider Marketplace App

A mobile-first service provider marketplace built with React Native, Expo, and TypeScript. Users can browse service categories, view provider profiles, book appointments, pay securely, track live service status, and leave reviews.

> [!NOTE]
> This project is currently under development

## Tech Stack

- **React Native** (Expo SDK 54)
- **TypeScript**
- **Expo Router** (file-based navigation)
- **Lucide Icons** (expo vector icons)
- **React Native Reanimated** & **Gesture Handler**
- **Supabase** (database & auth ready)

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Expo dev server |
| `npm run build:web` | Export web build to `dist/` |
| `npm run typecheck` | Run TypeScript type check |
| `npm run lint` | Run Expo linter |

## Project Structure

```
app/
├── _layout.tsx              # Root layout (Stack)
├── (tabs)/
│   ├── _layout.tsx          # Bottom tab navigation
│   ├── index.tsx            # Home screen
│   ├── search.tsx           # Browse/search providers
│   ├── bookings.tsx         # My bookings list
│   ├── reviews.tsx          # Reviews feed
│   └── profile.tsx          # User profile
├── provider/[id].tsx        # Provider profile detail
├── booking/[id].tsx         # Schedule booking flow
├── payment.tsx              # Payment screen (modal)
├── tracking/[id].tsx        # Live tracking screen
└── review/[id].tsx          # Rate & review (modal)

components/
├── AppText.tsx              # Typography component
├── AppButton.tsx            # Button (primary/outline/ghost/danger)
├── AppCard.tsx              # Card wrapper
├── AppInput.tsx             # Text input with label/error
├── Avatar.tsx               # Profile image
├── Badge.tsx                # Status/verified badges
├── Chip.tsx                 # Filter chips
├── RatingStars.tsx          # Star rating display
├── SearchBar.tsx            # Search input
├── SectionHeader.tsx        # Section title + action
├── ProviderCard.tsx         # Provider list item
└── ServiceCategoryCard.tsx  # Category grid icon card

constants/
├── theme.ts                 # Design tokens (colors, spacing, radius, elevation)
└── mockData.ts              # Mock providers, reviews, bookings, time slots

hooks/
└── useFrameworkReady.ts     # Expo framework init (required)
```

## Design System

All styling uses centralized design tokens from `constants/theme.ts`:

- **Colors**: Primary greens, status colors (success/warning/error/info), neutral text & surface colors
- **Typography**: 6 font size variants (h1–h4, body, caption) with 4 weights
- **Spacing**: 8px-based scale (0–16)
- **Radius**: xs through full
- **Elevation**: 4 shadow levels (sm/md/lg/xl)

## Navigation

- **5 tabs**: Home, Browse, Bookings, Reviews, Profile
- **Stack screens**: Provider profile, Booking flow, Live tracking
- **Modals**: Payment, Rate & Review

## Screens

1. **Home** — Welcome header, search, category carousel, promo banner, top-rated providers, recently viewed
2. **Browse** — Search bar, filter chips, sort options, provider list with live filtering
3. **Provider Profile** — Cover image, avatar, stats, about, services, reviews preview, contact, book CTA
4. **Schedule Booking** — Date picker, time slots, address input, notes, price summary
5. **Payment** — Payment method selection, promo code, order summary, secure CTA
6. **Live Tracking** — Map background, provider pin, ETA, 5-step tracking timeline, call/message actions
7. **My Bookings** — Tab-filtered list (upcoming/completed/cancelled) with contextual actions
8. **Reviews** — Rating summary with distribution chart, filterable review list, review submission modal

## Platform

Default platform is **Web**. Native-only APIs use `Platform.select()` for web compatibility.
