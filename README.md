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

All styling uses centralized design tokens in `constants/theme.ts`. The project aligns to an iPhone 15 (393×852 dp) baseline and includes tokens for spacing, type, radii, and shadows.

- **Design Target**: iPhone 15 / iPhone 15 Pro — 393 × 852 dp
- **Safe Area**: Top = 59px, Bottom = 34px (use `react-native-safe-area-context`)
- **Layout tokens**: `Layout.screenPadding` = 20, `Layout.sectionSpacing` = 24, `Layout.cardPadding` = 16
- **Spacing**: 4px step scale with named keys (see `Spacing` in `constants/theme.ts`)
- **Typography**: `Display`/`H1`/`H2`/`H3`/`Title`/`Section`/`Card`/`Body`/`Small`/`Caption` tokens
- **Radius**: `xs`=8, `sm`=10, `md`=12, `lg`=14, `xl`=16, `xxl`=20
- **Buttons**: height 56, radius 14, horizontal padding 20 (`ButtonSize` tokens)
- **Avatar sizes**: small 40, medium 48, large 64, xl 96
- **Navigation**: nav height 80, header height 56
- **Shadows**: card & floating elevation presets in `Elevation`

Colors have been refined for balance and accessibility. Key color tokens (in `constants/theme.ts`):

- **Primary / CTA**: `#0B63D6` (brand blue)
- **Primary Light**: `#4DA5FF`
- **Success**: `#117A5C`
- **Warning**: `#F59E0B`
- **Error**: `#C53030`
- **Info**: `#0B63D6`
- **Background**: `#F7F9FC`
- **Surface / Card**: `#FFFFFF`
- **Border**: `#E6EBF6`

Use these tokens rather than hard-coded colors to maintain consistency and ensure complementary palettes across screens.

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
