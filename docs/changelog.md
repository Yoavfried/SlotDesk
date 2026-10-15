# SlotDesk changelog

## 0.9.1 — 15 October 2026

- Block new meeting, existing-meeting editing and rescheduling while the browser reports no connection. Keep saved profiles and drafts.
- Put unconfirmed calendar writes in the bell. Check only the saved operation/account/target automatically, starting after five seconds and backing off through 15, 30, 60 and 120 seconds to five minutes. Honor longer provider Retry-After pauses; pause offline and resume after reconnect/reopen. Existing send locks coordinate windows.
- Confirm success without another write. Require two successful absent/unchanged readbacks before offering Try again. A changed version or inaccessible target stays unresolved for review; explicit retries reuse the original identity and repeat normal fresh checks. Developer issue reporting remains deferred.
- Remove the permanent recovery-history shortcut from Settings; retain existing manual reports and the exceptional unresolved-operation review.
- Save main Settings preferences immediately. Remove its footer/save button, place Clear Data at the bottom of the scrollable body and slightly increase the shared Settings/calendar popup height. Calendar selection keeps Save/Discard and returns to Settings. The default invitation calendar is selected only in main Settings; excluding it never silently picks another.
- Fix the wordmark size/header height across widths. Stack Edit above Travel & flights, paginate saved profiles five at a time and place live search directly above the list.
- Show six equally sized familiar-person suggestions in two or three columns. Remove manual refresh; reuse an account/scope-isolated local candidate cache with a 30-minute expiry extended by each entry to Manage profiles. Cache minimal names/emails/rank metadata, never full events, and clear it on disconnect, scope/access change or Clear Data.
- Remove the Manage profiles shortcut from New meeting. Keep its saved-profile picker closed on entry and close it on selection, Escape or leaving the picker.
- Validation: 1,564 synthetic application checks, six intake tests and 22 export-comparison checks, plus local browser checks at 320/390/680/1200 pixels. Mocked lost confirmations covered creation, editing, rescheduling and repeated explicit retries without duplicate writes. No real Google sign-in or invitations were used.

## 0.9.0 — 15 October 2026 · preview

- Add shared connection/access/rate/quota/error states, coalesced token renewal, bounded read backoff and cancellation, same-account reconnection without automatic sending, and read-only calendar onboarding.
- Retain authorized in-memory meeting lists after transient refresh failures, label outdated data and last successful checks, and clear details on confirmed access loss or permission downgrade. Keep incomplete/stale data out of confirmed availability and response observations.
- Separate read-only Check result from explicit reviewed retries. Add acknowledged manual resolution with an immutable operation record in recovery history, while preserving account/identity/version and cross-window write guards.
- Preserve unreadable saved workspaces for retry/download before explicit reset; reject saves from incompatible older builds. Retain proposed details when refreshing changed appointments and verify collision follow-ups before resolving them.
- Add the agreed five-field onboarding registration, an unchecked optional updates choice, a private Neon leads table and an insert-only intake implementation. No newsletter or email-sending feature.
- Activate the private registration service on Vercel after manual server-environment setup. Configure the exact HTTPS endpoint and extension permissions; retain queued retries when unavailable. Verify request rejection on the public endpoint and insertion/duplicate preservation on an isolated Neon branch. No synthetic contacts were added to the live table.
- Validation: 1,420 synthetic application checks, six intake tests, 22 export-comparison checks and mocked browser checks for registration, read-only setup, stale/access-loss/reconnect behavior, manual recovery and unreadable storage. Eight original synthetic meetings remained unchanged; no real Google sign-in or invitations.


## 0.8.1 — 14 October 2026

- Simplify calendar selection into single-line checkbox/name/info rows, with truncation, complete metadata in a separate dialog and the selection count below the list. Apply the agreed explanation/default-calendar copy.
- Give Settings and calendar selection identical popup dimensions and fixed action bars. Save calendars, Discard changes, X and Escape return to Settings with unsaved display choices preserved; first calendar setup cannot be dismissed or completed without valid sources/default.
- Keep the own profile first in Manage profiles and prevent its removal. Keep long emails contained and action labels on one line.
- Remove duplicated appearance/profile shortcuts from Settings; retain the dark-mode toggle and add Day first/Month first date display independent of 24-hour/AM-PM. Apply date order to proposals, warnings, meeting lists/details, rescheduling, edit summaries, receipts and copied full dates without changing stored dates or year visibility.
- Validation: 1,356 synthetic application checks, 22 export-comparison checks and focused local browser checks at sidebar/full-workspace sizes. No real sign-in or invitations; Google scopes, identity and event writer paths remain unchanged.

## 0.8.0 — 14 October 2026

- Add own-profile → selected calendars/default → optional familiar-people onboarding, with explicit source confirmation for existing users and preserved pending recovery.
- Move availability mappings into main profile setup, add focused Travel & flights actions and searchable timezone choices across all forms.
- Automatically include every profile mapped to the organizing calendar, preserving manual attendees/removals during switches. Add email guests without compulsory saved profiles; confirm timezone before searches and preserve temporary draft continuation.
- Add separate saved and per-meeting/search Ignore usual convenience hours and ordinary-overlap preferences. Keep protected/explicit rules and non-hour inconvenience in force; disclose clashes and prefer fewer affected appointments among equally suitable times.
- Enforce workspace calendar scope at API transports/pagination, clear excluded session data and update peer meeting lists. Keep existing Google identity/scopes and reviewed writers; no delete/cancel/move, backend, email or LLM feature.
- Validation: 1,346 synthetic application checks, 22 export-comparison checks and focused mocked browser checks. A synthetic booking preserved eight original appointments. Actual Google behavior of the new UX has not been independently observed.

## 0.7.1 — 13 October 2026

- Add Edit meeting for title, location, description and explicit guest additions/removals/Required–Optional changes, with a before/after review and Save changes & notify guests.
- Preserve retained guest responses/comments/resource/additional-guest fields; text-only edits omit the roster. Disable roster changes when the full supported guest list cannot be verified. Explain guest removal consequences before saving.
- Keep time, existing Meet, attachments, reminders and unrelated appointments unchanged; no deletion/cancellation/move endpoint or new OAuth scope. Use fresh identity/version/permission checks, If-Match, a shared write lock and immutable same-event recovery.
- Update the target in other open windows using ID-only completion metadata; fix false workspace-change detection caused by saved object-key ordering.
- Validation: 1,275 synthetic application checks, 22 export-comparison checks and focused local browser checks for editing/profile setup/reload recovery/peer updates. Real Google guest-edit notification behavior has not been independently observed.


## 0.7.0 — 13 October 2026

- Add reviewed rescheduling from Existing meetings and decline alerts, including exact times, all-day dates and single recurring occurrences. Preserve guest lists, appointment content and existing Meet links through a time-only conditional PATCH.
- Bind each change to the account, calendar, event identity and version; coordinate writes across windows and retain unfinished changes for same-event readback recovery. No delete, calendar move or automatic appointment movement.
- Show red Overlapping labels with simple expandable details across displayed calendars, including events created outside SlotDesk. Prefer proposals that require moving fewer distinct appointments, then lower disruption. Open the OTHER appointment for replacement planning and retain follow-ups after confirmed collisions.
- Add grouped No-response alerts, optional-guest context, dismissal and reschedule shortcuts. Refresh alerts during existing reads rather than polling or refetching on local calendar selection changes.
- Document DF06 meeting search by name, participants, location and written content as deferred. Update privacy, architecture, accepted UX, live acceptance and release evidence. Preserve supplied fonts, lime wordmark header, OAuth identity and scopes.
- Validation: 1146 synthetic application checks and 22 export-comparison checks; local mocked browser checks. Actual rescheduling, No alerts and overlap details were subsequently reported working by the owner; the validation record distinguishes those reports from automated evidence.

## 0.6.1 — 13 October 2026

- Replace whole-week browsing with inclusive Start/End dates on one row, without a fixed day-count limit or duplicate range caption.
- Add searchable multiple-calendar selection and an adjustable Times shown in timezone dropdown. Cards/details retain source-calendar names.
- Cache all accessible calendars for the range in memory. Selection/timezone changes filter locally; date changes and Refresh reread all sources. Keep partial, inaccessible and busy-only reads explicit; clear cache on disconnect/reset/account change.
- Remove the browse event-pagination cutoff while retaining timeout/retry/repeated-token guards. Keep scheduling/booking fresh reads and the create-only writer unchanged.
- Validation: 577 automated checks, 22 export-comparison checks and a 54-calendar synthetic browser check. No real calendar writes were made in that synthetic check.

## 0.6.0 — 12 October 2026

- Refine the live-test feedback: whole-week meeting browsing with Past/In progress, two-row cards and ordered details with saved names and actual emails.
- Add dropdown availability sources and confirmed secondary-owner suggestions; organizing calendar is visible before search.
- Prefer equally inconvenient times closest to comfort boundaries and consider valid off-grid boundary starts. Present only useful, labelled alternatives.
- Synchronize same-account panel/tab profiles, preferences and drafts, resolve concurrent edits in place, reopen saved reviews and preserve send/recovery guards.
- Use accepted/tentative known invitations as partial evidence; an unmapped guest's full availability remains unconfirmed.
- Retain supplied VT323/lime design, OAuth identity/scopes and create-only writer. Decline alerts remain deferred.
- Validation: 529 automated app checks, 22 standalone export-comparison checks and focused synthetic browser checks. Two concurrent send clicks created one event with zero update/delete requests. Live outcomes are recorded separately from these synthetic checks.

Versions apply to the Chrome pilot. Dates refer to the recorded builds. For repository-wide changes, see the [root changelog](../CHANGELOG.md).

## Further live results and scheduling review — 2026-10-12 (application remains 0.5.0)

- Record reported recipient No display and expected two-window guard behavior; the scope of actual live observations remains recorded separately.
- Reproduce the inconvenient-time tie selecting the earliest candidate and the invalid shorter/empty fallback headings using a read-only synthetic request.
- Document early organizing-calendar selection, closer inconvenient-time ranking, adaptive alternatives and synchronized panel/tab UX without losing duplicate-send safeguards. No application or ZIP changes.

## Live progress and parked UX — 2026-10-12 (application remains 0.5.0)

- Record the owner's report of a successfully invited test recipient and a visible Yes response from the owner. The recipient's No response and the remaining live checks/export are pending.
- Document the requested two-row meeting cards, ordered detail sections, organizer email and saved-profile guest names, retaining the existing popup footer buttons.
- Record a future decline alert with an EA-controlled rescheduling suggestion. No app implementation or package update; clarify that the existing two-window session can run while waiting for the guest.

## 0.5.0 — 2026-10-12

- Open the workspace at New meeting, Existing meetings and Manage profiles; retain unfinished-send recovery and unsent drafts.
- Add read-only calendar/timeframe browsing with SlotDesk origin tags, all-day/free/declined/recurring entries, event details and guest responses. Handle busy-only, unreadable and incomplete calendars explicitly; render dense lists in batches.
- Move familiar-face suggestions to optional setup and profile management; migrate configured profiles without restarting onboarding.
- Keep every dialog heading/close button fixed while its body scrolls. Remove the historical status row and duplicate green receipt; confirmed creation opens a separate dialog over the home menu.
- Clarify start-time spacing, preserve guarded new-event writes/recovery and clear new fetched-data views on disconnect. Retain the supplied logo, fonts and shared theme tokens.
- Pass 462 application checks, 22 export-comparison checks and focused synthetic browser flows. The synthetic results do not establish real-account invitation behavior.



## Live validation — 2026-10-12 (application release remains 0.4.3)

- The owner completed one self-only creation in the dense disposable calendar. The subsequent export confirms its expected time and a Meet link.
- Offline comparison passed: 1,013 original event components unchanged, no removed/changed entries, unchanged timezone definitions and exactly one new event (1,014 total). Raw exports and private event identifiers remain outside Git.
- Installed build was not separately recorded. Recipient/RSVP, permission/incomplete-read and two-window/reconnect sessions remain, followed by workplace approval before Nina’s work-account pilot.

## 0.4.3 — 2026-10-12

- Consolidate proposal warnings into one counted expandable list; retain short participant fit/conflict rows and remove repeated orange callouts.
- Deduplicate descriptions of the same overlap, preserve distinct conflicts, incomplete calendars, inconvenient times and profile-rule warnings, and use the same list in final review and copied details.
- Replace internal calendar-organizer IDs with readable owner instructions and wrap long warning text within narrow panels.
- Add 26 warning checks (420 application checks total); retain Google write/recovery behavior and the pending live creation/export milestone.

## 0.4.2 — 2026-10-12

- Shorten proposal headings to weekday/date and a time range; show years only beyond the current calendar year.
- Move date-specific GMT offsets beside the timezone and preserve midnight, year-boundary and DST context.
- Focus participant rows on fit and reasons; show local times when the participant timezone differs.
- Replace ambiguous calendar-check copy with complete/incomplete calendar-data status across all included participants; mark unknown availability clearly, including optional guests.
- Expose existing fit reasons, inconvenience minutes and conflict counts without changing scheduling rules or Calendar writes.
- Add 40 proposal/confidence checks (394 application checks total).
- Record verified fixture import/baseline and user-reported successful live search; creation and after-export integrity comparison remain pending.

## 0.4.1 — 2026-10-12

- Compact the workspace header into logo/Help/Settings and connection rows, retaining the full lime surface and original wordmark.
- Replace the separate connected badge/email/disconnect labels with a single green-dot email bubble and an accessible exit icon; keep long emails on one line.
- Remove the separate connection links row and routine connected-ready message.
- Rename the dialog Settings and move Dark mode/Open full workspace to its top; keep Follow system in Appearance options and synchronize toggle/save behavior.
- Replace connection-only help with general Help available before and after sign-in.
- Remove the workspace privacy footer; include a standalone privacy notice linked from Help and the installation guide.
- Keep Google identity, scopes, calendar-write guards and scheduling behavior unchanged.

## 0.4.0 — 2026-10-12

- Replace Theme with an accessible dark-mode toggle; retain system appearance in Settings.
- Remove product demo/scenario/simulated-send flows and the unused sample module.
- Search saved profiles by name/email, add only attendees, separate searchable profile management, and reset selections with New meeting.
- Review workspace and handoff copy, including own-profile inclusion and invitation effects.
- Restrict writer methods/payloads to new-event insertion and readback; reject unsupported cancellation/recurrence fields and redirects.
- Bind recovery to the connected account, confirm identity before writer calls, coordinate sends across windows and reject stale saved-state writes.
- Clear editor/review data on disconnect and correct RSVP handling for shared calendars.
- Add 69 safety checks (354 total), including 6,000 paginated events, 50 profiles and 2,000 existing-event integrity checks. Validate the revised browser flow with local synthetic identity/calendars only.
- Record user-reported basic live success, Google Workspace usage considerations and the planned Outlook provider. Keep email/LLM and flight API features deferred.

## 0.3.5 — 2026-10-12

- Replace autocomplete/free-text timezone fields with closed native dropdowns across profiles, search, review, availability, travel, flights and protected time.
- Group supported timezones by region and show readable place names alongside their identifiers; preserve valid saved timezone aliases.
- Keep unknown timezones unselected until the EA chooses one, and retain Jerusalem working-day template behavior.
- Record timezone selection as UX21 and focus the next milestone on Nina’s real-calendar acceptance.

## 0.3.4 — 2026-10-11

- Integrate the complete pilot into the organized repository at `extension/`.
- Make the handoff/owner guides suitable for approved pilot testers generally and keep acceptance and scope-update links self-contained in the package.
- Add root-level preview, validation and reproducible ZIP packaging commands.
- Consolidate current decisions, implementation status, future features, design references and release history.
- Retain the configured OAuth identity, extension key, scope set, reviewed booking behavior and 0.3.3 visual design.

## 0.3.3 — 2026-10-11

- Render the supplied VT323 wordmark without a separate background box.
- Apply lime `#D8E84A` to the full workspace/help/setup header, with readable header controls in light and dark appearance.
- Preserve the neutral working interface below the header.
- Validate light, dark and 390px layouts; 78 calendar-pilot checks passed.

## 0.3.2 — 2026-10-11

- Align application typography, spacing, components, light/dark tokens, focus states and motion behavior with `style-guide.html`.
- Retain the guide's system-font working interface and terminal-style handoff page.

## 0.3.1 — 2026-10-11

- Bundle the supplied VT323 and IBM Plex Mono fonts and licenses locally.
- Restore the design kit's wordmark and terminal landing language in the handoff surface. The later 0.3.3 correction supersedes the logo's initial background treatment.

## 0.3.0 — 2026-10-11

- Add email-based profiles, own-profile onboarding, contact suggestions, template/manual schedules, flexible working rules, clock preferences and quick date choices.
- Add writable default-calendar setup, editable review, copy details, invitations to every retained participant and Google Meet by default.
- Recheck availability before sending and recover uncertain sends with a stable event identifier and saved prepared draft.
- Pass 285 automated checks and a focused browser flow using mocked calendars; real sign-in and invitations were not tested.

## 0.2.1 — 2026-10-11

- Prepare the configured read-only Google calendar pilot and tester handoff.
- Separate owner OAuth setup from the tester installation flow.

## Initial engine and pilot development — 2026-10-07 to 2026-10-11

- Original scheduling engine and Google adapter, with 47 baseline checks.
- Fix manual-constraint targeting, exact outside-working minutes, tentative status and per-event visibility (F01–F04).
- Implement F05–F14 scheduling decisions, Google REST reader, profile persistence, explicit coverage and prototype interactions.

The original repository commit was unversioned. This log does not assign invented version numbers to unrecorded intermediate builds. The current live and synthetic validation status is recorded in [testing](testing.md).
