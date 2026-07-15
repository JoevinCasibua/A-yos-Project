# A-yos: User Flow Documentation

This document outlines the core user journeys and navigation flows within the A-yos Provider Marketplace App.

## 1. Onboarding & Discovery
- **Launch App** -> User is presented with the **Home Screen** (`app/(tabs)/index.tsx`).
- **Home Screen**:
  - View promotional banners.
  - Quick access to top categories (Plumbing, Electrical, etc.).
  - View top-rated providers.
- **Search & Browse** (`app/(tabs)/search.tsx`):
  - User can search for specific services or providers.
  - Apply filters (Rating, Price, Distance).
  - Tap on a provider to view their detailed profile.
- **Provider Profile** (`app/provider/[id].tsx`):
  - View provider stats, about section, portfolio photos, and reviews.
  - Actions: **Book Now** or **Message**.

## 2. Request Creation Flow
The app uses an intent-driven request flow where the user defines their problem first.

1. **Start Request** (`app/new-request/create.tsx`):
   - User uploads photos (up to 5).
   - Selects a service category.
   - Provides a detailed description of the issue.
   - Specifies if replacement parts are available.
2. **AI Summary** (`app/new-request/issue-summary.tsx`):
   - The app processes the input and provides an AI-generated summary and recommendation.
   - User proceeds to select Urgency.
3. **Urgency Selection** (`app/new-request/urgency.tsx`):
   - User selects how quickly they need the service:
     - **ASAP (Emergency)**
     - **This Week (Scheduled)**
     - **Flexible (Open Bidding)**

## 3. Urgency Paths & Review
Based on the Urgency selected, the user is routed to a specific flow:

### Path A: ASAP (Emergency)
- **Review Screen** (`app/new-request/asap.tsx`):
  - User reviews the request details.
  - Can tap "Edit Request Details" to go back and modify the description/photos.
- **Broadcast**: User taps "Broadcast Request".
- **Radar Matching** (`app/match/[id].tsx`):
  - User sees a live map with a pulsing radar animation at their location.
  - Available workers sequentially "pop up" on screen with their ETA and initial price estimate.
  - User selects a worker and taps **Message** to confirm details before hiring.

### Path B: This Week (Scheduled)
- **Schedule & Review Screen** (`app/new-request/this-week.tsx`):
  - User selects a specific Day and Time block.
  - Reviews the request details below the scheduler.
  - Can tap "Edit Request Details" to modify the core request.
- **Post**: User taps "Post Request".
- **Success**: Redirects to a success confirmation screen, then to the Request Details page.

### Path C: Open Bidding
- **Review Screen** (`app/new-request/bidding.tsx`):
  - User reviews the request details.
  - Can tap "Edit Request Details" to modify the core request.
- **Post**: User taps "Post Request for Bidding".
- **Success**: Redirects to a success confirmation screen, then to the Request Details page.

## 4. Request Details & Hiring
- **Request Details Screen** (`app/request/[id].tsx`):
  - Displays a highly compact, space-efficient `JobSummary` at the top of the screen (showing photos, description, location, tags, and schedule).
  - Below the summary, displays a list of incoming **Applicants** or **Bidders**.
  - User reviews bidder profiles and prices.
  - **Hire**: User selects a worker, negotiates via Message (optional), and proceeds to hire them.

## 5. Booking & Payment
- **Payment Modal** (`app/payment.tsx`):
  - User selects a payment method (e.g., GCash, Credit Card, Cash on Service).
  - Confirms the transaction.
- **Payment Received** (`app/payment-received.tsx`):
  - Success confirmation. Routes user to Live Tracking.

## 6. Active Service & Post-Service
- **Live Tracking** (`app/tracking/[id].tsx`):
  - User tracks the provider's ETA on a live map.
  - Views a 5-step status timeline (Provider on the way, Arrived, Job in Progress, Final Inspection, Completed).
  - Quick actions to Call or Message the provider.
- **Completion & Review** (`app/review/[id].tsx`):
  - Once the job is marked complete, the user is prompted to rate the provider (1-5 stars) and leave a written review.
  - The review is published to the provider's profile.

## 7. Account Management
- **My Bookings** (`app/(tabs)/bookings.tsx`):
  - View all Active, Upcoming, and Past/Cancelled requests.
- **Profile** (`app/(tabs)/profile.tsx`):
  - Manage payment methods, addresses, notifications, and account settings.
