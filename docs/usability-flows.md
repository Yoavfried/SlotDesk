# Profile, Settings and travel usability flows

Planning baseline: 15 October 2026, 0.9.0 preview. This is the proposed next usability update, not implemented behavior. The [backup/import contract](export-import.md) is settled. Two save-policy choices below remain explicitly unanswered.

## Purpose and existing behavior

Retain the supplied design language and the short email/name/timezone/calendar profile setup. The current editor already has expandable advanced sections. Creating a new section menu is not itself a user benefit or a required change. Define improvements by the task they make easier, then choose the least disruptive layout that supports them.

The current source establishes these concrete review points:

| Current behavior | Usability consequence | Proposed direction |
| --- | --- | --- |
| Advanced contains several levels of expandable controls, including a combined convenience/radius/notice section. | Different rules are difficult to find and their effects are hard to distinguish. | Group by user purpose and split mixed concepts; existing expandable sections can remain. |
| Travel is a focused mode of the whole profile form; its handler can expose invalid hidden basic fields. | Saving a flight can require dealing with unrelated profile fields. | Give the travel task a focused form and a clearly defined save boundary. |
| Generic close buttons close the profile dialog directly. | Entered profile/travel changes can be discarded without an unsaved-change choice. | Use a consistent dirty-form close policy that preserves input until the user chooses. |
| Travel and flights are editable rows; Add creates a draft row before the final save. | It is not clear whether an individual entry is saved. | Show concise saved-entry summaries and a focused Add/Edit form with honest draft/saved status. |
| Profile rows show identity/timezone and Edit/Travel actions. | Calendar source configuration is not visible from the list. | Add a concise source status without claiming complete availability merely from an assignment. |
| Settings combines direct actions with preferences saved by a form. | It is not always obvious which changes have already been saved. | Make save behavior and the boundary of each task explicit; preserve the accepted calendar submenu behavior. |

These are source observations and design targets, not a claim that every proposed fix is implemented or that every browser behavior has been reproduced.

## Manage profiles

Keep the page's existing search, own-profile-first ordering and Edit/Travel & flights actions. Use a compact list rather than a grid of large cards. At narrow widths, keep the identity and actions in deliberate rows; a long email must not determine button width or wrap an action label. Truncate long values visually while keeping their complete values available accessibly.

Proposed top actions: Add profile, Import profiles, Export profiles. Import/export selection is a dedicated task; ordinary profile browsing does not become a permanent wall of checkboxes. Preserve search and scroll position when returning from an edit and return focus to that person's action.

Show one meaningful calendar-source summary per person: No calendars linked, 2 availability calendars, 1 calendar unavailable, or a specific exclusion status. Assigned sources alone do not establish that all availability was checked. Full coverage still depends on successful reads for the actual meeting interval.

Keep familiar-profile suggestions in a distinct section below saved people. Show at most the accepted five suggestions with an explicit refresh action and their loading/empty/unavailable state. Suggestions never create people automatically. Existing onboarding still offers them after own profile and calendar setup.

Own profile remains marked (you), first among matching results, and cannot be individually removed. A normal profile's removal action belongs in its editor, separate from Save. Its confirmation describes local profile/rule removal and any effect on an unfinished participant selection; it does not suggest that calendar events will be deleted. An unresolved calendar operation keeps its existing protection against deleting dependent local data.

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

Travel & flights remains directly reachable from Manage profiles. A link from profile editing can open the same task; it must honor the chosen unsaved-edit boundary rather than silently discarding or saving unrelated changes.

Profile scenarios:

- Changing a timezone updates the template behavior according to the accepted Jerusalem rule; it does not erase a manually entered schedule or rewrite explicitly zoned availability/travel/flight entries.
- Changing one flexibility checkbox does not silently change the other two. Show the consequences beside it; preserve the existing scheduling semantics.
- Duplicate emails receive a clear validation error rather than silently combining two manually edited people.
- An invalid field opens its containing section, keeps all other edits, associates the error with that field and brings it into view.
- Keyword lists and individual-event treatment explain what the change will affect. Empty lists must have a defined meaning verified against the engine; copy must not imply that clearing a list resets it unless that is the actual implemented behavior.
- Individual-event treatment identifies the loaded date range. Missing or busy-only details are explained rather than producing fabricated event names/controls. Reading for this editor stays within the person's selected, accessible sources and never changes appointments.
- A failed save retains the editor and entered values with a local actionable error. A successful save returns to the list and updates the person's row without a generic last-action banner.

## Concrete profile save walkthrough

Example: open a saved person, change their timezone, then change their working hours.

**Shared-draft proposal:** neither change is committed yet. Moving between sections preserves both edits. One fixed Save profile commits both and returns to Manage profiles. X/Escape with changes offers Keep editing or Discard changes. Returning between profile sections is not cancellation. This is the current recommendation and remains unapproved.

**Independent-section alternative:** saving the working-hours section commits that section even if the timezone edit is unsaved. The interface must then expose the differing saved/unsaved states and protect the timezone edit when leaving. This can support quick isolated edits but makes mixed editing harder to explain.

The owner has not chosen either model. Do not treat lack of an answer as consent to the recommendation. The recommendation should be assessed using this task rather than an abstract layout question.

## Travel & flights manager

Open directly from a person's Travel & flights button. The person's name/email is visible, so the form does not ask the EA to choose the person again. Display saved travel dates and flights as concise summaries, with Edit and Remove on each entry. Keep Add travel dates and Add flight distinct and easy to reach. A new entry is visibly an editor, not an apparently saved empty row.

Travel date form: optional label, first date, last date and destination timezone. Both dates are included. Show dates and timezone in the saved summary. Explain that these dates change the local timezone used for this person's scheduling. Preserve the existing whole-day travel model; this update does not infer a timezone schedule automatically from exact flight times.

Flight form: optional label; departure date/time/timezone; arrival date/time/timezone. Keep departure and arrival in visually distinct groups and use the system's clock/date display conventions. Explain once that the flight is protected and the existing two-hour windows around departure/arrival are inconvenient. Exact flight entry does not require an airline API or a flight number.

Travel/flight scenarios:

- A flight may arrive at an earlier local clock time or on another calendar date. Compare actual instants across the two timezones; require arrival after departure.
- Validate a nonexistent daylight-saving clock time beside its field. For a repeated clock time, make the ambiguity explicit and obtain an unambiguous instant; preserve an existing unchanged instant when editing imported/saved entries.
- Conflicting whole-day travel ranges with different timezones must be resolved explicitly; do not silently pick whichever record comes first. Whole-day dates still cannot express multiple destination zones within one day.
- Overlapping or repeated flight entries receive a specific local warning rather than automatic deletion/merging. Preserve the distinction between a duplicate and a real multi-leg itinerary.
- Removing an entry removes only that person's saved SlotDesk rule. It does not cancel a flight, edit an appointment or notify guests.
- Destination/date suggestions from existing deterministic clues remain suggestions for EA confirmation. Do not auto-adopt them and do not introduce LLM or airline services in this update.
- Failure to load calendar clues must not block manual travel/flight entry or make the EA fix unrelated hidden profile fields.

## Concrete travel save walkthrough

Example: open a person's Travel & flights, add an outbound flight, then start entering a return flight and cancel it.

**Per-entry proposal:** Save flight commits the outbound flight and returns to the updated list. Cancel on the return-flight form discards only that new entry. Closing the manager keeps the saved outbound flight. This is the current recommendation and remains unapproved.

**Whole-list alternative:** both entries belong to one travel-edit draft until Save travel & flights. Closing/cancelling the whole task would discard the outbound flight too unless it was saved first. The list must visibly state that it has unsaved changes.

Opening a separately saved travel manager from an unsaved profile editor needs an explicit save/discard/stay boundary; it must not save a changed name/timezone merely because Save flight was selected. If both tasks share a draft instead, label the final commit honestly. Settle this together with the profile save model before implementation.

## Settings

Keep Dark mode and Open full workspace at the top. Do not reintroduce profile editing or familiar-profile suggestions here. Organize the remaining controls into Display, Calendars, Local data & backups, and Recovery. Keep the registration's saved/waiting status and its conditional retry in an account/data area rather than as a global status banner.

- Display: clock and date ordering. Keep actual stored dates/instants unchanged when display changes. Preserve valid unsaved clock-input values when another window changes the display preference.
- Calendars: selected-source summary, Choose calendars and default invitation calendar. Keep the accepted same-size submenu, fixed Save calendars/Discard changes footer, X/Escape behavior and return to Settings. Retain staged display preferences while visiting the submenu. Distinguish saving that submenu from saving still-pending preferences on its parent.
- Local data & backups: Download full backup and Restore full backup, with the settled contract. Selected-person import/export belongs in Manage profiles, rather than duplicating the controls everywhere. A restore can also start during onboarding after identifying the receiving account.
- Recovery: operation history and relevant recovery actions. These remain distinct from importing a configuration file and never resend directly from history.
- Clear local SlotDesk data remains apart from routine actions, with its existing explicit confirmation and unfinished-operation guard.

Make current save semantics visible before changing them: dark mode currently applies immediately, clock/date/default preferences use Save preferences, and calendar selection has its own save. A consistent Settings save model needs to be assessed with the two profile/travel decisions; do not silently invent another independently saving behavior in each group.

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
- Escape first closes the active picker/child. A dirty editor follows the chosen save/discard policy; mandatory onboarding still cannot be bypassed. Do not trap the user indefinitely inside a picker.
- Timezone controls have names such as Departure timezone and Arrival timezone, distinct from the selected values. Preserve ordinary search-input editing keys. Arrows navigate results and Enter selects an option without accidentally submitting the parent task.
- Keep visible focus in both themes. Convey selected/expanded/disabled/error states programmatically and explain disabled controls beside the relevant setting. Icon actions have specific accessible names and practical hit areas.
- Associate errors with their fields, open the relevant section and retain other input. Announce useful local completion/progress without rereading the whole profile list or producing duplicate alerts.
- Keep the interface usable at narrow sidebar widths and increased zoom. Long identities, times and source names must not produce hidden action buttons or horizontal page overflow. Preserve the supplied logo/font/color language and sufficient readable contrast in both themes.
- Keep real send, destructive restore and removal actions deliberate. A key used to choose a search result must not also activate the confirmation button behind it. Do not remove normal native keyboard behavior indiscriminately.

References: [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [W3C combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). Automated checks alone do not establish complete accessibility conformance.

## Decisions and delivery

Confirmed: the backup/import contract, existing profile/calendar/scheduling semantics and the requirement to plan before implementation.

Open: the save boundary for basic/advanced profile editing, and whether travel is saved per entry or per whole-list session. The owner explicitly has no answer yet. A separate advanced-menu layout question was premature; establish a concrete task benefit before proposing navigation changes. Settings save consistency should be included when resolving those two boundaries, not added later as a surprise.

Next planning step: review the two concrete save walkthroughs, settle one coherent behavior for each task, then finalize the screen/action/copy inventory. Implementation and package/version changes follow that review. Use local synthetic data and focused keyboard/browser verification; no new real-Google checklist is assigned.
