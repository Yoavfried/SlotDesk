# Profile, Settings and travel usability flows

The owner began the [0.9.5 advanced-profile review](advanced-profile-review-0.9.5.md) on 22 October. That record supersedes the earlier proposed section order/wording and specifies accepted future rule changes; current 0.9.4.6 runtime is unchanged.

0.9.3.5 update: profile calendar editing now has separate Availability calendars and More settings expandables, fixed linked-calendar rows, explicit Add actions and no-access hiding. New profiles require explicit creation; saved invalid emails revert with a bell notice and own-profile email is locked. Explicitly deselecting calendars in Settings removes their profile links. The [validation inventory](profile-validation.md) supersedes earlier UI/save descriptions below where they differ. Individual advanced-section cleanup remains for 0.9.5.

Implemented: **0.9.2 · 18 October 2026**. Live profile saving, independent flight/travel Save/Discard, portable backups/imports, initial wording and keyboard refinements follow this record. Existing 0.9.1 Settings, layout and recovery behavior is retained.

## Purpose and existing behavior

Retain the supplied design language and the short email/name/timezone/calendar profile setup. The current editor already has expandable advanced sections. Creating a new section menu is not itself a user benefit or a required change. Define improvements by the task they make easier, then choose the least disruptive layout that supports them.

The current source establishes these concrete review points:

| Current behavior | Usability consequence | Proposed direction |
| --- | --- | --- |
| Advanced contains several levels of expandable controls, including a combined convenience/radius/notice section. | Different rules are difficult to find and their effects are hard to distinguish. | Group by user purpose and split mixed concepts; existing expandable sections can remain. |
| Travel is a focused mode of the whole profile form; its handler can expose invalid hidden basic fields. | Saving a flight can require dealing with unrelated profile fields. | Give the travel task a focused form and a clearly defined save boundary. |
| Generic close buttons close the profile dialog directly. | Live profile changes and temporary flight-form values have different save boundaries. | Save valid profile settings live; keep unfinished flight/travel forms open until Save/Discard and failed/invalid local edits. |
| Travel and flights are editable rows; Add previously created an unsaved inline row before the final save. | It is not clear whether an individual entry is saved. | Show concise saved-entry summaries and a focused Add/Edit form with explicit Save/Discard and a saved-entry list. |
| Profile rows show identity/timezone and Edit/Travel actions. | Calendar source configuration is not visible from the list. | Add a concise source status without claiming complete availability merely from an assignment. |
| Main Settings already saves immediately in 0.9.1; calendar selection has its own Save/Discard. | This distinction is settled. | Retain it and add the planned local backup/restore controls without restoring Save preferences or ordinary recovery-history navigation. |

These are source observations and design targets, not a claim that every proposed fix is implemented or that every browser behavior has been reproduced.

## Manage profiles

Keep the page's existing search, own-profile-first ordering and Edit/Travel & flights actions. Use a compact list rather than a grid of large cards. Keep the 0.9.1 five-profile pagination and live search. Edit remains above Travel & flights at every width; a long email must not determine button width or wrap an action label. Truncate long values visually while keeping their complete values available accessibly.

Proposed top actions: Add profile, Import profiles, Export profiles. Import/export selection is a dedicated task; ordinary profile browsing does not become a permanent wall of checkboxes. Preserve search and scroll position when returning from an edit and return focus to that person's action.

Show one meaningful calendar-source summary per person: No calendars linked, 2 availability calendars, 1 calendar unavailable, or a specific exclusion status. Assigned sources alone do not establish that all availability was checked. Full coverage still depends on successful reads for the actual meeting interval.

Keep familiar-profile suggestions in a distinct section below saved people. Retain the six equal suggestions, two-/three-column layout, sliding 30-minute account/scope cache and automatic entry-triggered refresh from 0.9.1. Keep loading/empty/unavailable states; do not restore a refresh button. Suggestions never create people automatically. Existing onboarding still offers them after own profile and calendar setup.

Own profile remains marked (you), first among matching results, and cannot be individually removed. A normal profile's removal action belongs in its editor, separate from routine live-edit controls. Its confirmation describes local profile/rule removal and any effect on an unfinished participant selection; it does not suggest that calendar events will be deleted. An unresolved calendar operation keeps its existing protection against deleting dependent local data.

## Profile editor and advanced controls

Basic screen: Email, Name, Timezone, Availability calendars. Keep the existing closed-choice source rows and Add another calendar. Clearly distinguish no assignment, excluded source, missing access and busy-only access. Do not require a linked source to save a person. Timezone help/clues belongs beside timezone selection rather than in an unrelated advanced block; suggestions still require confirmation.

Reorganize the existing advanced controls by purpose. The following grouping is a proposal, not a requirement to introduce separate pages:

| Group | Controls and behavior |
| --- | --- |
| Working days and hours | Ignore working days/hours; template/manual choice; template day/hour choices or per-day controls. Keep inactive mode data. Explain disabled controls. |
| Preferred hours | Local start/end and Ignore usual convenience hours. Explain its ranking effect and retained non-hour inconvenience rules. |
| Available times | Recurring windows or exact starts, explicit timezone, optional date limits, plus this person's protected/inconvenient periods. Hide an unused end-time field when Exact start is selected. |
| Meeting rules | Ordinary-overlap default, time around meetings and its blocked/inconvenient treatment, minimum notice. Keep zero buffer/notice defaults and distinguish profile defaults from meeting overrides. |
| Special dates | Date-range leave/holiday exceptions for this person. State that unrelated appointments/protected periods still apply. |
| Event treatment | Title matching, airport-route protection and individual-event treatment. Keep these local scheduling rules clearly separate from editing a Google appointment. |

Travel & flights remains directly reachable from Manage profiles. The same person’s profile contains its flight list and Add flight action. Opening an individual flight form does not create a resumable profile or flight draft or change how other profile settings save.

Profile scenarios:

- Changing a timezone updates the template behavior according to the accepted Jerusalem rule; it does not erase a manually entered schedule or rewrite explicitly zoned availability/travel/flight entries.
- Changing one flexibility checkbox does not silently change the other two. Show the consequences beside it; preserve the existing scheduling semantics.
- Duplicate emails receive a clear validation error rather than silently combining two manually edited people.
- An invalid field opens its containing section, keeps all other edits, associates the error with that field and brings it into view.
- Keyword lists and individual-event treatment explain what the change will affect. Empty lists must have a defined meaning verified against the engine; copy must not imply that clearing a list resets it unless that is the actual implemented behavior.
- Individual-event treatment identifies the loaded date range. Missing or busy-only details are explained rather than producing fabricated event names/controls. Reading for this editor stays within the person's selected, accessible sources and never changes appointments.
- A failed live save keeps the entered values visible and shows an actionable local error; never claim Saved after storage failure. Successful changes keep the profile open and update its saved data without a generic last-action banner.

## Confirmed live profile editing

Owner decision, 18 October: edit profile settings directly and save changes on the spot. Existing profiles have no general Save profile or Discard buttons and no whole-profile Save/Discard prompt during normal navigation.

Example: changing the timezone saves that valid choice immediately; changing working hours saves the valid schedule as well. Returning between advanced sections or closing the profile keeps those changes. No later flight save is needed to commit them. All of these are local SlotDesk settings, not Google appointment edits.

Implementation defaults supporting that decision:

- Checkboxes and dropdowns save valid changes immediately. Text inputs save after a brief typing pause or leaving the field, without a separate button. Do not write on every keystroke.
- Related values form one valid change: an unfinished email, invalid clock value or half-entered date/time range must not replace the last valid saved setting. Show a field-specific error, keep the input visible and make clear that it is not saved. Fixing it triggers automatic saving.
- Save valid profile changes quietly. The 0.9.3.5 follow-up removes routine Saving/Saved status text; only validation and persistence errors are shown. Preserve input on failed persistence, allow retry, and do not silently lose a failed edit on profile close/navigation.
- New-person setup still needs valid required identity fields before a saved person exists. An incomplete form is not added to the saved-profile list. Onboarding keeps its explicit Continue/setup steps and registration choices; these are not a general profile-save action.
- Preserve inactive template/manual schedules, explicit timezones and the accepted scheduling semantics. A change must not reset unrelated settings.
- Merge live changes under the existing account/workspace protection. Do not overwrite another window’s newer fields with a stale whole-profile snapshot. Any actual same-field conflict keeps the existing explicit resolution behavior.
- Import/restore and destructive profile removal remain deliberate actions with their existing warnings. Live editing does not mean automatically applying an imported file.


## Travel & flights manager

The person’s profile has a list of saved, individually editable/removable flights, with **Add flight above the list**. Manage profiles’ existing Travel & flights action opens this person’s travel area directly; retain their name/email and never ask which person again. Add flight opens a focused form. Its exact actions are **Save** and **Discard**, returning to the same profile/list. Keep whole-day travel dates distinct from flights. An unfinished entry exists only in the open form; it is never stored as a resumable draft.

Travel date form: optional label, first date, last date and destination timezone. Both dates are included. Show dates and timezone in the saved summary. Explain that these dates change the local timezone used for this person's scheduling. Preserve the existing whole-day travel model; this update does not infer a timezone schedule automatically from exact flight times.

Flight form: optional label and origin/destination location text; departure date/time/timezone; arrival date/time/timezone. Locations can be cities/airports supplied by the user. They are optional display/prefill data, not an airline lookup or a substitute for an explicit timezone. Keep departure and arrival in visually distinct groups and use the system's clock/date display conventions. Explain once that the flight is protected and the existing two-hour windows around departure/arrival are inconvenient. Exact flight entry does not require an airline API or a flight number.

Travel/flight scenarios:

- A flight may arrive at an earlier local clock time or on another calendar date. Compare actual instants across the two timezones; require arrival after departure.
- Validate a nonexistent daylight-saving clock time beside its field. For a repeated clock time, make the ambiguity explicit and obtain an unambiguous instant; preserve an existing unchanged instant when editing imported/saved entries.
- Conflicting whole-day travel ranges with different timezones must be resolved explicitly; do not silently pick whichever record comes first. Whole-day dates still cannot express multiple destination zones within one day.
- Overlapping or repeated flight entries receive a specific local warning rather than automatic deletion/merging. Preserve the distinction between a duplicate and a real multi-leg itinerary.
- Removing an entry removes only that person's saved SlotDesk rule. It does not cancel a flight, edit an appointment or notify guests.
- Destination/date suggestions from existing deterministic clues remain suggestions for EA confirmation. Do not auto-adopt them and do not introduce LLM or airline services in this update.
- Failure to load calendar clues must not block manual travel/flight entry or make the EA fix unrelated hidden profile fields.

## Confirmed individual flight and return-flight flow

Owner decision, 18 October: flights are separate saved items. Each flight can be edited or removed from the profile; Add flight is above that list and opens a Save/Discard form that returns to the profile.

Single flight: Save validates and saves that flight, then shows it in the profile list. Discard abandons that form without changing an existing flight. Editing uses the same form and actions. The flight form has no X or back action: Save and Discard are its only exit actions. Escape closes an active child picker first and otherwise leaves the form open. No flight form is stored, backed up or restored for later completion.

The **Return flight** toggle adds a second flight section in the same Add flight form:

- Prefill return departure from outbound arrival location/timezone, and return arrival from outbound departure location/timezone. For example, Jerusalem → London becomes London → Jerusalem. Location text does not infer a timezone; copy the explicitly chosen zones.
- Ask the user for return dates and times. Do not guess their length of stay, return clock times, or flight duration. Keep prefilled locations/zones editable and do not overwrite a return field the user has changed.
- Save validates both flights and saves both in one local operation, then returns to the profile with two independently editable/removable entries. If either is invalid or persistence fails, neither is added. Discard adds neither flight.
- Switching the toggle off excludes the return flight from Save; preserve its temporary field values only within that open form in case it is switched back on. No previously saved flight is deleted by toggling.
- Compare real instants across timezones, including overnight/date-line and daylight-saving cases. Each arrival follows its departure; the return departure must not precede outbound arrival.
- Editing or removing one saved flight does not silently edit/remove the other. Existing saved flights and unrelated live-saved profile changes are unaffected by Discard.
- Saving a return pair does not automatically create an inferred whole-day travel range. The existing whole-day timezone plan remains separately entered and confirmed.

For whole-day travel entries, use the same focused per-entry Save/Discard pattern as an implementation default, while retaining their inclusive dates and destination timezone. This consistency choice is inferred from the flight decision; it is not a separately quoted owner instruction. No whole-list Save travel & flights remains.

No airline API, flight number lookup, email reading or LLM inference is introduced. Existing flight protection and two-hour inconvenience windows remain unchanged.


## Settings

Retain the implemented 0.9.1 experience: Dark mode and Open full workspace at the top; clock/date/default-calendar changes save immediately; Choose Calendars opens the same-size submenu with fixed Save/Discard and returns to Settings. Default invitation calendar is chosen only in main Settings. Clear Data remains red at the bottom of scrollable content; main Settings has no save button or fixed footer. Keep the registration status and conditional retry local to Settings.

Add the planned Local data & backups actions here: Download full backup and Restore full backup, following the settled replacement/own-profile contract. Selected-person import/export belongs in Manage profiles. Restore can also start during onboarding after identifying the receiving account. Do not restore ordinary recovery-history navigation; exceptional recovery stays attached to the affected calendar operation.


## Wording pass

Review labels together with helper text, validation, empty states and save outcomes. Keep instructions short and specific to the current task. Do not expose internal model IDs, technical cost scores, implementation terms or instructions aimed at developers. Keep explanations beside consequential controls and avoid repeating the same warning in several large panels.

| Existing phrase/concept | Proposed wording direction |
| --- | --- |
| Notice (hours) | Minimum notice; explain how far ahead a meeting must start. |
| Meeting radius | Time before and after meetings; one symmetric minute value, with Inconvenient or Blocked treatment. Keep zero as default. |
| Convenience hours | Preferred hours; validate the explanation against the existing usual-hour and last-resort rules. |
| When they CAN attend | Available times; distinguish an allowed window from an exact start. |
| Window end (unused for exact start) | Hide this input for an exact start rather than explaining an unused field. |
| Inexpensive override | A user-facing classification such as Flexible hold, only if it accurately describes the engine's behavior. |
| Movable / override | Describe ordinary conflict treatment without suggesting that the appointment moves automatically. |
| Event rules — you have full control | Event treatment, with concrete categories and a clear local-rule explanation. |
| Advanced: exact flights | Flight details in the focused flight form. |
| Refresh calendars to see individual events | A relevant Load meetings action with the actual person/date range and missing-access explanation. |

Use the same names in profile defaults, per-meeting overrides, warnings and Help. Avoid inventing a different word for each screen. This is the first copy pass around the reviewed screens; broader meeting-management/booking/recovery copy can follow.

## Keyboard and accessibility acceptance targets

- Complete Add/Edit profile, advanced-rule editing, travel/flight entry, Settings/calendar selection, import selection and restore confirmation using the keyboard.
- Give every popup an accessible title and a sensible initial focus. Keep focus inside an active modal and return it to the invoking control or a logical updated row on completion.
- Escape first closes the active picker/child. Valid live-saved profile edits need no discard prompt; an unfinished flight/travel form uses its explicit Save/Discard boundary. Failed/invalid edits stay visible rather than being silently lost. Mandatory onboarding still cannot be bypassed.
- Timezone controls have names such as Departure timezone and Arrival timezone, distinct from the selected values. Preserve ordinary search-input editing keys. Arrows navigate results and Enter selects an option without accidentally submitting the parent task.
- Keep visible focus in both themes. Convey selected/expanded/disabled/error states programmatically and explain disabled controls beside the relevant setting. Icon actions have specific accessible names and practical hit areas.
- Associate errors with their fields, open the relevant section and retain other input. Announce useful local completion/progress without rereading the whole profile list or producing duplicate alerts.
- Keep the interface usable at narrow sidebar widths and increased zoom. Long identities, times and source names must not produce hidden action buttons or horizontal page overflow. Preserve the supplied logo/font/color language and sufficient readable contrast in both themes.
- Keep real send, destructive restore and removal actions deliberate. A key used to choose a search result must not also activate the confirmation button behind it. Do not remove normal native keyboard behavior indiscriminately.

References: [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [W3C combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). Automated checks alone do not establish complete accessibility conformance.

## Decisions and delivery

Confirmed: live profile editing without general Save/Discard; individual flights with Save/Discard and an optional return flight in the same form; the complete backup/selected-profile import-export contract; existing calendar/scheduling policies; and the 0.9.1 Settings, suggestion-cache and layout refinements.

The two previously unanswered save-policy questions are resolved. The whole-day travel form follows the documented per-entry implementation default. No additional blocking product question is identified for this scope; handle ordinary validation, persistence and accessibility details against these decisions.

Implemented and locally verified in 0.9.2. Synthetic coverage includes failed live saves, invalid intermediate input, concurrent windows, pair atomicity and portable configuration. Help/privacy and release records are updated. No new real-Google test checklist is assigned. Only meeting drafts can be saved and resumed; flight/travel form values exist only while the Save/Discard window is open.
