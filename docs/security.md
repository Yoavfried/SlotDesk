# SlotDesk security and privacy

## 0.9.5 trips and review

Trip forms write account-scoped local configuration only. They do not call the Calendar writer, rescheduler or detail editor. The existing explicit review, account/permission, ETag, locking and uncertain-write recovery boundaries remain unchanged; no deletion/move operation, OAuth scope or host permission is added.

Flight discovery reads selected, linked sources. Raw source records stay in memory and clear on disconnect, scope changes or configuration replacement. Leaving a source out stops its discovery suggestions; an independently saved trip remains until edited/deleted. A missing/inaccessible linked source produces review information rather than silently cancelling a flight. A changed raw appointment still blocks at its actual calendar interval until reviewed, while the saved flight retains its confirmed interval.

Profile/calendar/airport text uses escaped HTML or textContent; a synthetic calendar title containing HTML was checked through matching and Alerts. Airport data and icons are bundled, pinned and licensed; no remote script or paid/live flight service is used. Portable files include user-confirmed trip settings and source identifiers, not fetched event bodies, OAuth tokens or resumable flight drafts. Imported trip/history values are validated before replacement.

The [0.9.5 validation](validation-0.9.5.json) covers these new boundaries and existing operations with synthetic providers. This focused code/flow review is not an exhaustive audit of Git history or proof that the whole system is vulnerability-free. The broader hosted-service/privacy/history review remains a [1.0.0 publication gate](release-1.0.0-plan.md).

## 0.9.4.7 local profile rules

Blockers, detection keywords and per-event/series treatment update local account configuration only. The profile meeting browser uses selected linked sources and the existing account/scope-guarded reader; changing its calendar filter does not send extra reads. Disconnect/scope/configuration replacement clears its memory cache. These features have no create/update/delete/move transport. Explicit protection and saved flights remain hard constraints when ordinary overlaps are ignored. Shared events retain separate per-person treatment. Backup/profile files contain rules and identifiers, not fetched event bodies or access tokens. The synthetic validation record does not establish exhaustive security or real-provider correctness.

## 0.9.4.6 authentication and platform boundary

The independent OAuth service receives Google authorization codes/tokens transiently for exchange and refresh. Server-only Web client/encryption secrets remain in hosting. Purpose-bound AES-256-GCM envelopes bind exact approved return URI, originating extension and PKCE challenge; sensitive exchanges/refreshes require the verifier. The callback returns only code/state. Tokens and the encrypted refresh envelope/verifier remain in background memory or `storage.session`, never workspace localStorage, backups, logs or Neon. Session storage clears at browser exit; provider/envelope expiry is at most seven days in this beta. The older Chrome fallback remains browser-managed while the service is inactive.

The service performs fixed-endpoint, bounded, timed Google requests; exact approved Chromium origins and Firefox extension transport origins receive CORS without cookies. Firefox dynamic origins are not authentication: proof and origin-bound encrypted credentials are required separately. Registration relays the bounded onboarding fields and browser label to the existing insert-only table. Public status exposes readiness/build only. Coarse in-memory throttling is not distributed production abuse control. Server/hosting access logs must not record codes, tokens or request bodies; review platform logging/redaction before wider rollout.

The new `storage` permission is for session-only credentials. The existing Google scopes/host permissions, account checks and reviewed create/reschedule/edit transports are unchanged. Missing Web Locks fails closed; missing sidebar support opens a full tab. These focused implementation tests are not a new exhaustive repository-wide security certification. Real-provider activation, other engines and store-specific privacy/consent review remain open.

Version 0.7.1 adds a separate allowlisted guest/detail editing path with identity, organizer, permission, ETag and shared-write protections. No deletion or calendar move operation is introduced.

Version 0.7.0 adds an explicit, time-only existing-event PATCH boundary with account, organizer, permission and ETag guards. Creation remains a separate guarded writer. No calendar deletion or move exists; no meeting changes automatically. Focused automated checks and reported live outcomes are recorded below.

Version 0.6.1 caches fetched meeting entries for every accessible calendar in the selected range, including unselected calendars. The cache is memory-only, account/date scoped, and clears on disconnect/reset/account change. Only chosen filters and calendar labels persist. Selection/timezone changes do not contact Google; explicit Refresh/date changes do. Browse caching does not supply booking availability or weaken fresh account/write checks. No OAuth scope or event mutation path changes.

Version 0.6.0 adds same-account window synchronization and local persistence of user-authored review drafts. Session notifications store account/connected/nonce, never tokens. Workspace commits use Web Locks and merge conflicts are resolved in place; send reservation revalidates reviewed inputs under the lock. Existing immutable pending recovery and fresh account/permission checks remain. No new OAuth scope, existing-event mutation endpoint, backend, email reader or external service is introduced. The broader event-write scope still permits operations beyond this app's code; the writer remains GET/new-event POST only.

Version 0.5.0 adds read-only calendar browsing and guest-response display using the existing reader. Raw event details stay in memory and are cleared on disconnect; only chosen calendar/date filters persist. Descriptions and provider text are escaped; external event/video links remain allowlisted. No additional OAuth permission or existing-event write path is introduced. The prior source audit and current synthetic checks are separate evidence; this update is not a new exhaustive security audit.

Updated 15 October 2026 for **0.9.1**. This record explains supported behavior, evidence and remaining limits. It is not a guarantee that all future changes or browser environments are safe.

## Calendar integrity boundary

The creation writer supports **creating a new event** and **reading back that same event**. The separate 0.7.0 rescheduler supports **a reviewed time-only update to one organizer-copy appointment/occurrence**. The 0.7.1 editor permits reviewed title/location/description and explicit guest-list edits only. None of these paths supports delete or calendar moves. The creation request guard accepts GET and new-event collection POST only; reviewed payloads are rebuilt from an allowlist. Cancellation, recurrence, organizer and other unsupported fields are rejected before authentication/network calls. Calendar-list and event reads use GET; busy-only availability uses a non-mutating POST to freeBusy. Creating a meeting can intentionally overlap an appointment after an EA warning; that appointment's content/time are not changed.

Each prepared send has a random stable event identifier and application request marker. An uncertain response checks the same identifier before retrying. A collision with a different event is rejected. The request is saved before POST, bound to its Google account, and validated on recovery. The current primary account is confirmed before writer operations. Web Locks coordinate panel/tab sends, and workspace revisions reject stale writes/sends. Missing lock support prevents sending and leaves Copy meeting details available.

Google's **calendar.events permission includes editing/deleting events**. SlotDesk restricts its writers to reviewed new-event creation, an individual time-only reschedule and allowlisted detail/guest edits; calendar deletion and moves remain unsupported. A general create-only permission for existing/delegated organizing calendars is not offered by the current scope contract. The calendar.events.owned scope also permits editing/deleting and would lose delegated calendars; calendar.app.created restricts work to calendars the app creates. The 0.7.0 rescheduling boundary has focused validation below; future mutation paths need their own review. [Google Calendar scopes](https://developers.google.com/workspace/calendar/api/auth), [event insertion](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert).

## Data handling

| Data | Handling |
| --- | --- |
| Google access tokens | New broker path: transient hosted exchange/refresh, then browser-memory/session storage. Legacy Chrome path: browser identity cache. Neither enters workspace settings, event logs, backups or Git. |
| Fetched calendars/events | Held in session memory and displayed when needed; not stored in SlotDesk settings. Disconnect clears session state, editors and calendar-derived DOM. |
| Profiles, contact emails, mappings, constraints, travel, preferences | Persist in extension localStorage, separated by connected account. These may contain sensitive scheduling information. |
| Prepared unfinished outgoing invitation | Persists for duplicate-safe recovery, including title, attendee emails, times, location/description and identifiers. Removed after confirmed completion. |
| User-authored review drafts and connection state | Review fields persist locally to continue across windows/reload. Connection notification contains account, connected flag and nonce; no token. |
| Pending existing-meeting edit | User-authored new text and explicit guest additions/removals/role changes, target IDs/version/time and fingerprints persist for recovery. Original fetched text, full roster metadata and tokens do not. Removed on confirmed completion. |
| Suggestion candidates | Minimal derived name/email/rank cache, account/scope isolated with sliding 30-minute expiry; raw events remain in memory. Cleared on disconnect, scope/access change and Clear Data. |
| Calendar-change alerts | Up to 20 local result records with meeting title, identifiers, verification status and timing. Polls only read the exact target and account metadata; no calendar write occurs without explicit confirmation. |
| Display clock/appearance | Browser-wide preferences. |
| Registration backend | The onboarding fields and reported browser label go to an insert-only Vercel/Neon intake; no calendar payload or credential is included. No email reader or model service is implemented. |

Local settings and pending invitations are **not encrypted by SlotDesk**. Account namespaces prevent accidental mixing in the app; they do not isolate data from someone controlling the same browser profile, operating-system account or device. Use an appropriately protected browser/device for workplace data.

The packaged [privacy notice](../extension/privacy.html) is accessible through Help before and after connection.

Disconnect clears the current background/session credentials and, for the native Chrome path, Chrome's cached tokens through identity; it does not remove Google's existing consent grant or saved settings. Loaded data is cleared from the current window; other open same-account SlotDesk windows receive the disconnect notification and clear their displayed session too. Settings → Clear saved SlotDesk data removes the connected account's saved workspace after any unfinished send is resolved; it does not delete Calendar appointments. Remove the app grant separately through Google account controls if access must be revoked.

Calendar text is escaped or inserted with textContent. Receipt links are restricted to HTTPS Google Calendar/Meet hosts. Manifest CSP restricts extension scripts; there are no content scripts, external messaging bridge or web-accessible resources. Reader/writer fetches reject redirects and omit cookies, referrers and cache reuse. Never add tokens, client secrets, real calendar exports or private screenshots to Git. The extension key and OAuth client ID are public identifiers.

## Review and validation evidence

A standard source review completed against **0.3.5 at commit 330114f69fad9ea55c00383b577484da7fa95d92**, scoped to apps/slotdesk. The independent baseline read all 30 text files; four WOFF2 fonts were inventoried but their binary parser internals were outside the audit. Architecture and focused validation passes supplemented the review. No reportable attacker-supported vulnerability was established. Coverage remained partial because runtime density, cleanup/shared-calendar correctness and organization/account behavior needed follow-up. This is not a claim that the 0.4.0 diff or workplace deployment received exhaustive security certification.

The review identified correctness/hardening work addressed in 0.4.0: shared-calendar RSVP ownership, disconnect editor residue, fresh account checks on recovery/video readback, saved-request validation and multiple-window coordination. The source now includes method/payload/redirect guards. The [1346 automated checks and browser checks](testing.md) verify synthetic behavior, including 6,000 paginated events and 2,000 unchanged existing meetings. No real account or invitation was used by the agent for this update.

The sealed scan report remains a local audit artifact. This product record summarizes its source boundaries and useful conclusions without publishing machine-specific audit metadata.

## Work-account use

The owner reports working basic creation, No-response alerts, sensible replacement proposals, a successful actual reschedule and correct overlap details. Automated/source evidence remains separate from those reports. Unperformed live edge cases are not described as passed.

Work-account access depends on the organization allowing the extension and requested Google scopes/data handling. The current product has no backend or cloud settings database. A protected browser/device remains necessary for locally stored workplace information.

The earlier dense-calendar creation/export comparison preserved all 1,013 original event components and added exactly one reviewed event. No new export was provided after the reported reschedule, so this record does not claim independently verified post-reschedule preservation of every existing event. Raw evidence remains outside Git.

## Focused calendar-write recheck — 13 October 2026

The actual network entry points were reread after the live report. The reader uses GET and non-mutating free/busy POST. The creation writer allows GET and new-event insertion POST. The separate rescheduler allows GET and a selected-event PATCH with only validated start/end fields. Neither writer has a DELETE, full-resource PUT, cancellation or calendar-move operation; neither deletes/recreates an appointment while rescheduling.

The selected calendar/event identity, current times, organizer-copy permission and ETag are checked before PATCH. Other existing appointments are not updated automatically. Resetting saved workspace data only clears local settings, not Google meetings. Google's underlying calendar.events grant is broader than the application; these restrictions are enforced by the current code.

The existing 112 rescheduling, 70 booking and 69 safety checks were rerun and passed (251 total), with synthetic transport and no real calendar writes. They exercise rejected unsupported fields, stale/changed targets, permission loss, single-instance targeting, retained non-time fields and unrelated events, and same-operation recovery.

## New existing-event boundary in 0.7.0

The rescheduler validates account/calendar/event IDs, exact allowed plan fields, date formats, increasing times, occurrence identity and a quoted ETag before obtaining a token. Every GET/PATCH obtains the same account-validated token supplier as creation. PATCH refreshes write permissions, targets the selected ID, sends only start/end, uses If-Match and requests guest updates. It has no DELETE/PUT/calendar-move method. Organizer-copy, locked-event and individual-occurrence checks precede mutation. Stale versions fail rather than overwriting another edit. Network uncertainty retains a saved operation and reads back the same ID; confirmed target times avoid another PATCH.

The pending record contains identifiers, version and before/after times only. Decline tracking stores guest emails/status/acknowledgement/expiry; collision follow-ups store target IDs and a protected interval. None is a content cache or token store. This metadata is local and unencrypted, account-scoped like other settings. Reset is blocked by either type of unfinished write.

The new tests verify forbidden fields before network, stale identity/version, revoked roles, HTTP 412, timeout/lost-response recovery, duplicate sends, single recurring-instance targeting, all-day format and preserved non-time fields. The previous exhaustive-scope claims are not extended: this is focused implementation verification, not a new exhaustive security audit. A successful source/mock check cannot guarantee that other Google clients will not change attendee calendars between availability read and confirmation.

## Guest/detail boundary in 0.7.1

The editor permits GET and selected-event PATCH only, rejects unsupported plan/payload fields before token/network access and binds to unchanged event/occurrence identity and time. PATCH uses If-Match and sendUpdates=all. A fresh account/CalendarList check precedes each operation; write role is checked again after token acquisition. Partial/omitted, in-progress or unsupported guest data cannot enter a roster replacement. Retained writable attendee metadata comes from the freshly read event; only the reviewed delta is applied. Removing all guests explicitly still retains the organizing event. Guest removal may withdraw that invitation from guest calendars, which is explained in review; no deletion endpoint is invoked.

The 125 editor checks cover retained responses/comments/resources/additional guests, all-guest removal, untouched protected fields and unrelated events, malformed intent, stale identity/version, role revocation, HTTP 412/401, lost-response recovery and coalesced requests. Synthetic browser coverage includes add-profile, review, save, reload recovery and peer cache updates. This is focused validation, not a new exhaustive security audit or a claim about real Google notification delivery.

## Future BYOK LLM boundary — not implemented

The [optional LLM plan](llm-assistance.md) would let users supply a model API key and send selected scheduling context to their chosen provider. This changes today's local-only data boundary and needs explicit data/permission controls before implementation. Key entry does not grant Gmail access, email-send permission or autonomous Calendar writes. Provider terms, protected key handling, data minimization and direct-versus-relayed requests remain undecided; do not put keys into current plaintext workspace settings, prompts or logs.

Untrusted email/appointment text must remain task data, with no authority to change tool permissions or expose credentials. Model results go through schema and deterministic rule validation. Any future direct-creation policy must retain account/access checks, fresh scheduling validation, duplicate/uncertain-result recovery and the application's existing deletion/cancellation/move exclusions. This is a future design boundary, not an implemented feature or a completed audit.

## Calendar scope and draft guests in 0.8.0

The new scope guard rejects excluded event/detail/free-busy requests before network access, rechecks pagination, and discards stale reads when account/scope/generation changes. Calendar-list metadata is permitted for authentication/source choice. Removing a source clears fetched/derived session data and peer meeting lists; saved inactive mappings remain. The underlying Google consent grant is unchanged and broader than this application selection. Existing users confirm scope before event loading; exact account-bound pending-operation recovery is the sole pre-confirmation exception, preserving same-target recovery rather than abandoning an uncertain write.

Temporary email guests, confirmed meeting-only timezones, attendee provenance and explicit meeting preferences persist locally for draft continuation and are cleared after confirmed creation/new draft. They contain user-authored contact/rule information and are unencrypted like other local settings. New profile defaults use the store's allowlist. No token/event content cache, backend, email access or LLM is introduced.

The 71 new synthetic policy/model/engine checks cover excluded reads, free/busy, interrupted pagination, pending-target recovery, scope/default validation, multi-person maps, removal/manual exceptions, guest persistence/promotion and independent convenience/overlap rules. The mocked browser flows created two reviewed events for exactly the selected recipients and preserved all eight original appointments, with zero deletion/move/full-replacement requests. Peer exclusion cleared displayed data and reloaded permitted sources. This is focused validation, not an exhaustive security audit or actual Google delivery evidence.

## Recovery/registration boundary in 0.9.0 preview

The event writers retain their GET/new-event POST and narrow conditional PATCH allowlists, identity binding, stable operation IDs, reservations and send locks. There is no delete/move path. Read cancellation never claims to cancel a request already sent to Google. Manual resolution keeps the original operation, records an EA report rather than provider confirmation, and provides no resend shortcut from history. Unreadable local storage is not overwritten automatically; recovery records/drafts remain unencrypted local data as documented in Privacy.

Fetched cache details are removed on confirmed access loss/downgrade. Eligible transient-failure copies remain only in session memory, labelled stale and excluded from confirmed availability/fresh response processing. Fresh evidence is required before clearing collision follow-ups.

The registration handler accepts five required bounded fields plus an optional onboarding UUID and allowlisted browser label, exposes no read/update/delete API, omits submitted-value/error logging, and uses a dedicated insert-only database role. SQL privilege inspection confirmed no SELECT/UPDATE/DELETE. A unique onboarding UUID and conflict-do-nothing insertion preserve each submission; repeated emails are allowed for separate onboardings. Older five-field clients derive a stable retry key from email and completion time; old browser values are Unknown. Browser names can be masked and are not authentication. Extension-origin CORS is not user identity authentication; coarse per-instance throttling is not distributed abuse protection. Public distribution still requires the documented hosting/abuse and privacy review. The owner configured server secrets directly in Vercel, and the endpoint is deployed. Public preflight/input/origin/method checks passed, and an isolated Neon branch verified insertion and duplicate preservation using the deployed source. No synthetic contacts were inserted into the live leads table. The first real registration through the updated extension remains to be observed; see [deployment evidence](registration-deployment.md). This is focused implementation validation, not an exhaustive new security audit.
