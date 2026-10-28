# Reviewer instructions — draft

SlotDesk is a Google Calendar scheduling extension. All code/fonts/data needed for the interface are bundled. There is no build/transpile step and no remote executable code. `npm run package:slotdesk` produces the browser-specific artifacts; Node 22 is used in CI. Preserve pinned font/data license files.

The Google OAuth app is currently in Testing. A reviewer needs an approved Google test account and consent to the requested Calendar scopes. Arrange a provider-approved review route through the store’s private reviewer-notes field; do not commit account passwords or bypass the approved audience. This remains a submission blocker until real access is arranged.

## Review flow

1. Install the matching signed/store package. Open SlotDesk from the toolbar (sidebar/panel or workspace tab).
2. Connect Google Calendar. Choose workspace calendars before setting up your own profile, then optionally add suggested profiles and finish setup. In Firefox, registration sharing is optional and defaults off; project updates are separate.
3. In New meeting, select participant profiles or add email guests and confirm their timezones. Search a date range; review local times and specific conflicts.
4. Review a new invitation before any send. Existing meetings opens selected calendars for the chosen range and supports reviewed individual editing/rescheduling.
5. In Manage profiles, review advanced rules, then open Travel & flights to review Trips. Trip changes are local configuration; they do not modify Calendar events.
6. Review Settings, privacy/help, backup/export/import and disconnect behavior.

Use disposable calendars and consenting participants for any actual send. Automated local checks use synthetic transports and do not prove the real Google/store route works. Do not treat the synthetic fixture as a publicly available demo or production sign-in path.

For Firefox include source ZIP, build command and explanations for any remaining `web-ext` warnings. Native Firefox installation, sidebar, permission cancellation/revocation, restart and real-provider checks remain required before claiming support.
