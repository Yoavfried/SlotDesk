# SlotDesk security and privacy

Version 0.7.0 adds an explicit, time-only existing-event PATCH boundary with account, organizer, permission and ETag guards. Creation remains a separate guarded writer. No calendar deletion or move exists; no meeting changes automatically. New focused tests and the live acceptance requirement are recorded below.

Version 0.6.1 caches fetched meeting entries for every accessible calendar in the selected range, including unselected calendars. The cache is memory-only, account/date scoped, and clears on disconnect/reset/account change. Only chosen filters and calendar labels persist. Selection/timezone changes do not contact Google; explicit Refresh/date changes do. Browse caching does not supply booking availability or weaken fresh account/write checks. No OAuth scope or event mutation path changes.

Version 0.6.0 adds same-account window synchronization and local persistence of user-authored review drafts. Session notifications store account/connected/nonce, never tokens. Workspace commits use Web Locks and merge conflicts are resolved in place; send reservation revalidates reviewed inputs under the lock. Existing immutable pending recovery and fresh account/permission checks remain. No new OAuth scope, existing-event mutation endpoint, backend, email reader or external service is introduced. The broader event-write scope still permits operations beyond this app's code; the writer remains GET/new-event POST only.

Version 0.5.0 adds read-only calendar browsing and guest-response display using the existing reader. Raw event details stay in memory and are cleared on disconnect; only chosen calendar/date filters persist. Descriptions and provider text are escaped; external event/video links remain allowlisted. No additional OAuth permission or existing-event write path is introduced. The prior source audit and current synthetic checks are separate evidence; this update is not a new exhaustive security audit.

Updated 13 October 2026 for **0.7.0**. This record explains supported behavior, evidence and remaining limits. It is not a guarantee that all future changes or browser environments are safe.

## Calendar integrity boundary

The creation writer supports **creating a new event** and **reading back that same event**. The separate 0.7.0 rescheduler supports **a reviewed time-only update to one organizer-copy appointment/occurrence**. Neither path supports delete or calendar moves. The creation request guard accepts GET and new-event collection POST only; reviewed payloads are rebuilt from an allowlist. Cancellation, recurrence, organizer and other unsupported fields are rejected before authentication/network calls. Calendar-list and event reads use GET; busy-only availability uses a non-mutating POST to freeBusy. Creating a meeting can intentionally overlap an appointment after an EA warning; that appointment's content/time are not changed.

Each prepared send has a random stable event identifier and application request marker. An uncertain response checks the same identifier before retrying. A collision with a different event is rejected. The request is saved before POST, bound to its Google account, and validated on recovery. The current primary account is confirmed before writer operations. Web Locks coordinate panel/tab sends, and workspace revisions reject stale writes/sends. Missing lock support prevents sending and leaves Copy meeting details available.

Google's **calendar.events permission includes editing/deleting events**. SlotDesk restricts its two writers to reviewed new-event creation and an individual time-only reschedule; calendar deletion and moves remain unsupported. A general create-only permission for existing/delegated organizing calendars is not offered by the current scope contract. The calendar.events.owned scope also permits editing/deleting and would lose delegated calendars; calendar.app.created restricts work to calendars the app creates. The 0.7.0 rescheduling boundary has focused validation below; future mutation paths need their own review. [Google Calendar scopes](https://developers.google.com/workspace/calendar/api/auth), [event insertion](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert).

## Data handling

| Data | Handling |
| --- | --- |
| Google access tokens | Accessed through Chrome identity; not written to SlotDesk settings, event logs or Git. Chrome manages its token cache. |
| Fetched calendars/events | Held in session memory and displayed when needed; not stored in SlotDesk settings. Disconnect clears session state, editors and calendar-derived DOM. |
| Profiles, contact emails, mappings, constraints, travel, preferences | Persist in extension localStorage, separated by connected account. These may contain sensitive scheduling information. |
| Prepared unfinished outgoing invitation | Persists for duplicate-safe recovery, including title, attendee emails, times, location/description and identifiers. Removed after confirmed completion. |
| User-authored review drafts and connection state | Review fields persist locally to continue across windows/reload. Connection notification contains account, connected flag and nonce; no token. |
| Display clock/appearance | Browser-wide preferences. |
| Backend/analytics/LLM/email access | None. Calendar API requests go to Google; there is no application server, analytics service, email connector or model service. |

Local settings and pending invitations are **not encrypted by SlotDesk**. Account namespaces prevent accidental mixing in the app; they do not isolate data from someone controlling the same browser profile, operating-system account or device. Use an appropriately protected browser/device for workplace data.

The packaged [privacy notice](../extension/privacy.html) is accessible through Help before and after connection.

Disconnect clears Chrome's cached tokens through its identity API; it does not remove Google's existing consent grant or saved settings. Loaded data is cleared from the current window; other open same-account SlotDesk windows receive the disconnect notification and clear their displayed session too. Settings → Clear saved SlotDesk data removes the connected account's saved workspace after any unfinished send is resolved; it does not delete Calendar appointments. Remove the app grant separately through Google account controls if access must be revoked.

Calendar text is escaped or inserted with textContent. Receipt links are restricted to HTTPS Google Calendar/Meet hosts. Manifest CSP restricts extension scripts; there are no content scripts, external messaging bridge or web-accessible resources. Reader/writer fetches reject redirects and omit cookies, referrers and cache reuse. Never add tokens, client secrets, real calendar exports or private screenshots to Git. The extension key and OAuth client ID are public identifiers.

## Review and validation evidence

A standard source review completed against **0.3.5 at commit 330114f69fad9ea55c00383b577484da7fa95d92**, scoped to apps/slotdesk. The independent baseline read all 30 text files; four WOFF2 fonts were inventoried but their binary parser internals were outside the audit. Architecture and focused validation passes supplemented the review. No reportable attacker-supported vulnerability was established. Coverage remained partial because runtime density, cleanup/shared-calendar correctness and organization/account behavior needed follow-up. This is not a claim that the 0.4.0 diff or workplace deployment received exhaustive security certification.

The review identified correctness/hardening work addressed in 0.4.0: shared-calendar RSVP ownership, disconnect editor residue, fresh account checks on recovery/video readback, saved-request validation and multiple-window coordination. The source now includes method/payload/redirect guards. The [1146 automated checks and browser checks](testing.md) verify synthetic behavior, including 6,000 paginated events and 2,000 unchanged existing meetings. No real account or invitation was used by the agent for this update.

The sealed scan report remains a local audit artifact. This product record summarizes its source boundaries and useful conclusions without publishing machine-specific audit metadata.

## Work-account gate

Nina uses **Google Workspace / Google Calendar**. Before she connects that account:

1. Complete the [busy real-calendar acceptance](testing.md) with synthetic appointments in a test calendar, comparing unrelated events before/after reviewed creations.
2. Confirm the workplace permits the extension and its stated Google scopes/data handling. Record approved account/calendar permission level without private details.
3. Resolve failures, then run a controlled work-account pilot with agreed recipients. Keep manual copying available if permissions/coverage are insufficient.

Current status: **source review and synthetic hardening checks complete; the dense-calendar self-only creation/export integrity check passed. Live shared/revoked permissions, updated synchronization acceptance, final export and workplace approval remain pending**. The two user-supplied exports preserve all 1,013 original event components and contain exactly one reviewed addition with the expected time/own-profile attendee/Meet link. The raw files remain outside Git; this verifies exported contents, not recipient delivery or every intermediate operation. The owner's reported basic live success is recorded separately. The reviewed rescheduling boundary now has focused source/payload/concurrency and synthetic browser checks; it still needs live single-instance/time-only integrity acceptance. Outlook needs its own provider permission/recovery validation.

## New existing-event boundary in 0.7.0

The rescheduler validates account/calendar/event IDs, exact allowed plan fields, date formats, increasing times, occurrence identity and a quoted ETag before obtaining a token. Every GET/PATCH obtains the same account-validated token supplier as creation. PATCH refreshes write permissions, targets the selected ID, sends only start/end, uses If-Match and requests guest updates. It has no DELETE/PUT/calendar-move method. Organizer-copy, locked-event and individual-occurrence checks precede mutation. Stale versions fail rather than overwriting another edit. Network uncertainty retains a saved operation and reads back the same ID; confirmed target times avoid another PATCH.

The pending record contains identifiers, version and before/after times only. Decline tracking stores guest emails/status/acknowledgement/expiry; collision follow-ups store target IDs and a protected interval. None is a content cache or token store. This metadata is local and unencrypted, account-scoped like other settings. Reset is blocked by either type of unfinished write.

The new tests verify forbidden fields before network, stale identity/version, revoked roles, HTTP 412, timeout/lost-response recovery, duplicate sends, single recurring-instance targeting, all-day format and preserved non-time fields. The previous exhaustive-scope claims are not extended: this is focused implementation verification, not a new exhaustive security audit. A successful source/mock check cannot guarantee that other Google clients will not change attendee calendars between availability read and confirmation.
