# SlotDesk UX decision register

## 22 October — Blockers and Manage meetings planning settled

The owner answered the [final eight decisions](advanced-profile-review-0.9.5.md#final-blockers-and-manage-meetings-decisions--accepted). Accept the add/edit Save/Discard form, blocker fields and helper. All these profile time settings use the profile timezone; do not add an independent blocker timezone mode. X removes without Undo. Reuse Existing meetings UI/UX rather than the separately proposed three-item/title-search design. Recurring treatments default to This occurrence and otherwise save like other entries. Last action wins: a newer series-wide treatment overrides all earlier individual choices; a later individual action changes that occurrence. Default restores automatic/profile behavior at the chosen scope. No product-planning gate remains for these two areas; travel/flight planning remains. Documentation only; runtime/packages are unchanged.

## 22 October — Assigned leave protection confirmed; final non-flight decision batch

The owner confirmed that explicit Assign leave blocks even with Allow overlaps enabled; Ignore can disregard that calendar entry for this person. At the owner's request, the [remaining Blockers/Manage meetings decisions](advanced-profile-review-0.9.5.md#final-blockers-and-manage-meetings-decisions--accepted) are listed together, with recommendations for entry completion/fields/timezones/removal/help text, meeting-list layout, live treatment scope and series/occurrence inheritance. Those eight recommendations are pending approval; do not mark them accepted yet. Travel/flight planning remains unfinished. Documentation only; runtime and packages remain unchanged.

## 22 October — Event detection approved

The owner approved the [non-flight detection fields and wording](advanced-profile-review-0.9.5.md#event-detection--approved-controls-keywords-and-matching): Leave, Flexible meetings and Protected time with editable default keyword/phrase bubbles and concise helper text. Match case-insensitive whole words/phrases; an empty category is disabled. Non-flight classification priority is Leave, then Protected time, then Flexible meetings. Manual event choices and the accepted Allow overlaps handling override title guesses. Preserve existing custom keywords. Flight detection/defaults/helper text remain under the separate flight review. Planning approval only; runtime and packages remain unchanged.

## 22 October — Blockers, recurring meeting rules and consolidated leave handling

The owner chose Blockers as the third advanced section, supporting recurring and one-off entries through Add blocker and compact removable bubbles. One-off entries cannot be assigned to past dates and expire from the active list when their date has passed. This entry pattern may fit flights and other repeated settings, with those details still under review. Permit occurrence/series treatment when a meeting's recurrence is identifiable. Remove the separate Leave exceptions category: leave entries remain in Manage meetings and can be set to Ignore there; retain Assign leave for manual classification. These decisions supersede the previous separate leave picker. The new [Event detection proposal](advanced-profile-review-0.9.5.md#event-detection--approved-controls-keywords-and-matching) is for owner review. Documentation only; 0.9.5 is not implemented or declared ready.

## 22 October — Leave exceptions and manual leave assignment

The owner approved the leave-exception behavior, with a searchable list of three entries per page instead of a date-range picker, and renamed the category **Leave exceptions**. Show actual entry dates/calendar, Ignore for this person, whole-entry or selected-day exceptions, visible ignored entries with restoration and occurrence-specific recurrence scope. Add **Assign leave** to Manage meetings alongside Default, Ignore and Protect so ordinary calendar entries can be classified manually without keyword detection. Preserve their actual intervals and include them in Leave exceptions. The new Assign leave/Allow overlaps interaction and the remaining meeting-browser design still need review. Documentation only; runtime/packages remain unchanged.

## 22 October — timezone helper removal and factual overlap labels

The owner confirmed removal of the standalone Timezone clues to confirm section. Keep the searchable timezone selector and review travel-specific clues with flights. Factual Overlapping labels remain in Existing meetings even when a profile default or meeting override ignores those overlaps; scheduling warnings/ranking/follow-ups retain the accepted ignore semantics. The owner questioned the new positive meeting-specific availability form and proposed recurring saved-profile blockers instead; [that design is reopened](advanced-profile-review-0.9.5.md#blockers--accepted-shape-and-entry-lifecycle). Preserve existing saved rules; no new availability UI is declared approved. Documentation only; 0.9.5 remains under owner review.

## 22 October — profile category help and overlap placement

The owner approved category information icons and the [tooltip wording](advanced-profile-review-0.9.5.md#category-information-icons--owner-approved-wording), with Travel & flights wording explicitly still requiring its wider flight review. Rename Meeting rules to Notices and buffers and move the saved general overlap setting into Manage meetings, above individual Default / Ignore / Protect choices. Preserve sentence case, independent rule semantics and the existing per-meeting override. Planning only; runtime and release remain 0.9.4.6.

## 22 October — advanced-profile review started

The owner reviewed More settings and confirmed the [0.9.5 directions](advanced-profile-review-0.9.5.md): working schedule first, Convenience hours second, full removal of ignored rules from ranking/warnings, ignored nonprotected overlaps with explicit Protect/flights retained, detection off for new profiles with existing behavior preserved, calendar-backed Holiday exceptions and a local Default/Ignore/Protect meeting browser. Remove new recurring availability from saved settings while preserving existing rules until deliberately removed and retaining meeting-specific availability. Travel/flight review and fixes are required in this update; that review remains open. Timezone-clue removal and concrete browser/migration details are proposals. Documentation only; no runtime/version/package change or final owner UX approval.

## 22 October — selection order and stable scrolling

The owner revised [search selection](search-selection-2026-10-22.md), including the final clarification of three to five initial fallback cards: one later working-hours choice and one in-range outside-working-hours choice where available, or one combined choice only when both independent categories are absent, then three nearest in-range compromises. Short ranges use three groups/day; longer ranges use one representative/day. Good working-hours choices in range suppress later dates and hide compromises until Generate more. Earliest suitable starts replace the unused-margin tie-breaker. Sunday remains part of Sunday–Thursday workweeks. Remove forced focus scrolling and the doubled header margin while preserving keyboard focus, validation scrolling and append-only results. Implemented without changing Calendar writes or the 0.9.5 owner-review gate.

## 22 October — new-meeting layout and concise warnings

Implemented as a same-version 0.9.4.6 hotfix: omit the caption repeating the selected From/Through dates. Use the owner's explicit Time Zone label and keep the field left-aligned as the window widens. Review & create also stays left-aligned. Group each participant's calendar icon directly after their name, ahead of the location/timezone and local-time cells.

Warnings show their orange headings without repetitive explanatory paragraphs. For each ordinary meeting overlap, include only Overlapping on HH:MM-HH:MM beneath its own event-specific heading. The interval is the actual intersection of the proposed and existing appointments, expressed in the search timezone, with the saved 12/24-hour preference; the full dated interval is available on hover. Other warning categories retain headings only. This presentation change does not change ranking, permissions or reviewed calendar writes. The separate owner-led 0.9.5 review remains open.

## 22 October — cloud storage remains an unconfirmed future feature

The owner explicitly accepts the current browser-based saved workspace; it is not a blocker for continuing development or the pilot. Cross-browser/device cloud accounts and settings sync, including compact versioned encoding, are possible future work only. The proposed provider-neutral Google/Microsoft account model and cost-saving design are unconfirmed, with no implementation authorization or release assignment. Retain local backup/import behavior and resume the existing work. See [roadmap proposal DF11](roadmap.md#cloud-accounts-and-settings-sync--unconfirmed-future-feature).

## 21 October — onboarding order and restart policy

The owner explicitly confirmed: workspace calendars → own profile → optional familiar people. If any step remains unfinished when the app restarts/reopens, start again at calendars; saved entries may prefill, but all steps require confirmation. Do not resume directly at the unfinished step. Completed onboarding remains complete. The calendar exclusion note sits below the list. Suggest the own-profile name from matching Calendar organizer/attendee metadata when available, without overwriting typing or adding Google permissions.

Implemented decisions are recorded through 13 October 2026. The [14 October product review](product-review-2026-10-14.md) records new planned directions and unresolved details separately. Implemented in 0.3.0 and retained in 0.6.1 unless stated otherwise. The [scheduling register](scheduling-decisions.md) supplies the underlying rules; this register describes the user experience.

| ID | Area | Agreed behavior | Status |
| --- | --- | --- | --- |
| UX01 | Profile identity | Profiles represent people by email, not calendars. Names, timezones and calendar mappings remain editable. | Implemented |
| UX02 | Own profile first | Set up the user's own email, name and confirmed timezone before normal use. Keep the setup short; advanced settings remain collapsed. The own profile joins a meeting only when explicitly selected. | Implemented |
| UX03 | Suggested profiles | After own-profile setup, suggest up to six people from recent/frequent calendar appearances. Deduplicate by email and omit the user's own and existing profiles. Suggestions need confirmation, especially timezone. Show them in the optional third setup stage and in Manage profiles, not in New meeting. | Implemented |
| UX04 | New participants | A new participant email opens the same short profile flow. Create the profile, confirm timezone, then use it in the meeting. | Implemented |
| UX05 | Working-hours section | Working days and hours have their own advanced section. Choose one mode: Pick from template or Define manually. Preserve the other mode's settings when switching. | Implemented |
| UX06 | Templates | Separate day and hour dropdowns. Day options are Monday–Friday and Sunday–Thursday. Hours include 09:00–18:00, 08:00–17:00, 09:00–17:00 and 10:00–19:00. Asia/Jerusalem selects Sunday–Thursday; other zones select Monday–Friday. Changing timezone preserves hours and manually defined days. | Implemented |
| UX07 | Manual work schedule | A checkbox for each working day; selected days require start/end times, initially 09:00 and 18:00. | Implemented |
| UX08 | Ignore working rules | Ignore working hours also ignores working days and disables their controls without discarding settings. Calendar conflicts, protected blocks and stated availability still matter. Convenience hours, initially 07:00–20:00, continue to rank slots. | Implemented |
| UX09 | Inconvenient times | Flexible profiles may receive proposals outside convenience hours with explicit affected-person and local-time warnings. Other profiles receive outside-acceptable-hour options only after the EA enables the separate last-resort search. Show full dates and zones across midnight. | Implemented |
| UX10 | Clock preference | A system-wide 24-hour or AM/PM preference applies to input, proposals, warnings and copied details. Default is 24-hour. | Implemented |
| UX11 | Dates | Offer This week, Next week and Custom dates. The search timezone is visible and changeable; Jerusalem weeks begin Sunday. Each participant's local dates are shown separately. | Implemented |
| UX12 | Invitation calendar | Choose a writable default calendar during initial setup, including delegated calendars. Allow later changes in Settings and per-meeting override. If permission is lost, require a new selection rather than silently switching. | Implemented |
| UX13 | Select and review | Selecting a time opens a full editable review before any invitation is sent: title, calendar, participants, optional flags, full local dates/times, duration, location, video choice, description and warnings. | Implemented |
| UX14 | Copy before sending | Copy complete meeting details from review so the EA can create it manually if needed. A Google Meet link is generated on send; do not invent one before creation. | Implemented |
| UX15 | Who receives invitations | Every retained participant is invited, even when known unavailable or outside convenience hours. Availability warnings never silently remove attendees; the EA controls the participant list. | Implemented |
| UX16 | Video | Google Meet is on by default, with a toggle. The EA can use another link or location. Show pending/failed video generation separately from successful event creation. | Implemented |
| UX17 | Final send checks | Refresh calendar permissions and availability before sending. Changes to time or attendees require an explicit recheck. New warnings pause for review and another explicit send action. | Implemented |
| UX18 | Booking recovery | Use a stable event identifier and deduplicate in-flight sends. If a response is lost, check the same event before retrying. Persist only the prepared unfinished invitation; keep the draft unchanged while the result is uncertain. | Implemented |
| UX19 | Advanced settings and coverage | Keep travel, constraints, calendar sources, leave exceptions, classification rules, radii and notice in Advanced. Keep search timezone, selected people and availability confidence visible where they affect decisions. | Implemented |
| UX20 | Existing meetings | Creating, browsing and individually reviewed time changes are current scope. New or increased overlaps caused by SlotDesk need warnings and replacement-time suggestions; pre-existing overlaps are not separate penalties. No automatic moves. | Implemented through 0.7.0; precise rescheduling scope in UX53–UX56 |
| UX21 | Timezone selection | Choose from closed native dropdowns in profile setup/editing, search, meeting review, availability, travel, flights and manual constraints. Group supported zones by region and show readable place names plus timezone identifiers. Require a choice when no timezone is known; preserve valid saved aliases. Clues still require EA confirmation. | Implemented in 0.3.5 |
| UX22 | Many saved profiles | Search by name or email, show a limited set of matching profiles, and add only the people attending. The meeting form shows selected people with Remove, Required/Optional and Edit controls. Manage saved profiles on a separate searchable workspace page. New meeting clears title and selections while preserving profiles. | Implemented in 0.4.0; checked with 50 profiles |
| UX23 | Dark mode | Use an accessible Dark mode switch at the top of Settings. Retain Follow system in collapsed Appearance options. Changing the switch updates the saved appearance preference. | Added in 0.4.0; relocated in 0.4.1 |
| UX24 | Demo removal | Remove the Try demo entry points, scenario controls and simulated-send product flow. Keep synthetic fixtures in automated development checks only. | Implemented in 0.4.0 |
| UX25 | Clear wording | Describe the action and its effect in plain language. Own-profile copy: “You will take part in the meeting only if your profile is included.” Keep invitation recipients and warnings explicit in review. | Reviewed in 0.4.0; continue reviewing during the pilot |
| UX26 | Work-account use | Preserve the calendar-integrity/privacy safeguards. Nina uses Google Workspace; Outlook is not required for her pilot. Account access depends on organization permission. | Source review and synthetic checks passed; dense-calendar creation/export integrity passed; decline alerts, rescheduling and overlaps are user-reported working. |
| UX27 | Compact header and account | The top row has the unboxed VT323 logo plus Help and Settings icons. Under the logo, show only the connected email in a green-dot bubble and an adjacent exit icon to disconnect. Keep long emails on one line, with the complete address accessible. Remove the separate connection/link row and routine connected-ready message. | Implemented in 0.4.1 |
| UX28 | Settings shortcuts | Name the dialog Settings. Put Dark mode and Open full workspace at the top; retain clock, default calendar and profile controls below. | Implemented in 0.4.1 |
| UX29 | Help and privacy | The question-mark icon opens general Help before and after connection. Remove the workspace privacy footer and provide a clearly linked standalone privacy notice covering local settings, session data, tokens, Google requests/invitations, retention, disconnect and removal. | Implemented in 0.4.1 |
| UX30 | Compact proposal dates | Show weekday, day/month and time range with a plain hyphen. Include the year only when a displayed date is later than the viewer's current calendar year, calculated at display time using their own-profile timezone (or browser timezone if unavailable). Show an end date when the meeting crosses a local date/year boundary. Put timezone and date-specific GMT offset below the heading; expose both offsets when the clock changes. | Implemented in 0.4.2 |
| UX31 | Participant fit | Lead each participant row with Fits well, Inconvenient time, Calendar conflict, Does not fit profile or Availability unconfirmed, plus a reason. Suppress repeated local dates/times when their timezone matches the proposal; show a compact local range/offset when it differs. Missing calendar data must not imply verified availability. | Implemented in 0.4.2 |
| UX32 | Calendar-data status | Distinguish Calendar data complete from Calendar data incomplete for every included participant, including optional guests. This indicates coverage for the proposed time, separately from conflicts, convenience and invitation acceptance. Optional guests remain non-blocking. | Implemented in 0.4.2 |
| UX33 | Proposal warnings | Keep the short fit/conflict status in each participant row. Show all detailed warnings in one collapsed section labelled “1 warning”, “2 warnings”, etc.; remove repeated orange boxes. Count distinct warning items: each required-participant overlap appears once per appointment, including a shared appointment, and optional-participant conflicts use one summary per person. Retain separate timing, profile and calendar-data issues. Keep the same warning list open in final review. Use readable calendar-owner names and wrap long text. Copied meeting details retain the warning information. | Implemented in 0.4.3 |
| UX34 | Workspace menu | After setup or reconnect, start at three choices: New meeting, Existing meetings and Manage profiles. Return through Workspace; preserve unsent details with Continue unfinished meeting. New meeting deliberately clears title/participants while retaining profiles. Keep unfinished-send recovery actionable on the menu. | Implemented in 0.5.0 |
| UX35 | Existing-meeting browser | Start with the default calendar; allow multiple accessible calendars and an unrestricted date range. Show chronological meetings, including all-day/free/declined entries, recurring indicators and Created with SlotDesk when matching metadata is present. Details include organizer, description, location, optional/required guests and Yes/Maybe/No/No reply, plus safe Calendar/Meet links. Mark busy-only, incomplete and omitted data explicitly. Browsing does not write; rescheduling uses a separate reviewed action. | Browser implemented in 0.5.0 and refined through 0.7.0; rescheduling in UX53 |
| UX36 | Dialog scrolling | Every popup has a stationary heading and close button. Only its content scrolls. Long titles remain contained and close controls stay reachable in narrow panels. | Implemented in 0.5.0 |
| UX37 | Creation completion | After confirmed creation, show a Meeting created dialog over the home menu, with meeting summary, links and Done/View meeting. Retain pending/failed Meet and new-overlap follow-up actions. Remove the green confirmation banner from the meeting form. | Implemented in 0.5.0 |
| UX38 | Local feedback | Remove the historical latest-action row under the top bar. Show progress and errors beside the current action or inside its dialog. Routine completion messages use an accessible announcement without adding a persistent visual strip. Uncertain sends retain their recovery notice. | Implemented in 0.5.0 |
| UX39 | Optional familiar-face setup | Own profile, default calendar, then familiar faces. Continue without adding suggested people, or confirm and save profiles. Suggestions remain available in Manage profiles afterward. Existing configured accounts migrate directly to the menu. Clarify start-time spacing with examples in Advanced. | Implemented in 0.5.0 |

The EA retains control over people, calendars, rules and explicit overrides. Default meeting radii and minimum notice are zero. Holiday/leave exclusions are per person and date/date range. These are scheduling decisions, not edits to source calendars.

The [live-feedback implementation record](pending-ux-review.md) explains the 0.6.0 refinement and preserves its rationale.

| ID | Decision | Accepted behavior | Status |
| --- | --- | --- | --- |
| UX40 | Availability source selection | Email profiles; exact calendar/email matches; confirm secondary owner suggestions; closed dropdowns with Add another, duplicate prevention, leave controls and unavailable-state preservation. | Implemented in 0.6.0 |
| UX41 | Calendar weeks | Previously used whole-week selection. The owner replaced this with unrestricted date ranges on 13 October; Past/In progress markers remain. | Superseded by UX48–UX51 in 0.6.1 |
| UX42 | Meeting card/detail layout | Two logical card rows; upper-left origin tag; ordered Time & date, Calendar, Organizer, Guests. Saved names resolve by email; actual email remains visible. | Implemented in 0.6.0 |
| UX43 | Per-meeting calendar early | Write-capable dropdown on New meeting; saved default initially; draft changes do not alter default. Review retains the final choice and fresh access check. | Implemented in 0.6.0 |
| UX44 | Useful alternatives | One labelled list with results only, including more chosen-date options. Shortening is strictly shorter; extension really extends; new-conflict options retain explicit warnings and manual follow-up. Replaces UX08's fixed three-heading presentation. | Implemented in 0.6.0 |
| UX45 | Same-account windows | Automatically adopt connected session, compatible profile/preferences/draft changes; resolve real concurrent-field conflicts in place. Opening another surface alone leaves review valid. Relevant edits require recheck; uncertain requests remain immutable. | Implemented in 0.6.0 |
| UX46 | Saved review | Retain user-entered review title, time, calendar, attendees, Meet choice, location and description locally. Reopen with availability recheck; do not persist fetched events/warnings or tokens. | Implemented in 0.6.0 |
| UX47 | Declined follow-up | In-app grouped No-response alert with optional context, Dismiss and Find another time. Existing reads/Refresh update observations; no automatic mutation or polling. | Authorized 13 October; implemented in 0.7.0 |

## Date-range and multi-calendar refinement — 13 October 2026

| ID | Decision | Accepted behavior | Status |
| --- | --- | --- | --- |
| UX48 | Exact date range | Start date and End date stay on one design row, including the narrow panel. No arbitrary duration limit and no repeated date-range caption. Dates are inclusive; invalid/reversed ranges remain actionable validation errors. | Implemented in 0.6.1 |
| UX49 | Multiple calendars | Searchable checkbox dropdown with Select all/Clear. Default invitation calendar is initially selected; subsequent selection persists. Adding/removing a calendar immediately changes the cached list. Each entry identifies its source calendar; distinct calendar copies remain visible. | Implemented in 0.6.1 |
| UX50 | Display timezone | Times shown in: followed by a closed timezone dropdown. Default to the own-profile timezone, with browser fallback; allow an on-screen change and retain it. Refilter and format cached events locally without another fetch. | Implemented in 0.6.1 |
| UX51 | Range cache | On first load or a date change, read all accessible calendars for the exact range, even unselected ones, and cache raw entries only in this window's memory. Refresh meetings explicitly reloads all calendars. Selection/timezone changes and returning to an already loaded range use cache. Clear on disconnect/account/reset; retain partial/error notices and busy-only behavior. Booking checks still read fresh availability. | Implemented in 0.6.1 |

## Rescheduling and alerts — 13 October 2026

| ID | Decision | Accepted behavior | Status |
| --- | --- | --- | --- |
| UX52 | Overlapping entries | Red Overlapping label, including meetings created elsewhere; one expandable detail list naming other busy entries and their local times. Scope is the currently displayed calendars; duplicate copies do not self-conflict. | Implemented in 0.7.0 |
| UX53 | Reviewed time changes | Existing meetings/detail or alerts opens a fresh event read, date search/exact time, current/new comparison and explicit Reschedule & notify guests. Preserve guests/content/video. All-day stays date-only; recurring changes one occurrence only. | Implemented in 0.7.0 |
| UX54 | Other appointments | Collision proposals prefer fewer distinct appointments and lower disruption. Plan replacements for the OTHER meeting while protecting the chosen interval. After confirmed collisions, keep a dismissible follow-up queue. Never move automatically. | Implemented in 0.7.0 |
| UX55 | Missing guest profiles | Keep the existing roster including No/optional guests. Confirm unknown timezones through short profile setup; show missing timezone/availability instead of inventing working-hour fits. | Implemented in 0.7.0 |
| UX56 | Alert observations | Group upcoming organizer-copy No replies. Dismiss the same No; clear known acceptance/cancellation/expiry; a later observed No transition may alert again. Observe normal reads/Refresh without changing the range-cache contract. | Implemented in 0.7.0 |
| UX-DF06 | Meeting-content search | Possible search by title, participants, location or written appointment content. No indexing/search UI now. | Deferred DF06 |

Implementation choices and safety limits are in [Rescheduling and meeting follow-up](rescheduling.md).

## Guest and detail editing — 0.7.1

| ID | Decision | Accepted behavior | Status |
| --- | --- | --- | --- |
| UX57 | Edit existing meeting | View details → Edit meeting changes title, location, description and guests. Time changes use the existing Reschedule action. Read latest details before editing; review exact before/after text before saving. | Implemented |
| UX58 | Guest changes | Show only current selected guests, searchable saved profiles and short timezone-confirming setup for a new email. EA explicitly adds/removes people and chooses Required/Optional. Do not silently add the organizer or change recipients because of availability warnings. | Implemented |
| UX59 | Removal and incomplete roster | Name removed guests and explain that their invitation may leave their calendars while the organizing meeting remains. Disable roster edits if Google has not shared a complete supported list; other details remain editable. | Implemented |
| UX60 | Confirmation and recovery | Save changes & notify guests sends the reviewed changes after fresh checks. Pause for changed warnings. Keep the immutable pending edit across reload, read the same target before retry, and update other windows by target IDs. Retain time/Meet and untouched event data. | Implemented; synthetic verification |

## Next product update — 14 October 2026

The authorized scope is implemented in 0.8.0. Earlier rows retain historical release behavior; UX61–UX67 and the final onboarding record supersede the affected defaults. UX68 remains a proposed broader redesign. Detailed proposals, edge cases and follow-up decisions are in the [product-review record](product-review-2026-10-14.md).

| ID | Area | Requested direction | Status |
| --- | --- | --- | --- |
| UX61 | Accessible travel | Travel & flights action on a person in Manage profiles; shared focused travel editor. | Implemented in 0.8.0 |
| UX62 | Searchable timezone choice | Search and suggestions inside a closed timezone dropdown; shared accessible control. | Implemented in 0.8.0; refines UX21 |
| UX63 | Executive flexibility | Ignore working days/hours and Ignore usual convenience are in Advanced, with saved defaults and per-meeting/search overrides for ordinary overlap permission; keep attendance/protected rules separate. | Implemented in 0.8.0; independent saved defaults and meeting/search overrides |
| UX64 | Main calendar mappings | Availability calendars in main profile setup, with an explicit no-access/unconfirmed state. | Implemented in 0.8.0; refines UX19/UX40 |
| UX65 | Email-only guests | Add email immediately; Create profile replaces Edit profile for unsaved people. Confirm timezone before searching without requiring a saved profile. | Implemented in 0.8.0; replaces compulsory profile creation in UX04 |
| UX66 | Workspace calendar scope | Onboarding/Settings select sources whose events are shown/used anywhere; browsing filters operate within that scope. | Implemented in 0.8.0; supersedes read-all-source UX51 |
| UX67 | Organizing-calendar participants | Automatically include every mapped profile, including teams; respect explicit removal/manual inclusion and update automatic additions when the calendar changes. No separate owner assignment. | Implemented in 0.8.0; refines UX02/UX58 |
| UX68 | Settings organization | Main identity/timezone/mappings, focused travel, coherent working/availability sections and advanced treatment rules; global scope/default calendar settings separate. | Proposed layout; controls inventory before implementation |

## Structured time inquiries — 14 October 2026

| ID | Area | Direction | Status |
| --- | --- | --- | --- |
| UX69 | Ask about times | One inquiry flow covers one/many recipients and one/many options. Parked after Gmail AMP review; possibly part of optional BYOK LLM assistance. | Unconfirmed future feature, DF07 |
| UX70 | Structured replies | Original inline concept: one time Yes/No; several times select all plus submission/None. Missing replies remain unanswered. A possible LLM-interpreted email-reply alternative is not yet agreed. | Original requirements retained; future protocol unconfirmed |
| UX71 | Inquiry finalization | A reply never authorizes creation by itself. Original concept uses separate EA review; any future direct LLM creation needs an explicitly enabled policy and the same validated write/recovery boundaries. | Future inquiry boundary; automation policy unsettled |
| UX72 | Shared response destination | The original inline design needs a submission service; email receipts/service storage are undecided. A possible LLM reply reader needs separate email access. No recipient response page. | Parked; service/sender/storage pending |
| UX73 | Inline-only release gate | The original interactive design requires working in-email Yes/No or multi-select submission. No external page/Google Forms or silent substitution. LLM drafting/parsing does not bypass compatibility; any different reply protocol needs agreement. | Original requirement; parked, not validated |

[Time-inquiry design](time-inquiries.md) preserves the parked concept and unresolved LLM relationship.

## Optional LLM assistance — future direction

| ID | Area | Direction | Status |
| --- | --- | --- | --- |
| UX74 | User-supplied API key | Optional model-provider key entry; current core scheduling stays usable without it. Key entry alone does not grant email access or automatic write permission. | Future direction; provider/storage undecided |
| UX75 | Prepared prompts and cost | Versioned task prompts; choose the cheapest model that performs reliably for each task. Cost/upgrade/budget controls and evaluation precede selection. | Future direction; no model chosen |
| UX76 | LLM scheduling assistance | Extract relevant email/appointment facts, draft inquiries, interpret replies and explain choices from actual rule-engine results. Missing/ambiguous information remains visible. | Future scope; DF01/DF02 and unconfirmed DF07 |
| UX77 | Direct appointment creation | Future explicitly enabled automation can choose/create a validated suitable appointment and explain why. Effective rules, fresh checks and recovery still apply; no automatic deletion/cancellation of other meetings. | Requested future behavior, DF08; authorization policy unsettled |

[LLM assistance](llm-assistance.md) separates requested behavior, possible BYOK-only inquiries and unresolved access/automation decisions.

[Final 0.8.0 onboarding/profile behavior](onboarding-and-profiles.md) defines the migration, scoped reads, temporary guests, automatic-participant exceptions and ranking boundaries.


## Settings/calendar polish — implemented in 0.8.1

| ID | Area | Decision | Status |
| --- | --- | --- | --- |
| UX78 | Calendar selection rows | Checkbox, single-line truncated name and an info button. Full name/email or ID, known permissions, timezone and other available descriptive metadata open separately. Count below the list, aligned left. | Implemented |
| UX79 | Calendar selection navigation | Same size as Settings. Fixed footer: Save calendars / Discard changes; X and Escape discard. Return to Settings and retain unsaved display choices. First required calendar selection has no X/discard/Escape and requires selected sources. From 0.9.0, a writable default is required when writable sources are selected; all-read-only setup supports browsing/availability. | Implemented |
| UX80 | Manage profiles identity | Own profile first among matching results, marked (you), without removal. Stable action column and ellipsis for long email with full value available in profile/title. Other profiles retain removal. | Implemented |
| UX81 | Settings simplification | Dark-mode toggle is the sole appearance control. Remove Edit my profile and Suggest more profiles shortcuts, which belong in Manage profiles. Keep time display independent. | Implemented |
| UX82 | Date display | Browser-wide Day first (20 Oct) / Month first (Oct 20), default Day first. Propagate to visible generated dates and copied full dates, preserving timezone and future-year logic. Native date-entry controls use the browser/OS locale; stored dates remain ISO. | Implemented |

The broader UX68 controls inventory/reorganization remains proposed; 0.8.1 implements only the concrete refinements above.


## Recovery and registration — 0.9.0 preview

The [65 accepted recovery cases](recovery-experience.md) define the implemented connection/read/write/storage behavior. Manual resolution has explicit acknowledgement and separate reported-found/unverified labels in history. The final onboarding step uses the exact [registration notice and optional updates wording](leads-table.md), records five fields regardless of opt-in and queues submission failures. The backend endpoint is deployed and configured in this preview; unavailable submission retains the exact record for retry.

## 0.9.1 amendments

The [0.9.1 changelog](changelog.md) records the approved stable header/logo, main Settings auto-save, calendar-only Save/Discard, default setting placement, five-profile pagination, six equal familiar-face cards/sliding cache, deliberate participant-picker opening and bell-based confirmation recovery. These supersede earlier contradictory layout/refresh/save recommendations. Profile/travel saving and portable backups were completed in 0.9.2.

## 0.9.2 amendments

- Profiles save valid changes live; failed/invalid edits keep their saved value and remain visible. Own-profile setup retains Continue.
- Flight/travel forms exit through Save or Discard only. Flights have no X/back/Escape exit or resumable draft. Return flight can save two independent entries together.
- Portable file operations follow the [confirmed identity/replacement/compatibility contract](export-import.md). Only meeting drafts are resumable, and full restore clears them.
- Dialog titles/focus, timezone keyboard behavior, purpose-based advanced sections, calendar-link status and initial wording are implemented with the supplied design language.
\n## 0.9.3 accessibility and owner review\n\nThe open review covers overall flows, buttons, layouts across screen widths and wording. Only the owner decides when that experience is ready. Accessibility engineering proceeds separately: keyboard/combobox behavior, contextual labels, dialog focus, visible/associated validation, text contrast and reflow received a tested pass. Enter in a booking field cannot implicitly send; the explicit send button supports normal keyboard activation. Flight forms retain Save/Discard only. See [technical coverage and limits](accessibility.md).\n


## 19 October search hotfix

Profile edits preserve the current meeting participant order, including people automatically added from its organizing calendar. Genuine calendar switches still remove the previous automatic participants and append newly linked people while preserving manual choices.

Own-profile automatically detected calendar time off may be proposed as a clearly warned overlap when ordinary options are unavailable. It stays in the calendar and does not create an instruction to reschedule a holiday. Saved overlap permission can include it among normal proposals, still with warnings. Explicit protections, manual blocks and saved flights remain blocking; other people’s time off remains protected. Missing calendar access is disclosed and does not itself exclude times. If hard protection leaves no options, identify the actual blocking entries and link to the relevant saved profile.

Timezone selection remains a closed list, searched through local city/country names, common timezone terms and spelling variants. Typing does not confirm a change. See the [dataset provenance and rebuild instructions](timezone-search.md). Regional holiday suggestions remain deferred in the roadmap.
