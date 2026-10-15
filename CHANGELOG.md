# Repository changelog

## 2026-10-15 — SlotDesk 0.9.0 preview

- Implement the accepted recovery flow and five-column onboarding registration, add the private intake source/migration and record verification.
- Create the separate SlotDesk database/table. Keep central submission pending because Vercel environment-variable access is denied; retain 0.8.1 as the latest published pilot.


## 2026-10-15 — Five-column leads scope agreed

- Record directly user-supplied email/name/timezone, app-generated onboarding time and an optional updates-opt-in boolean. Each completed onboarding creates a lead, including when the checkbox is unchecked.
- Record the accepted short notice and optional unchecked updates wording. Correct the assistant's unsupported interpretation of the source fields; leave private storage/endpoint implementation pending.

## 2026-10-15 — Leads-table clarification

- Correct the earlier newsletter-specific framing: the owner requests email, name, assigned timezone and actual onboarding time in a private leads table for product analysis and possible future first-party project news.
- Keep the proposed notice/contact choice and outstanding data-use/storage decisions explicit. No separate newsletter product, external signup requirement, collection or application change.

## 2026-10-15 — Accepted recovery direction and newsletter proposal

- Record the accepted A1–G10 failure/recovery inventory, read-only setup, stale in-memory views and manual-resolution direction as planned, not implemented.
- Record the requested contact/time/onboarding table and clarified future first-party newsletter purpose. Separate optional marketing signup, permitted data sourcing and backend/privacy work from current local-only behavior. No collection, mailing or application release change.

## 2026-10-14 — SlotDesk 0.8.1

- Refine Settings/calendar submenus, compact source rows/info, protected own-profile layout and browser-wide date order.
- Record accepted UX and focused synthetic validation; package the private 0.8.1 pilot.

## 2026-10-14 — SlotDesk 0.8.0

- Implement the authorized onboarding/profile/calendar/guest/flexibility scope and retain the supplied design assets and extension identity.
- Record UX61–UX67/F19–F26, migration and scoped-data semantics, validation and packaged Help/privacy. Keep broader settings work and LLM/email features deferred.
- Validate and package the 0.8.0 private pilot; preserve reviewed calendar mutation/recovery boundaries.

## 2026-10-14 — Future LLM direction and parked availability emails

- Park availability emails as an unconfirmed, non-blocking future feature after reviewing Gmail AMP setup/compatibility; record possible BYOK-only access without committing to it.
- Document optional user API keys, prepared prompts and task-based selection of the cheapest reliable model, with provider/key/cost choices still open.
- Record intended email/appointment reading, inquiry drafting/reply interpretation, factual rule-based explanations and future direct appointment creation under an explicit automation policy.
- Preserve deterministic scheduling/write safeguards and distinguish future key/data/email/automation decisions from shipped 0.7.1. No code, permissions, package or product-version change.

## 2026-10-14 — Structured time inquiry planning

- Define one Ask about times flow covering every combination of one/many people and one/many options, with structured replies before booking.
- Record single-time Yes/No and several-time multi-selection with explicit submission/None, separate EA booking confirmation and response revision/access safeguards.
- Record the inline-only requirement: no recipient response page or Google Forms. A static preview, free-text substitution or separate reply per checkbox does not satisfy it.
- Make the feature conditional on actual email delivery and inline submission in the intended client/account scope; distinguish submission endpoints and ordinary-email fallback from inbox storage.
- Leave sender, service/storage, new permissions and live email delivery unimplemented; retain separate reviewed Calendar booking.


## 2026-10-14 — Product review planning

- Record eight owner testing notes and follow-up answers: required timezone confirmation, every mapped profile joining automatically, and broader executive overlap flexibility.
- Record saved overlap defaults with meeting overrides, hour-only convenience ignoring and the clarified ordinary-clash versus 23:00 example, without changing shipped behavior.
- Add planned UX61–UX68 and roadmap linkage; preserve 0.7.1 as the shipped release.
- Distinguish workspace calendar scope, profile availability sources and mapping-based automatic organizing-calendar participants.


## 2026-10-13 — SlotDesk 0.7.1

- Add reviewed guest/detail editing, narrow conditional writes and duplicate-safe recovery.
- Document UX57–UX60, editing scope/privacy and automated/browser evidence.
- Publish the 0.7.1 pilot package while preserving the pinned extension/OAuth identity and design kit.

## 2026-10-13 — Reported live rescheduling progress

- Record working No alerts, sensible replacement proposals, a successful actual reschedule and correct overlap details, as reported by the owner.
- Remove the retired manual checklist and consolidate the validation record around actual reported and automated evidence.
- Recheck calendar write entry points and rerun 251 existing booking/rescheduling/safety checks. No app or package change.


Product releases are recorded in [the complete SlotDesk changelog](docs/changelog.md).

## 2026-10-13 — Standalone private repository

- Establish `Yoavfried/slotdesk` as the canonical SlotDesk source, separate from private parent-website planning.
- Retain the complete 0.7.0 extension and engine; reorganize source into `extension/`, product records into `docs/`, and design references into `design/`.
- Credit both GitHub accounts and add the `[Website name TBD]` parent credit.
- Adapt preview, validation and packaging paths; add automated checks and contributor templates.
- Keep automated validation separate from actual live reports.
- Preserve extension identity, OAuth scopes, bundled fonts and product version 0.7.0. This migration adds no calendar behavior.
- Preserve exact extension bytes through Git checkouts and emit the ZIP's SHA-256 alongside the package.

The initial commit is a curated snapshot. The original product versions remain documented; internal website plans and private audit/calendar artifacts are outside this repository.
