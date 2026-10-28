# SlotDesk changelog

Changes are grouped as Added, Improved and Fixed. Entries describe the behavior released in each version, including same-version hotfixes.

## 0.9.5.7 — 28 October 2026

### Improved

- City-based trip entry with a prefilled departure city, route-based arrival calculation and recorded times from matching calendar flights.
- Connection city and second departure fields, plus return-route prefill.
- Distinct coordinates for cities sharing a timezone.

### Fixed

- Removed required arrival date/time and timezone fields from flight entry.
- Kept calculated arrival instants across date and daylight-saving changes.

## 0.9.5.6 — 28 October 2026

### Improved

- Clear after-work suggestions span up to three eligible dates, with at most one per day. Longer ranges use the first, middle and last eligible dates.
- When clear choices exist inside the selected dates, overlapping alternatives appear only through Generate more. Remaining clear dates appear before conflicting choices.
- Clear in-range choices prevent later-date fallbacks from expanding the search.
- Repository guides now focus on installation, features, contribution, security reporting, data handling and accessibility support.

### Fixed

- Release descriptions no longer repeat their titles. Dates and Added, Improved and Fixed sections remain visible.
- Updated outdated installation and profile-management guidance.

## 0.9.5.5 — 28 October 2026

### Improved

- Cancel loading uses a fixed place in the meeting-options section and remains available inside invitation-review and rescheduling dialogs.
- Planning-email copy buttons have consistent space below their fields.
- Release history uses public descriptions grouped as Added, Improved and Fixed.

### Fixed

- Duration edits immediately save valid values and remove outdated meeting options.
- Retrying an unfinished invitation preserves email-only guests and their confirmed timezones.
- Changes to overlap details or optional guests’ conflicts require another review before sending.
- Later-date suggestions follow the active working schedule and the timezone in effect at the workweek boundary.
- Generate more options can include a clear after-work choice before overlapping alternatives.
- Cancelling a search also stops the initial calendar-access check.
- Calendar-selection warnings correctly explain when profile calendar links will be removed.

## 0.9.5.4 — 28 October 2026

### Improved

- This week and Next week resolve their dates when a search starts. Custom dates remain unchanged when reopening SlotDesk.
- Excluded times start from the date currently shown in the search form.

### Fixed

- Meeting options no longer disappear after background saves when reopening a workspace with older relative dates.
- Removed the misleading Settings updated result placeholder. Changes to participants or search settings in another window still invalidate outdated options.

## 0.9.5.3 — 26 October 2026

### Improved

- Unsupported trip-file versions are rejected instead of being converted silently.
- Restoring a backup keeps the default invitation calendar optional.

### Fixed

- Fixed meeting searches failing with Invalid trip timezone history after a new profile’s first timezone confirmation.
- Automatically repair affected saved profiles and imported backups while preserving their selected timezone, trips, blockers and other settings. No data reset is required.

## 0.9.5.2 — 26 October 2026

### Improved

- The default invitation calendar is optional. New and unfinished meetings open directly, and an existing default can be cleared in Settings.
- Each meeting requires a writable organizing calendar before searching or sending. Onboarding requires at least one selected accessible calendar.
- Replaced the airplane drawing with a locally bundled Lucide plane icon.

### Fixed

- Email-only guests appear immediately as participant cards before timezone confirmation. They can join searches without a saved profile, and Create profile preserves their email and timezone without duplicating the participant.

## Project metadata — 26 October 2026

### Added

- MIT licensing, with credit to Speedy, Nina Banai and Yoav Fried.
- Public support at support@buildwithspeedy.com and project information at https://buildwithspeedy.com.

## 0.9.5.1 — 26 October 2026

### Added

- Optional registration-analysis sharing in Firefox, with a separate choice for project updates.

### Improved

- Firefox remembers registration-sharing preferences and respects permission revocation.
- Clarified privacy information about authentication, local configuration and recovery exports.

### Fixed

- Reject unsafe imported legacy matching expressions while retaining supported keyword rules.
- Remove temporary flight-editor fields from saved and imported trips, and safely render recurring-event identifiers.
- Prevent invalid sign-in origins from consuming shared sign-in capacity.
- Keep the Google sign-in endpoint when changing the registration endpoint.

## 0.9.5 — 26 October 2026

### Added

- A separate Trips manager with ordered flights, connections and return flights.
- Date-first flight entry with calendar matching, airport and city lookup, and editable arrival estimates when calendar details are unavailable.
- Alerts for possible flights and changes to linked flight events, with review before updating a saved trip.
- Participant local clocks that update every minute, plus SD icons for the browser toolbar, extension list and SlotDesk tab.

### Improved

- Flights block their full interval. Connections protect 30 minutes after arrival and before departure while allowing meetings during longer layovers; outer trip boundaries retain two-hour inconvenience buffers.
- Meeting timezone calculations follow flight arrivals. Round trips retain the saved profile timezone afterward; completed one-way trips update it to the destination while respecting later manual changes.
- Full backups and selected-profile files include trip links and timezone history.
- Trips remain saved when linked events change or become unavailable. Deleting a trip changes SlotDesk settings without deleting calendar events.

### Fixed

- Improved airport-name matching, dropdown positioning and flight-review freshness.
- Avoid duplicate linked-flight intervals and keep moved source events visible to scheduling until the trip change is reviewed.

## 0.9.4.9 — 26 October 2026

### Improved

- Manage meetings starts with all calendars linked to the profile selected. Changes to assignments update the list, while refreshes and date changes preserve chosen filters.
- A single treatment dropdown replaces separate Default, Ignore, Protect and Assign leave buttons. Default shows the current detected classification and updates with event-detection or all-day leave settings.

### Fixed

- Calendar checkboxes and names stay on the same row at narrow widths. Long calendar names truncate and reveal the full text on hover.

## 0.9.4.8 — 26 October 2026

### Added

- Registration records include the reported browser name. Each completed onboarding creates a separate record; retries of that completion do not create duplicates.

### Improved

- Updated onboarding and privacy information to describe registration records.

### Fixed

- Timezone search opens above nearby controls without enlarging its dialog. Click-away, focus departure and Escape close the list, and results stay within the viewport.

## 0.9.4.7 — 22 October 2026

### Added

- One-off and recurring profile blockers with date, weekday, all-day and timed controls.
- Category help and opt-in keyword detection for leave, flexible meetings and protected time.
- Profile-level Manage meetings with calendar and date filters, event details, and Default, Ignore, Protect or Assign leave treatment. Recurring entries support one occurrence or the entire series.

### Improved

- Organized advanced settings into Working days and hours, Convenience hours, Blockers, Notices and buffers, Travel & flights, Event detection and Manage meetings.
- Ignore working time and Ignore convenience independently remove their corresponding rules. Allow overlaps ignores ordinary conflicts for that person while preserving explicit protection, leave, flights, blockers and configured buffers.
- Later series-wide treatment replaces earlier occurrence exceptions; later occurrence changes affect only that instance.
- Preserve legacy availability and leave rules in saved settings and portable files.

### Fixed

- The header spans the panel while workspace scrolling stays below it. Narrow panels keep the logo and controls separate and use compact home cards.

## 0.9.4.6 — 21 October 2026

### Added

- Google authorization that can work independently of browser-account sign-in, with session-only credentials and reconnect/disconnect handling.
- Browser-aware sidebar or full-tab launch and separate Chromium, Firefox development and Safari source packages.
- Safe connection diagnostics in Help.

### Improved

- Onboarding starts with workspace calendars, followed by your profile and familiar people. Interrupted onboarding restarts at calendar selection with saved values available to prefill.
- Suggest the profile name from exact-email matches in selected calendar metadata without replacing typed text.
- Meeting options use three time-of-day groups and the earliest equally suitable start in each. Longer ranges show one compromise per eligible date.
- When the selected range has no suitable option, feature a clear later-date option and a clear in-range outside-working-hours option when available, followed by the nearest in-range compromises. Generate more appends options without replacing existing cards.
- Keep timezone and Review & create controls left-aligned; show concise warning headings and actual overlap intervals.

### Fixed

- Prevent unexpected page jumps from focus handling, header offsets and timezone-list scrolling.
- Include Sunday correctly for Sunday–Thursday working weeks.
- Keep the calendar-status icon beside each participant’s name and remove the duplicate selected-date caption.

## 0.9.4.5 — 20 October 2026

### Added

- An editable planning email covering all displayed options, with subject and message copy actions. Shared text omits internal calendar conflicts and includes known unavailable guests only when relevant.
- Meeting-wide excluded times and grouped overlap review with individual rescheduling actions.

### Improved

- Automatically consider useful shorter meetings and qualifying later dates. Generate more options adds three further choices without overlapping existing suggestions.
- Use compact participant rows with calendar icons, local times, one prioritized status and concise warnings.
- Show readable city/country or US city/state timezone labels throughout the interface and copied text.
- Simplify the search form by removing redundant advanced controls, diagnostic refresh, individual Copy option actions and excluded-candidate details.
- Per-person Ignore usual convenience hours can permit outside-range suggestions while preserving other active rules.

### Fixed

- Google connection failures now distinguish configuration, permission, browser-sign-in, network and canceled-consent problems with actionable messages and safe reference codes.

## 0.9.4 — 19 October 2026

### Added

- A unified Meeting options list with clearer conflict categories and actual result counts.

### Improved

- Prefer ten-minute starts, using five-minute starts when they improve conflict avoidance or optional attendance. Suggestions never use finer units.
- Treat required guests equally, prioritize guest working hours over permitted own-calendar overlaps, and prefer clash-free options over own working hours when guest fit is equal.
- Prefer requested duration and dates before shorter and later alternatives. Vary equally suitable options by time of day on the earliest eligible dates.
- Keep start spacing and options-per-day controls as advanced overrides.
- Show rescheduling follow-ups in Existing meetings and Alerts, with explicit actions for the existing appointment or the SlotDesk appointment. Show the latest alert scan as Last update.

### Fixed

- Remove rescheduling follow-ups from the main menu and retain them until dismissed or resolved.

## 0.9.3.5 — 19 October 2026

### Added

- Locally bundled DM Sans for ordinary interface text and consistent typography, navigation icons and spacing.
- Offline timezone search by city, country and common timezone name, including spelling tolerance.

### Improved

- Use sentence case throughout ordinary interface text while preserving names, brands and robotic accents.
- Separate Availability calendars and More settings. Add calendars from the selected workspace, show saved links as rows, and hide controls when no calendar access is selected.
- Lock the own-profile email. Invalid or duplicate edits to other profile emails restore the saved address with an alert; new profiles require a valid email and timezone.
- Own-calendar automatically detected time off can appear as a warned overlap alternative; explicit protection, flights and other participants’ leave remain blocking.
- Place Refresh meetings beside the meeting count and show actionable loading warnings above it.

### Fixed

- Keep participants in their existing positions after profile edits.
- Restart interrupted meeting loads when returning to Existing meetings, and prevent canceled responses from overwriting newer results.
- Keep timezone chevrons at the right edge and remove routine Saved messages while preserving real validation or storage errors.
- Removing a calendar from workspace selection removes its profile assignments; temporary read failures do not erase links.

## 0.9.3 — 18 October 2026

### Added

- Skip to workspace navigation and keyboard-operable profile suggestions with announced active choices.

### Improved

- Improve text contrast, input boundaries, focus outlines, target spacing, native color schemes and forced-colors support.
- Give dialogs clearer context, restore focus across nested dialogs and expose field-specific validation errors.
- Use slimmer participant cards with email beneath the name, timezone and local time, and an accessible calendar-connection icon.

### Fixed

- Prevent Enter in a meeting-review text field from sending invitations implicitly.
- Align the participant Add button, close suggestions on outside interaction or page scrolling, and keep the suggestion list below the header.
- Use a consistent Edit profile heading and shorter meeting-only overlap wording.

## 0.9.2 — 18 October 2026

### Added

- Full profile/settings backup and restore, plus selected-profile import and export with Select all.
- Cross-version column matching, missing-optional-field warnings and defaults, and required email/timezone validation for profile files.
- Independent flight and travel forms with Save or Discard and a return-flight shortcut.

### Improved

- Save valid profile changes immediately and merge unrelated changes from simultaneous windows.
- Include all supported profile settings, calendar references and time rules in portable files.
- Protect the own profile during selected-profile imports. Full restore changes its data only when the email matches, replaces other local configuration and clears the unsent meeting draft.
- Offer Download current backup before replacement, flag unavailable calendar references and block restoration while a calendar write is unconfirmed.
- Clarify advanced-setting groups, calendar-source status, dialog names and keyboard focus.

### Fixed

- Keep the last valid settings after invalid or failed edits. Roll back failed local replacements and prevent stale windows from restoring old configuration.

## 0.9.1 — 15 October 2026

### Added

- Bell alerts for unconfirmed creation, editing and rescheduling. Read-only checks resume after reconnecting or reopening; verified failures offer an explicit retry.

### Improved

- Save main Settings immediately, place Clear data at the bottom of the scrollable content, and keep Save/Discard in Choose calendars.
- Paginate profiles five at a time with live search, stack profile actions and show six consistently sized familiar-person suggestions.
- Reuse familiar-person suggestions within a 30-minute cache that extends when Manage profiles is reopened.
- Keep the New meeting profile picker closed until activated and remove duplicate profile-management and recovery-history shortcuts.

### Fixed

- Block calendar changes while offline and avoid duplicate writes when a confirmation is lost.
- Keep wordmark and header dimensions stable across window widths.

## 0.9.0 — 15 October 2026

### Added

- Connection, access, rate-limit and quota states with bounded read retries and cancellation.
- Onboarding registration with email, name, timezone, completion time and a separate optional project-updates choice.
- Read-only operation checks and explicit retry or manual-resolution handling for uncertain calendar changes.

### Improved

- Retain authorized meeting lists after temporary refresh failures, mark stale or incomplete data, and clear details when access is lost.
- Preserve unreadable workspaces for retry or download before an explicit reset. Retain proposed meeting edits when refreshing a changed appointment.

### Fixed

- Coordinate token renewal and calendar changes across windows. Reconnection does not automatically send an appointment.

## 0.8.1 — 14 October 2026

### Added

- Day-first and month-first date display independent of the clock format.
- Calendar metadata dialogs accessible from compact calendar rows.

### Improved

- Use single-row calendar choices, show the selected count below the list, and keep Settings/calendar dialogs the same size.
- Keep Save and Discard visible in calendar selection and return to Settings afterward. Initial setup requires a valid calendar selection.
- Keep the own profile first and remove its deletion action. Remove duplicate appearance and profile shortcuts from Settings.

### Fixed

- Contain long emails without shifting profile actions.

## 0.8.0 — 14 October 2026

### Added

- Three-step onboarding for your profile, workspace calendars and optional familiar people.
- Searchable timezone choices, prominent profile calendar assignments and direct Travel & flights actions.
- Email-only guests with required timezone confirmation and optional saved-profile creation.
- Saved and per-meeting convenience-hour and ordinary-overlap preferences.

### Improved

- Automatically add profiles linked to the organizing calendar while preserving manual participant choices when switching calendars.
- Use only selected workspace calendars for browsing, availability checks, suggestions and alerts, and clear excluded data across open windows.

## 0.7.1 — 13 October 2026

### Added

- Edit existing meeting titles, locations, descriptions, guests and required/optional roles with a before-and-after review.

### Improved

- Preserve retained guest responses, existing meeting times, Meet links, attachments and reminders. Explain invitation withdrawal before removing a guest.
- Refresh changed meetings in other open SlotDesk windows and recover uncertain saves against the same appointment.

### Fixed

- Prevent guest-list edits when the complete supported roster cannot be verified.
- Avoid false cross-window change detection caused by stored field ordering.

## 0.7.0 — 13 October 2026

### Added

- Reviewed rescheduling for timed meetings, all-day entries and single recurring occurrences.
- Declined-response alerts with optional-guest context, dismissal and rescheduling shortcuts.
- Overlapping labels and expandable conflict details across displayed calendars, including meetings created outside SlotDesk.

### Improved

- Prefer proposals requiring fewer distinct appointments to move, then lower disruption. Keep follow-ups for appointments affected by a new overlap.
- Preserve guests, content and existing Meet links during time changes; each reschedule is reviewed separately.

## 0.6.1 — 13 October 2026

### Added

- Inclusive start/end date browsing without a fixed day-count limit, multiple-calendar selection and an adjustable display timezone.

### Improved

- Keep source-calendar names in cards and details. Cache meetings for the selected range so calendar and timezone filters update locally; date changes and Refresh reload sources.

### Fixed

- Remove the meeting-browser pagination cutoff while keeping timeout and repeated-page protection.

## 0.6.0 — 12 October 2026

### Added

- Whole-week meeting browsing with Past and In progress states, two-row cards and structured details.
- Dropdown profile calendar assignments and secondary-calendar owner suggestions.

### Improved

- Show the organizing calendar before search. Prefer equally inconvenient times closest to preferred-hour boundaries and show useful labeled alternatives.
- Synchronize profiles, preferences and meeting drafts across same-account windows.
- Use accepted or tentative invitations as partial availability evidence without claiming full calendar knowledge.

### Fixed

- Display saved-profile names and actual organizer emails in meeting details.

## 0.5.0 — 12 October 2026

### Added

- A workspace menu for New meeting, Existing meetings and Manage profiles.
- Read-only calendar/timeframe browsing with event details, guest responses and Created with SlotDesk labels.

### Improved

- Move familiar-person suggestions to setup and profile management. Show successful creation in a separate confirmation dialog over the workspace menu.
- Keep dialog headings and close controls fixed while their contents scroll.

### Fixed

- Remove the routine status row and duplicate creation receipt.

## 0.4.3 — 12 October 2026

### Improved

- Consolidate proposal warnings into one counted expandable list and retain concise participant fit rows.
- Use the same warning details in final review and copied meeting information.

### Fixed

- Remove repeated conflict callouts, replace internal calendar-owner identifiers with readable instructions and wrap long warnings in narrow panels.

## 0.4.2 — 12 October 2026

### Improved

- Shorten proposal headings to weekday, date and time range; show the year only for future calendar years.
- Show date-specific GMT offsets beside timezone labels and preserve midnight and daylight-saving context.
- Focus participant rows on fit and reasons, with local times when participant timezones differ.
- Distinguish complete, incomplete and unknown calendar coverage, including optional participants.

## 0.4.1 — 12 October 2026

### Added

- General Help before and after sign-in, with an accessible privacy notice.

### Improved

- Use a compact lime header with logo, Help and Settings, plus a green-dot email badge and disconnect icon.
- Move Dark mode and Open full workspace to the top of Settings and remove the repeated privacy footer.

### Fixed

- Keep long connected-account emails on one line and remove duplicate connection labels and routine ready messages.

## 0.4.0 — 12 October 2026

### Added

- A dark-mode toggle and searchable saved-profile selection by name or email.

### Improved

- Separate profile management from participant selection and reset selected participants for new meetings.
- Clarify who receives invitations and preserve uncertain creation details for account-bound recovery.
- Restrict calendar changes to reviewed new-event creation and coordinate sending across windows.

### Fixed

- Clear editor and review data on disconnect, reject stale saved-state writes and correct response handling for shared calendars.
- Remove demo and simulated-send flows.

## 0.3.5 — 12 October 2026

### Improved

- Replace free-text timezone entry with closed dropdowns across profile, meeting, availability, travel and flight forms.
- Group supported timezones by region with readable place labels, preserve valid saved aliases and leave unknown values unselected for confirmation.

## 0.3.4 — 11 October 2026

### Added

- Repository-level preview, validation and reproducible extension packaging commands.

### Improved

- Organize extension source, documentation and design references. Bundle self-contained installation and Google-permission guidance.

## 0.3.3 — 11 October 2026

### Improved

- Render the VT323 wordmark directly on a full lime header with readable controls in light and dark modes.

### Fixed

- Remove the separate background box behind the logo.

## 0.3.2 — 11 October 2026

### Improved

- Align typography, spacing, components, light/dark colors, focus states and motion with the interface style guide.

## 0.3.1 — 11 October 2026

### Added

- Locally bundled VT323 and IBM Plex Mono fonts with their licenses.

### Improved

- Apply the wordmark and terminal-style typography to installation materials.

## 0.3.0 — 11 October 2026

### Added

- Email-based profiles, own-profile onboarding, contact suggestions and template or manual working schedules.
- Clock-format preferences, quick date choices, default calendar setup and editable invitation review.
- Google Meet links by default, with invitations sent to every retained participant.

### Improved

- Recheck availability before sending and recover uncertain creation results using the original appointment identity.

## 0.2.1 — 11 October 2026

### Added

- Read-only Google Calendar integration and installation guidance.

### Improved

- Separate Google project configuration from ordinary extension installation.

## Initial development — 7–11 October 2026

### Added

- A scheduling engine, Google Calendar reader, saved profiles and explicit calendar-coverage handling.

### Fixed

- Corrected person-specific constraints, outside-working-time calculations, tentative responses and event visibility.
