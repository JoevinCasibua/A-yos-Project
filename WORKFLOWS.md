# Workflows

## User/Homeowner workflow

**Actor:** new or registered user. **Precondition:** required content and network/provider availability.

1. Launch → Splash → Landing → Already registered?
2. New user: registration details → accept Terms → email OTP → valid code activates and signs in. Invalid/expired/provider failures show retryable outcomes.
3. Registered user: email/mobile + password → optional recovery code → Home.
4. Home exposes Browse, Send Request, Bookings, Messages, Alerts, Profile, and optional AI Home Assistant.
5. Browse supports featured/recommended/recent, search/filter/sort/category, worker details, top-five comparison, preselection messaging, and worker selection.
6. Request captures service, description, optional photos, address, future schedule, budget, notes, and optional AI analysis.
7. If no suitable worker exists, adjust filters/date; AI-created requests remain open for later notification.
8. Selected worker receives a private request and accepts or declines with a reason. Offline/decline/timeout recommends another worker.
9. Booking follows Pending → Accepted → Worker Preparing → Worker En Route → Worker Arrived → Service Started → In Progress → Completed, or Cancelled with reason/policy/confirmation.
10. En-route tracking requests permission. Granted shows map/ETA; denied explains the limitation and supports retry. Active booking offers Call, Chat, and Emergency actions.
11. Completed booking uses Cash. User confirms cash paid; worker confirms receipt; success generates receipt and closes payment. Failure allows retry.
12. Completed-and-paid booking enables star rating, text, images, recommendation, and submitted result, subject to moderation.

Related requirements: FR-01–04, FR-10–18, FR-25–48, FR-49, FR-52–62, FR-73, FR-75–81, FR-89–101, FR-104. **Status:** connected in Expo; authenticated lifecycle, native device, and external route/ETA acceptance remain unverified.

## Worker workflow

**Actor:** worker account. **Precondition:** verified email; administrator approval before accepting jobs.

1. Complete professional registration, categories, experience, service area, availability, identity information, and document submission.
2. Administrator approves, requests documents, or rejects. Approval activates job acceptance without a verification fee.
3. Dashboard exposes Job Posts, Bookings, Reviews, and Profile. Prototype user-side role switching and Hire/Worker Match nodes are excluded.
4. Job Posts show only authorized suitable requests. Worker accepts or declines with a reason.
5. Accepted booking is prepared, travelled to, performed, and completed through canonical states; contact/tracking are permission- and participant-scoped.
6. Worker confirms cash received. After successful payment, worker sees customer feedback read-only.
7. Profile maintains professional details. Recommendation priority is administrator-controlled; advertising and premium purchase are excluded.

Related requirements: FR-05–09, FR-15–17, FR-42–43, FR-50–51, FR-58–59, FR-82–88, FR-102–104. **Status:** connected in Expo; authenticated lifecycle and native-device acceptance remain unverified.

## Administrator workflow

**Actor:** protected administrator. **Precondition:** Supabase service-role bootstrap account and valid credentials; authenticator-app TOTP/AAL2 when enabled.

1. Login validates credentials and optional second factor, then opens Dashboard.
2. Account Management covers profile, password/email, 2FA, login history, logout, users, workers, details, approval/document requests, suspension, and recommendation priority.
3. System Administration covers audit logs, Trash, Restore, blocked permanent deletion, and saved/discarded settings.
4. Communication creates notifications for users, workers, or everyone and sends/schedules them.
5. Business Intelligence provides reports, analytics, export, and print.
6. Customer Support provides ticket details, review moderation, escalation, resolution, and closure.
7. Financial Management provides transactions, cash details, and processed/rejected refunds.
8. Operations provides booking details, intervention/resolution, and services management.
9. Shared controls provide search, filters, pagination, exports, notifications, confirmations, and success/error outcomes.

Related requirements: FR-19–24, FR-31, FR-63–72, FR-74. **Status:** connected in Next.js; authenticated AAL2 mutation acceptance remains unverified.

## AI Home Assistant workflow

**Actor:** user. **Precondition:** authenticated active User; media permission for selected image/voice inputs; configured provider secrets for production calls.

1. Open assistant → provide text, choose an image, or record voice.
2. Text and images are analyzed directly; speech is transcribed before analysis.
3. Result contains detected issue, severity, possible cause, suggested category, cost range, and safety advice.
4. Book a Professional creates an editable request draft; otherwise save analysis/draft for later.
5. Standard matching, booking, canonical lifecycle, cash confirmation, feedback, and administration paths continue.
6. No match keeps the request open and notifies later when a suitable worker appears.

Retryable OpenAI failures continue to Gemini and then OpenRouter. Authorization, invalid input, safety/refusal, provider credentials, and invalid structured output are final failures. Every attempt is redacted and audited.

Related requirements: FR-11–18, FR-25–31, FR-41–43, FR-57–59, FR-92–98, FR-104. **Status:** analysis, save, and request continuation are connected; live-provider and authenticated end-to-end verification are blocked by credentials/fixtures.
