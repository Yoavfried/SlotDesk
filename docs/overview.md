# Product overview

SlotDesk helps executive assistants find, compare and book meeting times across Google calendars and timezones. It runs in a browser side panel or full workspace tab. The current release is a closed desktop beta; Google connection is limited to approved accounts. See [installation](install.md) and [browser compatibility](browser-compatibility.md).

![SlotDesk workspace menu with synthetic data](assets/workspace-menu-light.png)

## Set up people and calendars

Onboarding begins with workspace calendars, followed by your profile and optional profile suggestions. At least one accessible calendar is required to complete setup. A default invitation calendar is optional; a writable organizing calendar must be selected before a new meeting can be searched or sent. Interrupted onboarding starts again at calendar selection with saved entries available to prefill.

Profiles identify people by email. Link calendars that describe their availability, select a timezone, and configure working days/hours, convenience hours, notices, buffers, blockers and event treatment. Profiles linked to the organizing calendar are included automatically unless removed from that meeting. Guests can also be added by email without saving a profile; their meeting timezone must be confirmed before searching.

## Find and create a meeting

Choose participants, duration, dates and search timezone. Each search refreshes selected calendar availability. Required participants determine feasibility; optional guests influence the ranking without blocking a suggestion. Options show each person's local time and relevant conflicts or restrictions. Unknown availability is shown separately from a known conflict.

The search compares times under the [current scheduling rules](new-meeting-current-contract.md), including qualified shorter or later alternatives. **Generate more options** appends further suggestions. A planning-email preview produces editable text for copying; it does not send mail or create an appointment.

Review the invitation's calendar, participants, time and other details before sending. A Google Meet link can be included. SlotDesk verifies uncertain results against the same event rather than immediately sending another invitation.

## Manage existing meetings

Browse one or more workspace calendars across a chosen date range. Adjust the display timezone, inspect guest responses and overlap details, and identify meetings created with SlotDesk. Calendar-filter changes use the loaded cache; date changes and Refresh meetings load data again. Incomplete loading is labelled.

Reviewed editing supports title, location, description and guest-list changes. Rescheduling changes the selected appointment's time, including one recurring occurrence, while retaining its other details. Alerts surface declined invitations and overlapping appointments for follow-up. No other appointment moves automatically.

## Plan trips

Each profile has a separate Travel & flights manager. Trips can contain multiple flights, connections and a return flight. Saved flights block meetings, and arrival times determine effective scheduling timezones. Matching calendar entries can supply flight details; estimates remain editable. Changes to linked calendar entries require review before updating a saved trip.

## Save and transfer settings

Profiles, preferences, trips and unfinished meeting details stay in the current browser. Local backups restore a workspace; selected-profile files transfer individual people and their settings. Imports check calendar references against the receiving account. They do not change Google appointments or calendar-sharing permissions. See [backup and import/export](export-import.md).

## Current limits

Google Calendar is the supported provider; Outlook is planned after the first public release. Public store distribution, wider platform coverage, cloud settings synchronization, email-reading and LLM features are not available. There is no calendar-event deletion or calendar-move feature.

See [security and privacy](security.md), [accessibility](accessibility.md), [validation](testing.md), [release history](releases/README.md) and [roadmap](roadmap.md) for details.

SlotDesk is made by **[Speedy](https://buildwithspeedy.com), [Nina Banai](https://github.com/ninabanai-maker) and [Yoav Fried](https://github.com/Yoavfried)**. Support: [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com).
