# Project Overview

## Background and problem

A-YOS addresses the difficulty of finding suitable local service workers, coordinating a booking, following service progress, confirming cash payment, and preserving trustworthy feedback. It provides role-specific workflows for users, workers, and administrators and an optional AI-assisted request-preparation path.

## Goals and expected outcomes

- Help users describe a need, discover suitable approved workers, make a private booking, monitor service, pay, and review.
- Help workers maintain professional information, receive appropriate requests, progress accepted work, communicate, and confirm payment receipt.
- Help administrators control worker approval, accounts, operations, finance, support, communications, reports, settings, and audit evidence.
- Keep every implemented behavior traceable to FR-01–FR-104 or NFR-01–NFR-18.

## Target users and roles

- **User/Homeowner:** creates and manages service requests and bookings.
- **Worker:** offers services after administrator approval.
- **Administrator:** operates the protected web dashboard.

Every account has exactly one production role. Worker-to-user switching is a prototype-only behavior and is excluded.

## Scope and boundaries

The MVP includes the mobile user/worker experiences, administrator web dashboard, account security, worker approval, discovery/matching, booking lifecycle, cash confirmation, reviews, messages, notifications, support, reporting, and provider-backed AI/location/translation capabilities.

It excludes worker verification fees, worker advertising, purchasable premium membership, functional non-cash payment processing, and permanent deletion without a retention policy.

Supabase Storage is the private media boundary. External email, AI, speech, map gateway, push, and translation providers remain system boundaries; local/test adapters validate contracts but are not production substitutes.

## Success criteria

Success requires every confirmed requirement to have implementation evidence, executed validation, synchronized documentation, and an honest final classification. Production readiness also requires real providers, credentials, legal content, production infrastructure, measurable performance targets, and recovery objectives.
