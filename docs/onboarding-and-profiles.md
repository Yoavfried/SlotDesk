# Onboarding, profiles and calendar scope

Profiles identify people by email. Calendar links provide availability information; they do not grant access to a calendar or establish that every commitment is known. See the [product overview](overview.md) and [current scheduling rules](new-meeting-current-contract.md) for the complete workflow.

## First setup

1. **Choose workspace calendars.** Select at least one accessible calendar. Events from excluded calendars are not used for browsing, scheduling, suggestions or alerts. A default invitation calendar is optional and is configured separately in Settings.
2. **Set up your profile.** Confirm your name, timezone and calendar links. The connected email identifies your own profile and cannot be edited. A name may be suggested from an exact-email match in selected calendar metadata; you can edit it before continuing.
3. **Add familiar people, if useful.** Up to six suggestions come from selected calendars. Confirm each person's timezone before saving, or skip adding suggestions and finish setup.

All steps must be completed to finish onboarding. If SlotDesk restarts before completion, it begins again at calendar selection with saved values available to prefill. Completed setup does not repeat at each start.

The final step explains registration and the optional project-updates choice. Registration sharing is optional in Firefox. See the [privacy notice](../extension/privacy.html).

## Workspace calendars and profile links

**Settings → Choose calendars** controls which calendars SlotDesk may use. Calendar names remain available to change that selection later. Saving the selection updates the workspace; Discard leaves it unchanged. The first required selection cannot be dismissed with an empty list.

A profile's **Availability calendars** links selected workspace calendars to that person's schedule. Choose **Add calendar**, select a source, and repeat if several calendars describe their availability. An all-day-entry setting can classify that source's whole-day entries as leave. Choosing the no-calendar option leaves availability unconfirmed while still allowing invitations.

Removing a calendar from workspace selection removes its profile links. A profile with no remaining links switches to unconfirmed calendar availability. Access loss or incomplete loading cannot establish checked availability. Calendar links and scope choices do not change Google sharing permissions or delete appointments.

The calendar picker in Existing meetings only filters the workspace's loaded cache. Hiding a calendar there does not disable its linked scheduling availability. Date changes and Refresh meetings load data again; calendar-filter and display-timezone changes use the cache.

## Manage profiles

Manage profiles provides live name/email search, five profiles per page, profile editing and a separate Travel & flights manager. Your profile appears first among matching results and cannot be removed individually. Saved profiles edit live; incomplete or invalid input does not replace the last valid configuration. An invalid saved-profile email reverts with an alert.

**More settings** contains working days/hours, convenience hours, blockers, notices/buffers, event detection and local meeting treatment. Event detection is off for new profiles. Managing a meeting's treatment changes scheduling rules for that profile; it does not edit the Google appointment. Saved trips are managed separately.

Profile suggestions use a limited account/calendar-scope cache. Entering Manage profiles before its 30-minute expiry extends that expiry; there is no manual refresh button. Expired suggestions refresh on a later visit.

## Meeting participants

A new meeting automatically includes all saved profiles linked to its organizing calendar. Switching the organizing calendar updates automatic additions while preserving manual additions and explicit removals. The actual invitation roster remains the one shown in review.

Enter an email to add a guest without saving a profile. The guest appears immediately with a meeting-only timezone selector. Confirm the timezone before searching; **Create profile** is optional. Temporary guests and meeting-specific overrides stay with the unfinished meeting and clear after confirmed creation or starting a new draft.

Profiles provide defaults. **Options for this meeting** overrides them only for the current meeting. Required/Optional attendance is separate from working-hour, convenience-hour and overlap preferences. See the [rule table](new-meeting-current-contract.md#independent-rules) for their effects and protected-time exceptions.

## Local storage and transfer

Profiles and settings are saved per connected account in the current browser. Another browser or computer starts with its own local workspace. Use [backup and import/export](export-import.md) to transfer configuration. Those files do not transfer credentials or change Google calendar sharing.
