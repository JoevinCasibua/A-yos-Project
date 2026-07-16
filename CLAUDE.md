# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Getting Started

### Prerequisites
- Node.js (>=18)
- npm or yarn
- Expo CLI (installed via npm)
- Expo Go app on mobile device for testing

### Setup
```bash
npm install
```

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Expo development server |
| `npm run build:web` | Export web build to `dist/` directory |
| `npm run lint` | Run Expo linter (ESLint) |
| `npm run typecheck` | Run TypeScript type checking |
| `npm install <package>` | Install new npm package |

### Running Tests
This project doesn't currently have configured test scripts. To run tests:
- Manual testing via Expo Go app on device/emulator
- Manual testing via web browser at `http://localhost:19006`

## 🏗️ Project Architecture

### High-Level Structure
This is a React Native mobile application built with Expo SDK 54, TypeScript, and Supabase for backend services. The app follows a file-based routing pattern using Expo Router.

```
src/
├── app/                    # Expo Router pages and layouts
│   ├── (tabs)/            # Bottom tab navigation (Home, Browse, Bookings, Profile)
│   ├── provider/[id].tsx  # Provider profile screen
│   ├── new-request/       # Service request creation flow
│   ├── booking/[id].tsx   # Booking details screen
│   ├── tracking/[id].tsx  # Live service tracking
│   ├── review/[id].tsx    # Review submission
│   └── _layout.tsx        # Root layout (auth providers, navigation)
├── components/            # Reusable UI components
│   ├── AppText.tsx        # Typography component
│   ├── AppButton.tsx      # Button component
│   ├── AppCard.tsx        # Card container
│   ├── ProviderCard.tsx   # Provider list item
│   └── ServiceCategoryCard.tsx # Category grid item
├── constants/             # Design tokens and constants
│   ├── theme.ts           # Design system (colors, spacing, typography)
│   └── mockData.ts        # Mock data for development
├── context/               # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── RequestContext.tsx # Request state management
├── hooks/                 # Custom React hooks
│   └── useFrameworkReady.ts # Expo initialization
├── lib/                   # Utility libraries
│   └── supabase.ts        # Supabase client configuration
├── services/              # API service layer
│   ├── api.ts             # Supabase data fetching functions
│   ├── auth.ts            # Authentication helpers
│   └── contracts.ts       # TypeScript interfaces for API responses
└── supabase/              # Supabase migration and edge function files
```

### Key Architectural Patterns

#### 1. File-Based Routing (Expo Router)
- Uses `expo-router` for file-based routing similar to Next.js
- Routes are defined by file structure in the `app/` directory
- Layout files (`_layout.tsx`) define shared UI for route groups
- Dynamic routes use bracket notation: `provider/[id].tsx`

#### 2. State Management
- **React Context** for global state:
  - `AuthContext`: Manages user authentication and profile data
  - `RequestContext`: Manages active service request state
- **React Query/SWR** not used - data fetching done directly in components/services
- Local component state managed with React `useState`/`useEffect`

#### 3. Styling & Design System
- Centralized design tokens in `constants/theme.ts`
- Consistent spacing (4px grid), typography, colors, radii, elevations
- Uses `StyleSheet.create()` for performance
- Platform-aware styling with `Platform.select()` when needed
- Custom components (`AppText`, `AppButton`, etc.) encapsulate styling

#### 4. Data Layer
- **Supabase** as backend (PostgreSQL + Auth + Storage)
- Direct Supabase client usage in `services/api.ts`
- Real-time subscriptions via `supabase.channel()` for live updates
- TypeScript interfaces defined in `services/contracts.ts`

#### 5. Navigation Structure
- **Root Navigator**: Stack navigator for modal screens (auth, onboarding)
- **Tab Navigator**: Bottom tab bar for main app sections:
  - Home (`index.tsx`) - Featured content, search, categories
  - Browse (`search.tsx`) - Provider discovery with filtering
  - Bookings (`bookings.tsx`) - User's booking history
  - Profile (`profile.tsx`) - User account management
  - Reviews (`reviews.tsx`) - Review system
- **Modal Stacks**: Payment, tracking, review screens presented as modals

## 📱 Key User Flows

### 1. Service Request Flow
1. User taps "+" button in tab bar → `/new-request/create`
2. Upload photos, select category, describe issue
3. AI summarizes issue and suggests urgency
4. User selects urgency: ASAP, This Week, or Flexible
5. Depending on urgency:
   - **ASAP**: Goes to live worker radar map (`match/[id].tsx`)
   - **This Week**: Schedule time slot → post request
   - **Flexible**: Post for bidding → receive worker bids
6. User reviews workers/bids → hires worker
7. Payment → Live tracking → Review

### 2. Worker Flow
1. Worker signs up via `/register-worker`
2. Completes multi-step profile setup
3. Admin verifies account → becomes "verified"
4. Receives service requests based on location/skills
5. Accepts jobs → updates job status → completes job

## 🔧 Development Guidelines

### Code Style
- Follow existing code patterns in the codebase
- Use functional components with React hooks
- TypeScript strict mode enabled (`tsconfig.json`)
- ESLint configured via `eslint.config.js`
- Format with Prettier (via `.prettierrc`)

### Component Guidelines
- Reuse existing UI components from `components/` directory
- Follow design tokens from `constants/theme.ts`
- Use `AppText`, `AppButton`, `AppCard` for consistent styling
- Keep components small and focused
- Export components as default exports

### Navigation Guidelines
- Use expo-router's `useRouter()` for programmatic navigation
- Link components for declarative navigation
- Modal screens use `animation: 'slide_from_bottom'` or `'slide_from_right'`
- Tab navigation should maintain consistent bottom bar

### Data Fetching
- Use services in `services/api.ts` for Supabase interactions
- Handle loading and error states in components
- Use React Query or similar for complex data fetching (to be implemented)
- Real-time subscriptions for live features (tracking, booking updates)

### State Management
- Use React Context for global app state (auth, active requests)
- Keep component state localized when possible
- Consider state lifting for shared state between components
- Avoid prop drilling by using context appropriately

### Asset Management
- Images: Use `expo-image` for optimized loading
- Icons: Use `lucide-react-native` or `@expo/vector-icons`
- SVGs: Use `react-native-svg` for vector icons
- Store remote images with caching considerations

## 📁 Important Files & Directories

- `app/_layout.tsx` - Root layout with providers and navigation setup
- `app/(tabs)/_layout.tsx` - Bottom tab navigation configuration
- `constants/theme.ts` - Design system tokens (colors, spacing, typography)
- `services/api.ts` - Supabase data access layer
- `context/AuthContext.tsx` - Authentication state management
- `app/(tabs)/index.tsx` - Home screen (main entry point after auth)
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `app.json` - Expo configuration

## 🔍 Debugging Tips

1. **Expo Dev Tools**: Press `d` in Expo Dev Menu to toggle dev tools
2. **Remote Debugging**: Use Chrome DevTools via "Debug remote JS"
3. **Network Inspection**: Use Flipper or Flipper plugins for network/API inspection
4. **Console Logs**: Use `console.log()` for debugging (removed before commit)
5. **Error Boundaries**: Consider implementing error boundaries for production

## 🚦 Common Issues & Troubleshooting

### Metro Bundler Issues
- Reset cache: `npx expo start -c`
- Clear Watchman: `watchman watch-del-all && watchman shutdown-server`

### TypeScript Issues
- Restart TypeScript server: Ctrl+Shift+P → "TypeScript: Restart TS server"
- Check `tsconfig.json` for path aliases

### Expo Updates
- Update Expo SDK: Follow Expo upgrade guide
- Check `app.json` for SDK version
- Run `npx expo doctor` for dependency issues

## 📚 Related Documentation

- [README.md](./README.md) - Project overview and tech stack
- [USER_FLOW.md](./USER_FLOW.md) - Detailed user journey documentation
- [WORKER_REGISTRATION_FLOW.md](./WORKER_REGISTRATION_FLOW.md) - Worker onboarding flow
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
