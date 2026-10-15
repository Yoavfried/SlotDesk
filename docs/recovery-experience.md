# Connection, permissions and recovery experience

Accepted direction: **15 October 2026**. The owner accepted the proposed failure/recovery recommendations and the three follow-up recommendations below. The recovery implementation is in the **0.9.0 preview**; the inventory below remains the accepted behavior contract. Existing guarded writes, token renewal, limited read retries, incomplete coverage and pending recovery are the baseline. No new live-test checklist is assigned.

## Accepted principles

- Preserve saved profiles and entered drafts through recoverable failures. Keep account boundaries and clear fetched calendar data on disconnect/exclusion or confirmed access loss.
- Place actionable errors beside the affected operation. Do not restore the removed generic latest-action row or duplicate warnings in several large panels.
- Distinguish not sent, definitively rejected, uncertain outcome and confirmed success. Check result and Retry sending are separate actions/concepts.
- Unknown/outdated availability never means free time or an empty calendar. Retain the accepted ability to propose visibly unconfirmed times from stated availability/profile rules.
- Automatically renew tokens and retry eligible reads within bounds. Restored connectivity/reconnection must not automatically send a blocked invitation.
- Preserve the exact account/calendar/event/operation identity for recovery; never delete/recreate appointments to recover a change.

## Three accepted policy recommendations

1. Allow onboarding to complete with only read-only selected calendars, for the capabilities actually supported by granted permissions. Browsing/availability can work; creation requires a selected writable calendar. Implemented: a nonempty read-only selection completes setup with no default invitation calendar.
2. Retain the last successfully loaded meetings in the current window after a transient refresh failure, marked outdated with last-successful-check time. Do not persist fetched calendars for offline storage. Exclusion, disconnect and confirmed loss of access clear the affected data.
3. Provide explicit manual resolution if an uncertain write cannot be checked after permanent access loss. Preserve the operation record and distinguish EA-reported result from Google-confirmed result. Manual resolution must never silently retry or mark an unverified action successful. Implemented: explicit acknowledgement, separate reported-found/unverified status, exact operation history and no resend action from history.

## Situation inventory and intended UX

Identifiers preserve the reviewed conversation so future implementation can refer to a specific case.

| ID | Situation | Accepted direction |
| --- | --- | --- |
| A1 | Sign-in closed | Quiet incomplete connection; Connect remains available. |
| A2 | Required permissions declined | Explain missing capability; Review permissions; no repeated prompts. |
| A3 | Wrong account | Show actual email; account-change help; no workspace mixing. |
| A4 | Expired access | Silent renewal first; continue eligible read on success. |
| A5 | Interactive renewal needed | Preserve draft/screen; Reconnect beside blocked action; no automatic send. |
| A6 | Known workplace block | Explain administrator action only when cause is known. |
| A7 | Unknown Google access block | Neutral connection failure; targeted Help without invented diagnosis. |
| A8 | App Google configuration failure | Explain owner/support action; no Cloud setup instructions in normal user flow. |
| A9 | Calendar list fails after authentication | Connected but unable to load calendars; Try again; not an empty list. |
| B1 | Shared calendar access lost | Mark unavailable; retain mappings; unaffected sources continue. |
| B2 | Editable becomes read-only | Keep allowed reads; remove write capability with explanation. |
| B3 | Busy-only access | Show intervals; explain absent details/responses. |
| B4 | Calendar disappears | Unavailable, not presumed deleted; keep mapping for EA review. |
| B5 | Default invitation calendar unavailable | Preserve draft; choose writable replacement and review automatic participant changes. |
| B6 | All selected sources read-only | Supported browsing/availability mode; no creation until writable selection. |
| B7 | Mapped calendar excluded | Explain Settings exclusion and link selection; not a sharing error. |
| B8 | New accessible calendar | Offer in selector; do not opt it in automatically. |
| B9 | Calendar renamed | Refresh name; stable ID retains mappings/selection. |
| B10 | Excluding unresolved operation's calendar | Explain operation dependency; Check unfinished change first. |
| C1 | Slow normal read | Local progress, responsive interface, stop read. |
| C2 | Very large range | Actual progress, Stop loading, editable range; no arbitrary new range cap. |
| C3 | Confirmed offline | Honest offline indication; keep supported local editing; no send. |
| C4 | Google unreachable for unknown reason | Could not reach Google; do not assume internet loss. |
| C5 | Temporary provider failure | Bounded read retries, then Try again; keep draft and other sources. |
| C6 | Partial source success | Show loaded meetings; identify failures and unconfirmed participants. |
| C7 | Refresh fails after success | Keep authorized in-memory older list, explicitly stale. |
| C8 | Pagination interrupted | Partial data never establishes complete coverage/free time. |
| C9 | Unreadable events | Identify incomplete verification rather than silently skipping and declaring complete. |
| C10 | Temporary rate limit | Backoff; prevent retry floods; countdown only with a supportable time. |
| C11 | Longer quota/invitation limit | State known limitation; Help/support; no false short-wait promise. |
| C12 | Connectivity returns | Retry eligible reads; writes still need deliberate confirmation. |
| D1 | New conflict before send | Keep time; updated warnings and effective-policy-based proceed/search choice. |
| D2 | Other window changes profile/constraints | Explain change; fresh review; no silent superseded rules. |
| D3 | Organizing access disappears | Preserve invitation; block send; choose other calendar. |
| D4 | Appointment version changes | Load latest and compare proposed change; fresh review. |
| D5 | Target no longer readable | Keep copyable proposed details; no unverifiable update. |
| D6 | Incomplete guest roster | Supported text edits remain; roster changes disabled; open Google Calendar. |
| D7 | Partial availability at review | Preserve visibly unconfirmed proposals, naming affected people/missing coverage. |
| E1 | Validation/recovery save fails before network write | Explicitly not sent; editable draft and remedy. |
| E2 | Definitive provider rejection | Explain rejection/remedy; preserve draft; distinguish uncertainty. |
| E3 | Timeout/lost response during write | Unknown result; Check result, not a second creation. |
| E4 | Exact intended result found | Confirm completion without duplicate write/notifications. |
| E5 | Creation absent and access verified | Fresh validation and explicit same-invitation retry. |
| E6 | Target subsequently changed | Show current state; no assumption previous change failed; new review. |
| E7 | Recovery blocked by revoked access | Preserve unresolved record; explicit manual-resolution path. |
| E8 | Popup closed during write | Operation remains accessible; closing is not provider cancellation. |
| E9 | Browser closed/disconnected during write | Recover with same account/operation on return; no assumed cancellation. |
| E10 | Provider success but local completion-save failure | Explain calendar success and unfinished local recovery; retain same identity. |
| F1 | Created; Meet link pending | Separate event success/link pending; Check link. |
| F2 | Created; Meet fails | Event remains; open Google Calendar to add link; no duplicate meeting. |
| F3 | Provider accepts; guest reports missing email | Show calendar result/guest state; no claim of inbox delivery or blind resend. |
| F4 | Guest-response refresh fails | Last known responses with freshness; no invented No or erased known decline. |
| F5 | Collision cannot be edited by account | Keep follow-up, coordinate with organizer, no automatic move/cancellation. |
| F6 | Collision already moved elsewhere | Resolve follow-up only after verifying collision is gone. |
| F7 | Return after long gap | Honest freshness, fresh pre-write checks; preserve accepted browse refresh/date-change behavior. |
| G1 | Profile/settings save fails | Unsaved indication, retained editor, Try saving again. |
| G2 | Storage unavailable/full | Preserve input where possible; no write without durable recovery record. |
| G3 | Saved workspace unreadable | Preserve original data; recovery/help before explicit reset. |
| G4 | Double-click Create/Save | One operation and its progress, no second request/technical lock error. |
| G5 | Another window writes | Explain busy operation; keep draft; browsing remains available. |
| G6 | Concurrent same-field edits | Show differing values; explicit choice; preserve versions until resolved. |
| G7 | Account changes with form open | Stop old action; retain account-bound draft; correct-workspace review. |
| G8 | Older window after update | Require reload if incompatible; preserve recoverable draft. |
| G9 | Browser data cleared/uninstall | Truthful local-data loss limits; Google events remain separate. |
| G10 | Other device/browser profile | Explain local setup; do not promise cross-device sync/recovery. |

## Implementation and evidence — 0.9.0 preview

| Cases | Implementation/evidence |
| --- | --- |
| A1–A9, B1–B10 | Shared typed errors; quiet sign-in cancellation; explicit permission/configuration/known organization causes; coalesced token access and same-account reconnect. Calendar-list errors remain errors rather than an empty list. Stable IDs, selected-source controls, preserved mappings and read-only onboarding. Lost/downgraded sources purge fetched details and derived views; outgoing pending records remain account-bound. |
| C1–C12 | Reader cancellation through requests and retry waits; bounded concurrency/pagination progress; offline indicator; bounded retries and shared Retry-After pause; daily quota is not treated as a short rate limit. Stale browse entries remain in memory with last-check information only after eligible transient failures; failed/partial sources cannot establish complete availability. Online events may refresh reads, never writes. |
| D1–D7 | Existing fresh availability/rule checks and before/after reviews remain mandatory. Updated appointment reviews retain proposed time/text, and copied outgoing details remain available when access is lost. Unsupported rosters still block guest changes. Same-account reconnect keeps the draft; account switches do not merge workspaces. |
| E1–E10 | Durable operation reservation before writes; unchanged narrow POST/PATCH/If-Match guards. Check result is read-only. A missing creation permits a separate reviewed retry only after calendar access verification. Changed target versions cannot use the stale retry. Explicit manual resolution retains the exact record and distinguishes EA reports from provider confirmation. Local completion-save failure retains same-target recovery. |
| F1–F7 | Existing event/Meet separation and guest-response display remain. Failed refreshes do not erase known No responses or imply no alerts; last-check/fresh-load states are explicit. Collision follow-ups clear only on fresh evidence, including configured blocked radii; uneditable appointments remain coordination work. |
| G1–G10 | Existing revision/conflict UI and send locks remain. Unsaved input stays available on save failure; unreadable original storage is preserved with retry/download and acknowledged reset. A newer workspace version blocks older guarded builds from saving. Local-device and browser-data-loss boundaries are documented in Help/Privacy. |

New tests cover typed error outcomes, quota/backoff/cancellation, read-only setup, stale retention/access-loss purging, exact registration and manual history. Existing booking/editor/rescheduling suites continue to cover identity, conditional writes, recurrence, unrelated-event integrity and cross-window reservation. Mocked browser checks cover first-run read-only setup, old-user registration, transient failure, access loss/reconnect, manual resolution and corrupt storage preservation. No new live Google or recipient-delivery claim is made.

Limits: the version guard applies to builds that contain it; close/reload older extension windows during an update. A manually reported result is not proof of provider success or failure. If an operation is unverified, creating a different operation can still duplicate a change already made in Google. The UI requires acknowledgement and preserves the original record instead of silently deciding the result. The independent [leads intake](leads-table.md) remains pending hosting activation.

Provider references: [Calendar errors](https://developers.google.com/workspace/calendar/api/guides/errors), [Chrome identity](https://developer.chrome.com/docs/extensions/reference/api/identity), [conditional updates](https://developers.google.com/workspace/calendar/api/guides/version-resources).
