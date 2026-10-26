# SlotDesk changelog

## 0.9.5.2 — 26 October 2026

- Keep the default invitation calendar optional. New and unfinished meetings open directly; choose a writable organizing calendar before searching or sending. Settings can clear a saved default.
- Require at least one selected accessible calendar before onboarding can finish, including a fresh account/calendar check at the final step.
- Render email-only guests immediately while their timezone is unconfirmed. Keep the timezone picker, per-meeting options and Create profile action; confirming a timezone does not create a saved profile. Preserve the guest through invitation review and promotion.
- Replace the custom airplane drawing with Lucide's ISC-licensed plane SVG, bundled locally with its copyright/license notice.
- This hotfix does not complete the separate security-report finalization, native browser/provider validation or store-publication gates.

## 26 October 2026 — MIT license adopted

- Adopt MIT for SlotDesk with copyright credit to Speedy, Nina Banai and Yoav Fried. Include the license in future extension packages and preserve third-party font/data notices.
- Licensing metadata/documentation update only; no scheduling behavior or product-version change. Existing release archives are unchanged.

## 26 October 2026 — support and website metadata

- Record the owner-supplied support address, support@buildwithspeedy.com, and website, https://buildwithspeedy.com.
- Add repository credits/contact links, extension Help/privacy contact routes and manifest homepage metadata; update Chrome, Edge and Firefox listing drafts.
- Clear the pending support-address setup item. The exact public privacy URL remains open. No product-version bump or replacement of existing release assets is made; these source updates belong in the next packaged build.

## 0.9.5.1 — 26 October 2026

- Prepare Chrome, Edge and Firefox for 1.0.0; defer Outlook until afterward. Public 1.0.0 still requires live listings and final approval.
- Make registration analysis sharing optional in Firefox only, with separate updates consent, native permission requests, saved opt-out and revocation checks. Chrome/Edge behavior remains.
- Reject unsafe legacy imported matching expressions and guard already stored rules; retain supported generated patterns and keyword matching.
- Strip transient trip-editor fields from imported/saved flights and escape the occurrence attribute.
- Prevent invalid/varying origins from exhausting shared sign-in admission; preserve per-client limits.
- Preserve the sign-in endpoint when reconfiguring lead intake. Correct stale backend/token and raw recovery-export disclosures.
- Prepare listing/declaration/reviewer drafts, synthetic media, MIT proposal and consolidated owner publication steps. Support contact, license adoption, native-browser/provider checks and public publication remain open.

[Review evidence and limits](release-readiness-review.md) · [Store kit](store-kit/README.md).


## 0.9.5 — 26 October 2026

- Add standalone Trips with ordered flights, connections, return trips, date-first calendar matching and editable local arrival estimates. Save or Discard owns the editor; no resumable flight draft is stored.
- Apply arrival-based timezone changes, connection-only 30-minute hard margins and outer two-hour inconvenience buffers. Reconcile missed one-way arrivals while preserving later manual timezone changes and legacy settings.
- Add Possible flight and linked-flight review Alerts. Preserve saved trips when calendar details change, disappear or cannot be checked; update only after review. Calendar appointments remain unchanged.
- Include trip/link/history settings in portable backups and selected-profile files. Add cog/flight actions, live minute clocks and the selected C2 icon with bold brackets.
- Fix airport-name search, dropdown/footer positioning, stale flight-review evidence and duplicate linked flight intervals found during review. Keep moved source appointments visible to scheduling until confirmed.
- Credit Speedy, Nina Banai and Yoav Fried. Record Outlook followed by 1.0.0 publication work; remove the website placeholder. Licensing remains a later owner decision.

[Scope and limits](release-plan-0.9.5.md) · [Validation](validation-0.9.5.json). Owner UX approval, real-provider/browser certification and extension-store publication remain separate.

## 0.9.4.9 — 26 October 2026

- Profile Manage meetings starts with all linked calendars selected. Adding/removing a mapping updates the list immediately; reopening the section starts with all linked calendars. Refresh/date changes preserve deliberate filters, and selection changes reuse cached meetings.
- Calendar checkboxes and names share a row in profile meeting management, Existing meetings and workspace selection. Long names truncate with ellipses and expose the full name on hover. Calendar dropdowns and timezone triggers also expose their complete selected labels.
- Replace Default/Ignore/Protect/Assign leave buttons with one treatment dropdown. Automatic states display Default — leave/protected/flexible/ignored/all-day note as applicable, using the scheduling adapter/classifier. Detection and calendar all-day leave changes update it live without creating manual overrides. Explicit treatments, legacy rules and occurrence/series behavior remain intact.

Validation: **2,299 application checks**, **73 backend checks**, **22 calendar-comparison checks**, **82 synthetic browser assertions** and **five axe scans** without automated violations. Manual/incomplete accessibility review remains open. Nine original synthetic appointments remain unchanged with zero calendar writes. No hosting or OAuth changes. [Scope](release-plan-0.9.4.9.md) · [Evidence](validation-0.9.4.9.json).


## 0.9.4.8 — 26 October 2026

- Record every completed onboarding as a separate lead, even with an existing email. Save a reported browser label and an internal onboarding UUID; retry the same submission without adding another row. Preserve historical leads and older queued registrations. Update the onboarding/privacy notice.
- Make the shared timezone search an overlay. Opening it does not enlarge profile, flight, reschedule or other dialogs; click-away, focus departure and Escape close it. Keep lists within the viewport, including narrow sidebars.
- Prepare exact VT323 **SD** and **[SD]** icon alternatives with the actual lime/ink/bracket colors. These are proposals only: no toolbar, favicon, manifest or store icon is installed.

Validation: 2,280 application checks, 73 backend checks, 22 calendar-comparison checks and 157 synthetic browser assertions, including 17 timezone contexts. 21 axe scans found no automated violations; manual/incomplete checks remain. All nine synthetic appointments stay unchanged with zero Calendar writes. [Evidence](validation-0.9.4.8.json). Flight redesign and owner UX approval remain open. [Lead rules](leads-table.md) · [Icon proposals](../design/proposals/extension-icon/README.md).

## 0.9.4.7 — 22 October 2026

Same-version sidebar hotfix — 26 October 2026: move workspace scrolling and its stable gutter below the full-width lime header. Keep the fixed-size wordmark clear of actions at narrow widths; use compact home-card rows with full-width descriptions. Reset/verify the workspace scroll area during navigation and search interactions. Clarify that new-browser onboarding does not duplicate or overwrite an existing email-keyed lead; registration behavior is unchanged. All 2,267 application checks and 178 synthetic browser assertions pass, with 22 axe scans without automated violations; incomplete/manual findings remain. Nine synthetic appointments remain unchanged with zero Calendar writes. Refresh the three target packages and checksums without moving the historical release tag. [Evidence](validation-sidebar-2026-10-26.json).

Implement the agreed non-flight advanced profile settings: ordered categories and information icons; independent working/convenience ignoring; full nonprotected-overlap ignoring; one-off/recurring blockers; opt-in whole-word keyword detection; and a cached local meeting browser with Default, Ignore, Protect and Assign leave for an occurrence or identifiable series. Last action wins. Preserve old availability, partial leave exceptions and custom matching; persist and export all new fields. Remove redundant timezone-clue and separate leave-exception controls.

Validation: **2,267 application checks**, **71 backend checks**, **22 calendar-comparison checks**, **136 browser assertions** and **24 axe scans** without automated violations. Manual/incomplete accessibility checks remain open. Nine synthetic calendar appointments remain unchanged with zero create/update/delete/move requests. No real Google account used. Flight entry, scheduling, detection, settings and helper redesign remain pending owner review. No Calendar writer, OAuth scope or hosting changes. [Scope](release-plan-0.9.4.7.md) · [Evidence](validation-0.9.4.7.json).

## 0.9.4.6 — 21 October 2026

Same-version search/scroll hotfix — 22 October 2026: implement the owner's [final selection rules](search-selection-2026-10-22.md), including three groups, nearest-date representatives, earlier equally suitable starts and one/two/combined clear alternatives before in-range compromises. Only one later-date choice appears across all batches. Fix focus/page jumps caused by forced focus scrolling, doubled header offsets and timezone-list scrolling. Sunday workweeks, hard rules, duration policy and Calendar write transports remain intact. Validation: 2,176 application checks; 95 browser assertions; 20 accessibility scans without automated violations, with incomplete/manual items still open. Nine baseline appointments remain unchanged and no real account, live Google read or Calendar write is used. Refresh the same-version downloads; original release tag remains historical.

Same-version new-meeting hotfix — 22 October 2026: remove the redundant date-range caption, use Time Zone and keep its field and Review & create left-aligned. Group each calendar icon immediately after the participant's name, with contained hover details. Warnings retain concise headings; only meeting overlaps have a second line, Overlapping on HH:MM-HH:MM, showing the actual intersection in the search timezone and respecting the clock preference. Distinct overlapping appointments have distinct headings. All 2,118 application checks and 67 synthetic browser assertions pass; nine baseline appointments remain unchanged with no Calendar writes. Scheduling/ranking policy is unchanged. Refresh the downloadable packages while retaining the original release tag.

Same-version onboarding hotfix — 21 October 2026: put workspace calendars before own profile, place the exclusion notice below the calendar list and suggest the own-profile name from exact-email organizer/attendee metadata with existing permissions. Incomplete onboarding restarts at calendar selection in every new app session, retaining saved values for prefill; completed users skip setup. All 2,118 application checks and 24 focused synthetic-browser assertions pass. No Calendar writes, new Google scopes or hosting changes. Current downloadable packages are refreshed; retain the original release tag and record the exact hotfix source/hash separately.

Activation update — 21 October 2026: the owner completed Google/Vercel configuration and redeployed. Public readiness is independently verified true for 0.9.4.6. Runtime/package files and checksums are unchanged; real new-flow Google consent is the next check. See the [activation record](browser-signin-setup.md).



Post-package test-only correction: explicitly anchor the legacy engine fixture to its intended Jerusalem search timezone. The full 2,099-check suite passes on a UTC host as well. Runtime/package bytes and immutable release tag remain unchanged.

- Add shared browser capabilities, guarded native-sidebar/full-tab launch and background messaging without weakening shared-window locks.
- Implement independent Google consent with a hosted state/PKCE code exchange, session-only credentials, refresh/disconnect and an authenticated registration relay. Preserve the original Chrome pilot as an inactive-service fallback and the existing Google scopes. Activation needs owner Google/Vercel settings; real-provider consent is not claimed tested.
- Build distinct Chromium, unsigned Firefox and Safari-source artifacts. Firefox needs real-browser/signing/policy work; Safari needs a separate authentication bridge and Apple packaging/testing. Record actual browser evidence and all remaining store requirements.
- Add safe connection details, update installation/privacy/help and correct the malformed UTF-8 summary separator with strict encoding checks. Preserve reviewed Calendar write transports and the owner-led 0.9.5 gate.

## 0.9.4.5 — 20 October 2026

Same-version sign-in reporting hotfix — 21 October: distinguish browser identity availability, disabled browser sign-in, missing account, explicit organization block, OAuth configuration, missing permissions, network failure, absent token, canceled consent and unknown failures. Provide actionable messages and safe reference codes; do not expose arbitrary provider details. Add identity-method preflight and Help explanations. No OAuth flow, scope, token-storage or calendar-write change. Record the required system-wide error-reporting review and the proposed browser-independent closed-beta connection. Validation: all 2,044 application checks pass, including 54 new sign-in reporting cases; no real sign-in or Calendar write.

- Simplify Find a time: remove search Advanced controls and diagnostic refresh; retain fresh search/final-write checks, meeting-wide exclusions and per-person temporary rules.
- Apply the accepted automatic duration/workweek fallbacks, initial counts and append-three batches. Suggestions never overlap one another across categories or batches. Keep ten-minute preference, eligible five-minute refinement and the five-minute minimum.
- Replace card-wide calendar coverage with per-person icons, compact identity/local-time rows, one prioritized factual status and substantive deduplicated warnings. Remove Copy option and excluded-candidate diagnostics; shorten Copy meeting details in final review.
- Add an editable, copyable planning email for all visible suggestions. Shared text omits calendar conflicts, unknown coverage and internal rules; its sole availability caveat identifies a known unavailable optional guest without labelling them optional.
- Use friendly city/country or US city/state labels and retain selected-city identity through saving, travel and portable files. IANA scheduling and date-specific offsets remain authoritative.
- Expand Ignore usual convenience hours to permit outside-range proposals for that person only; independent flights, blocks, availability and configured inconvenience remain in force.
- Group related overlap alerts into Review overlaps with each appointment once, exact neighbor details and individual reviewed rescheduling. Calendar-write transports, permissions and account identity remain unchanged.
- Validation: 1,990 application checks, 51 focused synthetic-browser assertions and three axe scans without automated violations. Creation preserved nine baseline events; rescheduling patched only the selected occurrence's times while preserving the other eight and protected fields. No real account/invitation or delete/move request was used. Manual accessibility and owner UX review remain open.
- Keep advanced profile settings for the owner-led 0.9.5 review. Further appointment-logic iteration remains expected.

## 0.9.4 — 19 October 2026

Same-version alert-actions hotfix: use the requested overlap explanation and separate Reschedule old appointment / Reschedule SlotDesk appointment actions. Keep explicit target choice, link confirmed source IDs, recover legacy links only from verified SlotDesk markers and matching times, and recheck both sides without adding write capabilities. Replace the guest-response footer with Last update and its successful alert-scan timestamp. Validation: 1,901 application checks and 23 focused browser assertions; nine synthetic events unchanged with no Calendar writes. Record both required 0.9.5 owner reviews as a hard gate: advanced profile wording/UX/logic, and Meeting options/scheduling Advanced wording/UX. No 0.9.5 review-driven fixes or release without the owner’s reviews and directions.

Same-version follow-up placement hotfix: move Appointments to reschedule out of the main menu and into Existing meetings. Include pending follow-ups in the bell count with a View appointments shortcut; dismissing or completing a follow-up updates both places. Calendar changes still require their own review.

- Implement the [agreed scheduling rules](scheduling-ranking-review.md) in the shared creation/rescheduling engine. Use 10-minute starts by default; eligible 5-minute starts can avoid required conflicts or recover full optional attendance without worsening required fit. Never automatically suggest finer starts, even for an exact off-grid gap.
- Separate explicit flight/manual inconvenience from usual hours. Apply equal required-guest fairness, guest working-hours preference over permitted own overlaps, and clash-free preference over own office hours when guests are equally served. Keep a useful own-working-hours overlap alternative when it offers a different time group.
- Prioritize original duration/dates, then shorter and later alternatives. Select equally suitable options on the earliest date, one per time group, before moving dates. Avoid inferior extras solely to fill the requested count.
- Retain Start-time spacing and Options per day under Advanced with Automatic/custom modes; preserve legacy values without silently activating them as overrides. Custom spacing must be a multiple of five. Include modes in full backups and shared-window settings.
- Show all selected alternatives under Meeting options with the actual visible count and the agreed no-open-options notice. Distinguish meeting overlaps, day off, flight/manual inconvenience, working-hour restrictions and unconfirmed data. Expanded warnings identify actual event titles/times without counting holidays as meetings.
- Allow own-profile title-based protection guesses as warned overlaps. Preserve explicit protection/leave overrides, saved flights, stated availability, working-day rules and blocked radii. Ignoring work/convenience no longer silently enables outside-hours proposals. Calendar writes remain reviewed creation and narrow updates.
- Validation: 1,880 application checks, including 81 new ranking cases, plus 40 focused synthetic-browser assertions and three axe scans without automated violations. A synthetic creation preserved all nine baseline events; rescheduling changed only the chosen event’s start/end and preserved the other eight. No real accounts/invitations were used. Manual accessibility and owner UX approval remain open.
- Move advanced profile-settings cleanup and improvement to **0.9.5**.


## 0.9.3.5 — 19 October 2026

Same-version search hotfix: preserve participant order when an included profile is edited. Bundle offline GeoNames city/capital/country search with spelling tolerance and common timezone names; keep confirmed IANA choices and date-aware offsets. Automatically detected calendar time off on the own profile can appear as a warned overlap alternative, without moving that entry or asking to reschedule a holiday. Explicit protections, manual blocks, flights and other people’s time off remain blocking. When protection prevents options, identify the entries and offer profile-rule review instead of only anonymous rejection counts. Document regional holiday suggestions as deferred. No Calendar permissions or writer capabilities are added.

Same-version meeting-loading/profile hotfix: restart cancelled loads when returning to Existing meetings, retain completed caches and prevent late cancelled results from replacing a fresh load. Place Refresh meetings beside the meeting count and source notices above it. Stopped loads use the requested calendar-specific message with an inline Refresh action. Remove routine profile Saving/Saved text while retaining validation and persistence errors. Calendar-write behavior is unchanged.

Same-version capitalization hotfix: apply sentence case across ordinary interface copy, including More settings, Edit your profile, Time & date, warning counts, calendar tooltips, privacy links, Help instructions and the extension name. Remove the heading exceptions from the working style guide. Preserve brands, proper names, acronyms, user content and robotic accents. No version or scheduling behavior change.

- Implement the approved styling direction with bundled DM Sans, shared type roles, regular-weight 24px/28px page titles, compact spacing, drawn menu/navigation icons and a stable page scrollbar gutter. Retain the wordmark, lime header and robotic eyebrows.
- Separate Availability calendars and More settings into prominent expandables. Replace linked-calendar selectors with saved rows, visible leave/holiday treatment and an explicit Add calendar/Add another calendar flow limited to the selected workspace calendars. The no-access checkbox hides the controls; leaving an empty selection returns it to checked.
- Explicitly deselecting a calendar in Settings removes its saved profile/guest assignments and associated leave-calendar references. Other assignments remain; transient read failures do not remove links. Calendar appointments are not modified.
- Lock the own-profile email and distinguish Edit your profile. Existing invalid or duplicate email edits revert to the saved address with a persistent bell notice; new profiles require explicit creation with a valid email and timezone. Remove generic autosave instructions and the Not saved/Use saved values recovery control while retaining specific validation/storage errors.
- Anchor timezone chevrons to the right edge. Record a field-by-field validation inventory. Individual advanced-setting redesign remains for 0.9.4; visual approval remains with the owner.

## 0.9.3 — 18 October 2026

Same-version follow-up: align the participant Add button with its search field; close suggestions on outside interaction and page scrolling, reopen on search interaction, and keep the popup below the header. Use the generic **Edit Profile** heading. Record advanced profile settings cleanup/improvement as the next task. No version or Calendar behavior change. A further card follow-up moves email directly below the name, replaces the availability text with an accessible calendar connection icon beside the timezone/local time, and removes the automatic-participant caption. Linked-calendar profile settings now explain automatic inclusion. Shorten the meeting-only overlap label and explanatory text as requested.

- Record the owner-led overall UX, buttons, screen-width/layout and wording review as open. Only the owner decides readiness; technical checks do not imply UX approval.
- Improve secondary-text contrast in both themes and selected participant cards, input boundaries, visible keyboard focus, pointer spacing, native color schemes and forced-colors support. Retain the supplied wordmark, fonts and lime header.
- Add a skip link, contextual profile/guest/flight/meeting actions and distinct outbound/return timezone names. Make profile suggestions keyboard-operable listboxes with announced active choices.
- Focus dialog context on entry, recover after replaced controls and return focus across nested dialogs using open order. Preserve flight Save/Discard, block Escape from discarding, expose required errors and open hidden advanced sections for validation.
- Prevent Enter in a booking text field from implicitly sending invitations; the deliberate send button remains keyboard-operable.
- Verify 20 screen states with axe-core 4.14.0 (no automated violations), plus 36 keyboard/focus/reflow checks, including forced colors and 2x CSS zoom. Automated incomplete checks and real screen-reader validation remain explicitly open. All 1,684 application checks pass; synthetic appointments stay unchanged.

## 0.9.2 — 18 October 2026

- Save valid profile changes live, with visible saved/failure state and last-valid-value protection. Keep own-profile onboarding explicit. Merge unrelated edits from simultaneous windows without overwriting them.
- Organize working time, preferred hours and meeting rules separately; clarify local event treatment and add a working Load meetings action. Show linked/unavailable/excluded calendar status in saved profiles.
- Replace inline flight/travel rows with saved-entry lists and focused Save/Discard forms. Flights have no X/back/Escape exit and no resumable draft. Optional Return flight reverses chosen locations/timezones, leaves dates/times blank and saves both entries together. Preserve locations, explicit zones and protection rules; handle nonexistent/repeated clock times.
- Add complete portable JSON backups and selected-profile export/import with Select all. Match named columns, ignore unknown columns, warn/default missing optional fields and reject malformed required data. Include all saved person settings, calendar references and person-specific time rules.
- Protect My profile from selected-profile imports. Full restore updates it only on matching email, preserves it otherwise, and requires own-profile setup during onboarding. Replace other setup, clear an unsent meeting, preserve recipient sign-in/registration and block apply while a calendar write is unconfirmed.
- Validate files before local replacement, check calendar metadata where possible, retain unresolved assignments, and offer Download current backup. Roll back failed/interrupted local saves and invalidate stale windows after full replacement. File operations have no Calendar write capability.
- Improve dialog names, focus return, timezone picker Escape/text editing and compact profile actions. Add Help/privacy guidance for portable files and save boundaries.
- Validation: 1,684 synthetic application checks, six intake tests and 22 calendar-comparison checks. Local browser coverage includes live/invalid/failed saves, concurrent windows, outbound/return Save and Discard, export/import, full replacement, stale-editor closure, onboarding and narrow/wide keyboard/layout checks. Synthetic calendars remain unchanged; no real sign-in or invitations used.

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
