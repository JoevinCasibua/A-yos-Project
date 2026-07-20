# Known Issues

## Blocking external information

- Original SRS/workflow source files cited by existing documentation are absent; only the canonical requirement catalog is available.
- Production legal content, retention/deletion policy, provider credentials/quotas, SMTP, public map style, acceptance environments, browser/device matrix, RPO, and RTO are **INSUFFICIENT DATA TO VERIFY**.
- Translation and push provider adapters are fail-closed and cannot be accepted end-to-end without configured providers.

## Remaining verified limitations

- Authenticated end-to-end fixtures for User, Worker, and AAL2 Administrator workflows are not available. Public Admin and Expo web smoke tests pass, but mutation workflows are not accepted solely from rendering/build evidence.
- User profile editing is limited to data with verified contracts; unsupported preference fields are not shown. Address creation is implemented in the service-request flow, while a standalone address editor is not present.
- Translation and push adapters fail closed without configured providers. In-app messages, image attachments, notifications, read state, and private Realtime refresh are implemented.
- Production pricing, portfolio, Admin login-history persistence, and emergency-contact behavior have no verified backend contract and are excluded.
- Permanent deletion is deliberately blocked pending an approved retention policy.

## Resolved integration gaps

- Owner-checked request/review media attachment commands and matching-worker request/media RLS and Storage policies were added.
- AAL2 Admin notification creation/scheduling and service-category upsert/activation commands were added with audit records.
- AI analyses can be saved and continued into the real request flow.
- Worker availability writes are idempotent across repeated onboarding saves.

## Reference-only conflicts

- Wallet/top-up/payout, non-cash payments, bidding, advertising, premium purchase, and production role switching are excluded.
- Reference datasets, hard-coded OTPs, simulated maps, fake loading, and alert-only operations must never enter production flows.

## Repository state

The local repository has no commits or configured remote and currently consists entirely of untracked files. Implementation can be verified locally, but source-history provenance and delivery destination are **INSUFFICIENT DATA TO VERIFY**.
