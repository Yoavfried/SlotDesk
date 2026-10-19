# Repository changelog

## 2026-10-19 — SlotDesk 0.9.3.5

- Same-version hotfix: audit the whole shipped interface for capitalization, correct the remaining title-case labels and generated warnings, and remove ordinary-heading exceptions from the style guide.
- Implement the approved styling and profile/calendar intermediate release, retain the supplied logo/robotic accents, and add a working style guide.
- Guard saved email changes and new-profile creation; simplify calendar links, no-access behavior and explicit scope removal. Document validation and preserve reviewed Calendar-write boundaries.
- Keep the individual advanced settings review for 0.9.4 and overall UX approval with the owner.

## 2026-10-18 — SlotDesk 0.9.3 accessibility

- Further same-version card polish: place email with the name, replace availability captions with a timezone-row calendar icon and hover/focus explanation, move automatic inclusion guidance to linked-calendar profile settings, and shorten the per-meeting overlap copy.
- Same-version UI follow-up: align the participant Add button, dismiss suggestions outside the picker/on page scroll, keep them below the header, and use Edit Profile as the editor heading. Record advanced profile settings cleanup/improvement as the next task.

- Expand the open UX review and reserve readiness approval to the owner.
- Implement and verify focused accessibility fixes; preserve scheduling rules, Google permissions and reviewed calendar-write boundaries.
- Add a repeatable synthetic browser fixture/journey and record technical coverage without claiming full accessibility conformance.

## 2026-10-18 — SlotDesk 0.9.2

- Implement the accepted live profile, independent flight/travel Save/Discard and portable configuration-file contracts.
- Add profile/calendar-status, wording, keyboard and responsive refinements; document saved-data boundaries and local validation.
- Package the private Chrome pilot with unchanged Google permissions and reviewed calendar writers. Broader website work stays on hold.

## 2026-10-18 — Profile and flight save policies settled

- Record live profile editing without general Save/Discard, with validation and honest failed-save handling.
- Record individual editable/removable flights, Add flight above the list, exact Save/Discard actions returning to the profile, and optional outbound/return entry with reversed location/timezone prefills. Keep flight dates/times user-entered and save a pair atomically.
- Reconcile the usability plan with shipped 0.9.1 Settings, pagination, suggestions and recovery behavior. The former two save-policy blockers are resolved; implementation, accessibility/wording and the settled backup/import work remain planned.

## 2026-10-15 — SlotDesk 0.9.1

- Implement the approved Settings, calendar chooser, header, profile pagination, familiar-face cache and participant-picker polish.
- Replace ordinary manual confirmation work with bounded read-only verification and bell alerts for uncertain writes; keep reviewed identity-safe retries and exceptional access-loss resolution.
- Document current data retention, recovery behavior, version changes and synthetic validation. Keep backup/import and the undecided profile/travel save model planned.

## 2026-10-15 — Concrete usability planning

- Define task flows and current-source observations for profile management, advanced rules, travel/flight entry, Settings, wording and keyboard/accessibility.
- Keep profile and travel save boundaries explicitly open pending review of concrete examples. Preserve the settled backup/import requirements; application implementation remains planned.

## 2026-10-15 — Restore policy settled

- Record the own-profile exception: selected-person import cannot change it; active full restore updates it only for a matching email, otherwise preserving it. Onboarding restores still require own-profile setup.
- Confirm profiles/settings-only backups, clearing unsent drafts on full restore and an optional current-backup download before replacement. Keep implementation planned and move to the remaining usability flows.

## 2026-10-15 — Import policies confirmed

- Require email and timezone; use email when the name is missing. Replace matching-email profiles after one overwrite warning.
- Include calendar assignments, flag unavailable calendars and retain selected-profile import as a local operation. Implementation remains planned.

## 2026-10-15 — Export/import clarification

- Separate complete portable setup backup/restore from selected-person export/import. Full restore replaces local configuration; selected-person files carry all profile settings and support Select all.
- Record named-column version compatibility, missing-field defaults versus required-column failures, calendar access warnings and removal of a mandatory general preview. Keep base fields, duplicate behavior and selected-profile calendar assignments explicit pending choices.

## 2026-10-15 — Next usability scope

- Record the requested keyboard/accessibility, initial wording and profile/Settings/travel UX review, with a controls inventory, proposed organization and user situations.
- Record the owner's choice to support individual-profile selection alongside complete local profile/settings backup. Document proposed import previews, conflicts, calendar reassignment and recovery boundaries; application implementation remains planned.

## 2026-10-15 — SlotDesk 0.9.0 preview

- Implement the accepted recovery flow and five-column onboarding registration, add the private intake source/migration and record verification.
- Create the separate SlotDesk database/table and deploy its insert-only intake after the owner configures server secrets. Configure the exact live extension endpoint, verify isolated-database insertion and duplicate preservation, and rebuild the preview. Retain 0.8.1 as the latest published pilot.


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
