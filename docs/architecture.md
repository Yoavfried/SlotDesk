# SlotDesk architecture

Version 0.9.0 preview is a static Chrome side-panel application with a shared browser/Node scheduling engine and a separate insert-only registration service. The service/table are prepared; endpoint activation is pending hosting permissions. Saved workspace settings and calendar processing remain in the browser. A loopback HTTP preview shows the disconnected interface; calendar sign-in uses Chrome extension identity. Synthetic fixtures are used only in development tests.

| Module in `extension/` | Responsibility |
| --- | --- |
| `slot-desk-engine/slotdesk-engine.js` | Validation, constraints, candidate generation, ranking, fallback groups and overlap/replacement suggestions |
| `slot-desk-engine/google-adapter.js` | Normalize supplied calendar/event data and preserve visibility, response and recurrence identity |
| `slot-desk-engine/google-reader.js` | Google REST reads, calendar coverage, pagination, recurring instances and explicit failures |
| `slot-desk-engine/google-auth.js` | Chrome identity token access, scope checks, invalidation and disconnect |
| `slot-desk-engine/google-writer.js` | Prepare, create and verify new events; validated create payloads, stable-ID recovery, cross-window send locks and video status |
| `slot-desk-engine/workspace-model.js` | Email-based profiles, schedule modes, display formatting, explicit participant selections, profile search and suggested contacts |
| `slot-desk-engine/workspace-store.js` | Allowlisted browser persistence, separated by Google account, with revisions that reject stale writes |
| `slot-desk-engine/calendar-browser.js` | Account/range-scoped memory cache, bounded parallel reads, multi-calendar filtering and source-specific incomplete states |
| `slot-desk-engine/calendar-view.js` | Validated read-only date windows, raw event filtering, all-day boundaries, origin tags and RSVP labels |
| `prototype/app.js` | Setup, workspace navigation, meeting browsing, profiles, search, coverage, review and explicit sending |
| `prototype/background.js` | Chrome side-panel entry point |
| `fonts/` and `brand/` | Local design-kit fonts, licensing and wordmark/handoff styles |

See the [engine API](engine-api.md) for scheduling semantics and request shapes.

## Google identity and permissions

The manifest pins a public extension key and OAuth client ID, preserving extension ID `blpliafbiiidhcffegochddjhagkhhip`. Neither identifier is a client secret. Do not add a secret to the extension.

The scope set is `calendar.events`, `calendar.calendarlist.readonly` and `calendar.events.freebusy`. The event-writing scope supports new invitations on writable/delegated calendars, but Google also grants update/delete authority. The application restricts its own operations; the OAuth grant is not a provider-enforced create-only permission. Calendar visibility remains permission-dependent and is represented by coverage status.

The writer uses `events.insert` with `sendUpdates=all` and `conferenceDataVersion=1`. This creation writer does not use event update/delete/move endpoints. The separate rescheduler uses a reviewed time-only PATCH; the 0.7.1 editor uses an independently validated detail/guest PATCH. Event success and Meet readiness are handled separately. The writer accepts GET readback and POST insertion only, rebuilds allowlisted creation payloads, and rejects cancellation, recurrence and other unsupported event fields. Requests reject redirects and omit cookies, referrers and cache reuse.

The owner configures Google Calendar API access, the appropriate OAuth audience and approved pilot users, and a Chrome extension OAuth client matching the pinned extension ID. `setup.html` and `configure-google.js` remain owner tools for a separately configured build. The tester handoff does not require Cloud setup. Public distribution requires separate Google and target-organization acceptance.

## Meeting browsing

The workspace opens at a menu, with separate new-meeting, existing-meeting and profile views. Meeting browsing uses raw `google-reader.readSource` entries rather than availability-normalized busy events, so declined invitations, transparent events and all-day notes remain visible. Recurring instances come from the existing paginated reader. The default calendar is the initial selection; subsequent calendar/date filters are saved locally. Start/end dates remain on one row with no arbitrary range-duration cap. A searchable multiple-calendar picker filters a merged chronological list, retaining source-calendar identities; loaded lists render in batches of 50.

The calendar-browser cache queries UTC date bounds padded by two days, covering any display-timezone change without another fetch. It filters timed events by exact local-date overlap and all-day entries by date/exclusive-end semantics. Stale async results are discarded on navigation, filter change, account change and disconnect. Busy-only access exposes intervals without fabricating meeting details; failed/partial/invalid reads remain explicitly incomplete.

An origin tag requires a matching private `slotdeskRequest` marker and stable ID or iCalUID. The marker is a display hint, not write authority; imported copies without preserved metadata may not carry the tag. Provider text is escaped and rendered as text, including descriptions; calendar/Meet links use the existing HTTPS host allowlist. Guest responses come from Google, with omitted lists and unknown values marked explicitly. Browsing itself adds no event mutation or OAuth scopes; its explicit rescheduling action uses the separate guarded boundary described below.

## Booking and recovery

Slot selection opens review. Time/attendee edits require rechecking; the final send refreshes calendar permissions and availability. Changed warnings pause for another explicit action. Every retained attendee is included, with optional flags preserved.

A UUID-derived event ID identifies one prepared invitation. The writer deduplicates in-flight creation and checks the same event after an uncertain response or duplicate-ID result. An unfinished request is saved before writing and remains unchanged while the outcome is uncertain. On reload, the EA can resume the same send instead of creating another invitation. Recovery requests are validated and bound to their saved account. Every writer read/write confirms the current primary account before proceeding. Web Locks serialize sends across the panel and full workspace; account-scoped three-way merging reconciles compatible changes, while same-field conflicts require an in-place choice. The workspace lock revalidates reviewed inputs before reserving a send, and the shared send lock prevents competing copies. Missing lock support fails closed with a manual-copy option.

## Local data

Profiles, calendar mappings, constraints, preferences and prepared unfinished invitation details persist locally, separated by Google account. The display clock/theme preference is browser-wide. Fetched source events and access tokens are excluded from application persistence; Chrome manages sign-in token caching. Stored settings and unfinished invitation details are not encrypted by SlotDesk. Account namespaces provide separation within the app, not protection from someone controlling the same browser profile or operating-system account.

Disconnect closes dialogs, clears fetched session data and calendar-derived editor/review DOM and asks Chrome to clear cached sign-in tokens. Saved settings and unfinished invitation details remain for recovery. Reset is a separate user action and is prevented while an unfinished send needs checking.

Timezone/travel suggestions use deterministic clues and require confirmation. A clue is not proof of physical location or calendar access. No email-reading LLM or flight-update service is implemented.

See [security/privacy](security.md) for review boundaries and work-account use.

Reference APIs: [Google event creation](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert), [Calendar permissions](https://developers.google.com/workspace/calendar/api/auth), and [Chrome identity](https://developer.chrome.com/docs/extensions/reference/api/identity).

## Same-account synchronization (0.6.0)

The new workspace-sync module merges settings recursively and profiles by ID, detects edit/delete and duplicate-email conflicts, and preserves remote pending requests on ordinary saves. Commit operations hold an account-scoped Web Lock. The UI serializes its own saves and uses storage events/focus reads to adopt shared updates. The session notification contains account, connection state and nonce only; each surface obtains its own token through Chrome identity and verifies the primary calendar account. Disconnect clears affected surfaces; account/generation checks prevent an old async result from entering a new account.

User-entered review fields are saved with a draft ID; fetched events and generated warnings stay in memory. A remote material edit disables Send until availability is checked again. Completion is associated with that draft ID, closing another surface's review. Before POST, reservation compares current shared review/profile/constraint data under the workspace lock. Pending recovery keeps the same prepared request. If completion cannot be saved after a successful create, the UI retains the request for readback rather than offering a fresh duplicate.

Known invitation commitments use matching attendee email and accepted/tentative responses in accessible primary/organizing/mapped sources. Normalized event identity deduplicates copies, and full-coverage metadata comes only from the person's mapped sources. An unmapped person remains unconfirmed even when individual commitments are known.

## Existing-meeting range cache (0.6.1)

A cache key contains the account and exact start/end dates, excluding calendar selection and display timezone. The initial load, a different date range or Refresh meetings reads every accessible calendar with at most three concurrent source reads. Ordinary selection/timezone changes perform no Calendar API call. A cold window needs its own initial load; raw fetched events are not shared through persistent storage. The cache does not expire/refetch in the background. Dates/Refresh reload the range; explicit confirmed mutations update the target entry. A confirmed peer edit triggers one target read, without a range reload.

Each source publishes progressive results and keeps its own completeness/error state. A source shared since the cache was built requires explicit Refresh; an unavailable saved selection remains visible. Stale range/account results cannot replace the current cache, and disconnect/reset clears it. The own window may upsert a confirmed created event into an already cached source without fetching. New-meeting availability and writer permission/account checks use their original fresh-read paths, never this browse cache.

Browse event pagination has no fixed page-count cutoff; request timeouts, bounded transient retries and repeated-token detection remain. The existing scheduling search's duration/range validation is unchanged. Large ranges can require many provider pages and may return explicit incomplete data if Google denies or rate-limits a read.

## Rescheduling, overlap index and alerts (0.7.0)

`meeting-management.js` provides an interval sweep/lazy detail index, shared occurrence identity, organizing-copy checks, decline transitions and acknowledgement metadata. `google-rescheduler.js` validates an immutable account/event/ETag/time plan before network access. It permits GET and a selected-event PATCH carrying only start/end with If-Match and sendUpdates=all. The UI controller owns replacement searches, exact/all-day review, missing profiles, before/after confirmation and alert/follow-up presentation.

Creation, rescheduling and editing share the account send lock. A workspace reservation checks reviewed profiles/constraints under the storage lock; ordinary three-way saves retain remote pending reschedules. A successful write updates the local browse cache. Same-account peer notifications carry only target IDs and confirmed times; fresh event versions are always read before another update. Loaded provider content remains in memory. Decline metadata and follow-up IDs persist, and the time-only pending record omits fetched descriptions/titles/guests/Meet links.

The controller reads fresh availability, excludes only the target event/occurrence and protects the selected new meeting interval while moving a collision. Occupied ranking starts with distinct appointment count. There is no bulk automatic mutation. See [accepted rescheduling behavior](rescheduling.md) for precise limitations and [Google conditional changes](https://developers.google.com/workspace/calendar/api/guides/version-resources).

## Guest and detail editing (0.7.1)

`google-editor.js` validates a separate immutable `kind: details` plan. It allows only changed summary/location/description and explicit guest deltas. A fresh full roster is projected to Google-writable guest fields before applying those deltas; retained responseStatus, comments, resources and additionalGuests survive. Because PATCH replaces arrays, a partial/unsupported roster disables guest editing. Text-only changes omit attendees entirely. The event time is part of the identity guard and never enters this PATCH payload.

`prototype/meeting-editor.js` handles the form, profile picker, before/after review and fresh guest-availability warnings. Pending recovery stores user-authored new text, explicit guest delta, IDs/version/time and SHA-256 before/after roster fingerprints; it omits original fetched text, full guest metadata and tokens. A matching readback completes without another PATCH. The shared pending-write slot and account send lock prevent simultaneous creation/time/detail mutations. Storage comparison ignores object-key ordering while preserving array order and real value changes.

A completion notice to another window contains only operation/calendar/event IDs. That window reads the target once and updates its own memory cache and observed responses. There is no background polling or fetched-content persistence. See [editing behavior](meeting-editing.md).

## Future LLM integration — documentation only

The owner requests optional user-supplied LLM API keys, prepared task prompts and the cheapest reliable model per task. Email/appointment extraction, drafting/reading availability inquiries, factual scheduling explanations and future direct creation are recorded in [LLM assistance](llm-assistance.md). Availability emails are parked and possibly BYOK-only; that choice is unconfirmed.

A future model adapter would return structured facts/action proposals to deterministic validation. It would not receive Calendar/Gmail tokens or bypass the engine/writer. Direct creation needs an explicitly designed automation authorization mode, fresh rule/access checks and duplicate-safe recovery. Provider/model selection, protected key storage, direct versus relayed calls, email permissions and any submission service remain undecided. Version 0.8.1 has none of these LLM modules, services or permissions.

## Selected calendars and participant state (0.8.0)

`workspace-policy.js` validates explicit calendar selection/defaults and guards event/free-busy transports, including pagination and selected-event operations. Metadata reads remain available. Scope changes invalidate account-scoped in-memory/derived content; the exact reviewed pending target is the only pre-confirmation recovery exception. Excluded maps persist as inactive references.

`workspace-model.js` resolves saved profiles plus temporary draft guests, independent per-meeting rules and automatic/manual/removed participant provenance. The store allowlists new saved convenience/overlap defaults; draft data remains account-local and clears after confirmed creation/new draft. `timezone-picker.js` provides one searchable closed-choice control over native option values across static and dynamically rendered forms. The deterministic engine separates usual-hour penalties from other inconvenient periods and permits only disclosed ordinary finite-cost clashes for explicitly enabled people. Hidden busy time is not automatically treated as ordinary.

The [implemented UX](onboarding-and-profiles.md) retains existing API writers, immutable recovery and OAuth identity/scopes; there is no new backend or email/LLM access.


Version 0.8.1 adds presentation-only date ordering in the browser-wide `slotdesk-display` preference. Date inputs/storage and engine instants are unchanged. Calendar selection retains the existing scoped API policy and pending-operation checks; Settings return/discard only controls the local dialog draft. Own-profile removal is blocked in the editor UI/handler. Calendar metadata is rendered as escaped text. No new provider, permission or event mutation is introduced.


## Recovery and registration boundary

`recovery.js` classifies read/write/auth outcomes and defines manual-resolution history. `recovery-ui.js` separates read-only checking from deliberate retries. The browse cache retains eligible stale copies only in memory, purges confirmed lost/downgraded details and cannot establish fresh scheduling coverage. Aborted reads and pending writes are separate operations.

`leads.js` prepares the exact five-field record, captures completion time once and queues failures in account-bound settings. `backend/api/leads.mjs` validates and inserts through an independent Neon role. No Calendar token, event source or other person's profile is passed to it. `service-config.js` is currently unconfigured. The [operator guide](../backend/README.md) describes activation and exact-origin host/CSP configuration; the endpoint receives no administrator secret from the extension.
