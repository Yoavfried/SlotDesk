# SlotDesk UX decision register

Implemented decisions are recorded through 13 October 2026. The [14 October product review](product-review-2026-10-14.md) records new planned directions and unresolved details separately. Implemented in 0.3.0 and retained in 0.6.1 unless stated otherwise. The [scheduling register](scheduling-decisions.md) supplies the underlying rules; this register describes the user experience.

| ID | Area | Agreed behavior | Status |
| --- | --- | --- | --- |
| UX01 | Profile identity | Profiles represent people by email, not calendars. Names, timezones and calendar mappings remain editable. | Implemented |
| UX02 | Own profile first | Set up the user's own email, name and confirmed timezone before normal use. Keep the setup short; advanced settings remain collapsed. The own profile joins a meeting only when explicitly selected. | Implemented |
| UX03 | Suggested profiles | After own-profile setup, suggest up to five people from recent/frequent calendar appearances. Deduplicate by email and omit the user's own and existing profiles. Suggestions need confirmation, especially timezone. Show them in the optional third setup stage and in Manage profiles, not in New meeting. | Implemented |
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
| UX42 | Meeting card/detail layout | Two logical card rows; upper-left origin tag; ordered Time & Date, Calendar, Organizer, Guests. Saved names resolve by email; actual email remains visible. | Implemented in 0.6.0 |
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

These requests change the intended next UX; current 0.7.1 behavior remains as documented above. Detailed proposals, edge cases and follow-up decisions are in the [product-review record](product-review-2026-10-14.md).

| ID | Area | Requested direction | Status |
| --- | --- | --- | --- |
| UX61 | Accessible travel | Travel & flights action on a person in Manage profiles; shared focused travel editor. | Planned |
| UX62 | Searchable timezone choice | Search and suggestions inside a closed timezone dropdown; shared accessible control. | Planned; refines UX21 |
| UX63 | Executive flexibility | Move Ignore working days/hours and proposed Ignore convenience into Advanced. Consider per-meeting overrides and explicit ordinary-meeting overlap permission; keep attendance/protected rules separate. | Planned; saved overlap defaults plus meeting overrides and hour-only ignoring agreed; ranking interpretation documented |
| UX64 | Main calendar mappings | Availability calendars in main profile setup, with an explicit no-access/unconfirmed state. | Planned; refines UX19/UX40 |
| UX65 | Email-only guests | Add email immediately; Create profile replaces Edit profile for unsaved people. Confirm timezone before searching without requiring a saved profile. | Planned; timezone policy agreed; replaces compulsory profile creation in UX04 |
| UX66 | Workspace calendar scope | Onboarding/Settings select sources whose events are shown/used anywhere; browsing filters operate within that scope. | Planned; will supersede read-all-accessible-source UX51 |
| UX67 | Organizing-calendar participants | Automatically include every mapped profile, including teams; respect explicit removal/manual inclusion and update automatic additions when the calendar changes. No separate owner assignment. | Planned; owner confirmed; refines UX02/UX58 |
| UX68 | Settings organization | Main identity/timezone/mappings, focused travel, coherent working/availability sections and advanced treatment rules; global scope/default/owner settings separate. | Proposed layout; controls inventory before implementation |

## Structured time inquiries — 14 October 2026

| ID | Area | Direction | Status |
| --- | --- | --- | --- |
| UX69 | Ask about times | One integrated inquiry flow covers one/many recipients and one/many options before creating an appointment. | Planned; owner requested |
| UX70 | Structured replies | Proposed Yes/Maybe/No per time, optional preference with multiple choices; distinguish missing replies. Localized times bind to immutable instants/options. | Proposed UX |
| UX71 | Inquiry finalization | Replies do not create an event. EA selects a time, reviews latest availability/recipients and separately confirms Calendar creation with existing recovery safeguards. | Planned boundary |
| UX72 | Shared response destination | Responses work while the EA is offline; choose email replies/Gmail API, a branded hosted page/service or Google Forms integration. Email delivery and permissions are separate decisions. | Architecture choice pending |

[Time-inquiry design](time-inquiries.md) records the flow, architecture paths, data/access boundaries and verification scope.
