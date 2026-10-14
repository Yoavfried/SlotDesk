# Onboarding, profiles and calendar scope — 0.8.0

Implemented 14 October 2026. This release covers accessible travel, main profile calendar assignments, searchable timezones, mapping-based automatic attendance, email-first guests, usual-hour convenience ignoring, participant-specific ordinary-overlap permission and workspace calendar selection. Larger settings redesign and optional LLM features remain future work.

## Three-step onboarding

1. **Set up your profile.** Confirm email, name and timezone. Availability calendars are visible in the main form. Exact email/calendar matches can be preselected; secondary owner matches remain suggestions. An explicit no-access option allows an unconfirmed profile. Working schedules and flexibility defaults stay in Advanced.
2. **Choose your workspace calendars.** Search the accessible calendar names/emails, select the sources SlotDesk should use and confirm a writable default invitation calendar. Start with relevant suggestions, not automatic access to every calendar. Explain on this screen that excluded events do not appear or affect suggestions, alerts or contact clues. Calendar names remain available so the selection can be changed later.
3. **Optionally add familiar people.** Show up to five contacts from selected calendars. Confirm each person's timezone before saving; Start using SlotDesk or I'll add people later both finish setup. Keep these suggestions available in Manage profiles. Do not make this step necessary for creating the first meeting.

Existing users keep their saved profiles, mappings and pending changes, but must explicitly confirm workspace calendar scope after upgrading. They do not repeat a completed own-profile setup or optional contact step. The scope migration preserves previously selected/default/mapped sources as suggestions. No events are read before confirmation, except the exact account-bound target of an already reviewed pending operation for recovery. That exception does not allow range browsing or unrelated reads.

Onboarding saves progress per connected account. Closing a setup dialog leaves its step reachable. The header/close control remains fixed while forms scroll. Searchable timezone controls use real supported options, keyboard search/selection and visible error handling; arbitrary typed timezone text is not saved. The supplied local fonts, VT323 wordmark, lime header and light/dark design tokens remain.

## One workspace scope, separate profile mappings

Settings → Calendars chooses eligible sources for every event/free-busy read: browsing, profile availability, suggestions, alerts, details and reviewed writes. Calendar-list metadata remains available for identity and source selection. The selection is enforced at the transport boundary, including pagination and free/busy calls, not merely as a rendered-list filter.

The Existing meetings picker filters the memory cache inside this workspace scope. Hiding a calendar from that list does not disable its mapped availability. Date changes and Refresh load the selected workspace calendars; selection/timezone changes remain local. Scope changes clear loaded/derived data and stale reviews, and refresh an active meeting list in another window.

Profile mappings describe sources used for a person; they neither grant sharing permissions nor prove every personal commitment is known. Full coverage means the linked sources actually loaded the requested interval successfully. An excluded/inaccessible source stays in the saved profile with an inactive warning; its data is not read. Choosing no access leaves availability unconfirmed. Excluding the default calendar requires an explicit replacement. The calendar of an unresolved write cannot be excluded until recovery finishes. No change to scope or mappings deletes Google appointments or changes Google's underlying OAuth grant.

## Participants and unsaved email guests

A new meeting automatically includes every saved profile mapped to its organizing calendar, including multiple team members. Switching the calendar updates automatic additions while preserving manual additions, explicit removals and attendee rules. Explicitly removed people stay removed within the draft; a new meeting restores defaults. Opening/editing/rescheduling an existing appointment preserves its actual roster.

Entering an email adds the person immediately. Saved people show Edit profile; unsaved people show Create Profile and a meeting-only timezone choice. Confirm that timezone before any scheduling search. Creating a saved profile remains optional and retains the person in the draft. Unsaved guests and meeting overrides survive reload/shared-window continuation; confirmed creation or starting a new draft clears this temporary draft data.

Existing-meeting editing also adds emails without forcing profile creation. Its already fixed time can be reviewed with unconfirmed guest availability and explicit warnings. Rescheduling offers temporary timezone confirmation for the search, with profile creation optional. The final invitation list always follows explicit participant choices, regardless of conflicts or unanswered/negative RSVPs.

## Independent scheduling preferences

| Control | Effect |
| --- | --- |
| Ignore working days and hours | Keeps saved schedules but disables their day/hour enforcement; usual convenience still ranks options unless separately ignored. |
| Ignore usual convenience hours | Omits usual time-of-day comfort penalties/ties. Working-day/hour limits remain their own control; flight buffers, configured meeting radii and manual inconvenient periods still count. |
| Allow overlaps with ordinary meetings | Permits disclosed, finite-cost ordinary conflicts for that person in main proposals. Hidden busy time is not automatically assumed ordinary. Protected events, flights and explicit blocks remain protected. |

Profile defaults are saved separately from Options for this meeting/search. An override affects that draft/search, not the saved person. Required/Optional attendance remains an independent choice. Existing profiles start with the two new preferences Off unless explicitly changed.

Compare effective required-person inconvenience and distance first. Among equally suitable permitted options, prefer fewer distinct affected appointments and lower disruption, then remaining comfort/attendance/time ties. A permitted daytime clash can beat a free 23:00 call when the executive still values usual convenience. Permission to overlap never implies permission to ignore late hours. All overlaps remain in warnings and final review, and affected appointments stay in place until separately rescheduled.

## Validation and scope

The [validation record](testing.md) separates synthetic transport/browser checks from actual account reports. Creation and existing-event writers retain reviewed payloads, account/access/version checks, shared locks and same-target uncertain-result recovery. This release adds no deletion, cancellation, calendar-move, email or LLM endpoint and no new Google scope. See [security/privacy](security.md), [UX decisions](ux-decisions.md) and [changelog](changelog.md).

![Selected workspace calendars at narrow width, with synthetic names](assets/onboarding-calendars-v080.png)
