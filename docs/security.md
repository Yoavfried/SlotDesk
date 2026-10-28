# Security and data handling

SlotDesk reads Google Calendar information to suggest meeting times and applies calendar changes only after review and confirmation. This page describes the current data flow and safeguards. For a suspected vulnerability, follow [security reporting](../SECURITY.md). The [privacy notice](../extension/privacy.html) provides the full user-facing data notice.

## Calendar changes

The application supports three distinct operations:

| Operation | Supported change |
| --- | --- |
| Create | Insert the reviewed new invitation and read it back to confirm the result. |
| Reschedule | Change only the selected appointment's start and end, including one recurring occurrence. |
| Edit | Change reviewed title, location, description and explicit guest-list edits. |

There is no calendar-event deletion, calendar move or automatic rescheduling of another appointment. Removing a guest is an explicit invitation change: Google may withdraw that invitation from the guest's calendar while retaining the organizing appointment.

Before a write, SlotDesk checks the connected account, calendar access, target and reviewed inputs. Existing-event changes use the provider version to reject stale updates. Cross-window locks coordinate operations. Missing required lock support prevents a write.

An unconfirmed response retains the original operation and checks the same target before a retry. Creating an invitation uses a stable event identifier to avoid inserting a second event after a lost response. Read cancellation stops loading; it does not cancel a change already sent to Google. Alerts distinguish provider confirmation from a manually reported result.

Google's granted Calendar permission is broader than these application features. Choosing calendars inside SlotDesk controls what the application loads and uses; it does not narrow Google's underlying consent grant. Review the permission prompt and use only calendars your organization allows you to access.

## Where data is stored

| Data | Storage and use |
| --- | --- |
| Profiles, calendar mappings, preferences, blockers and trips | Unencrypted local browser storage, separated by connected Google account. |
| Meeting drafts and pending calendar changes | Local storage for continuation and verification. Pending records can include entered meeting details, recipients, identifiers and operation state. |
| Calendar lists, fetched events and free/busy results | Session memory for display and scheduling. Loaded event bodies are not part of ordinary workspace backups. |
| Profile suggestions | A limited derived name/email/ranking cache, separated by account and selected calendar scope. It has a sliding 30-minute expiry. |
| Alerts and follow-up metadata | Limited local records for responses, overlapping appointments and calendar-change verification. |
| Display preferences | Shared across SlotDesk windows in the current browser. |
| Google credentials | Browser memory/session storage for the hosted connection; the legacy Chrome connection uses Chrome's identity cache. Credentials are excluded from workspace settings and ordinary backups. |
| Onboarding registration | The confirmed email, name, timezone, browser label, completion time and updates choice are sent to the hosted registration service and stored in Neon. No calendar content is included. |

Local account separation does not protect against someone controlling the same browser profile, operating-system account or device. Use a protected browser and device for sensitive information. Saved settings do not synchronize between computers or browsers.

Registration sharing is optional and off by default in Firefox. Chrome and Edge record onboarding registration independently of the separate optional project-updates checkbox. Each completed onboarding creates a separate record; retrying the same submission does not create another. See the [privacy notice](../extension/privacy.html) for retention, removal and opt-out details.

## Google connection and hosted services

The hosted Google connection exchanges authorization codes and refreshes access using server-held credentials. Calendar reads and reviewed writes go directly from the extension to Google. The connection service handles credentials transiently; it does not store them in the registration database. The browser retains session credentials until the session ends, with a maximum seven-day session during the beta. Google passwords are never entered into SlotDesk.

Connection requests use state and proof-key validation, approved return addresses and credentials bound to the originating extension. The registration intake has an insert-only database role and exposes no record-listing endpoint. Browser-origin restrictions are not a substitute for authentication, and per-instance request throttling is not distributed abuse protection.

Current services are hosted on Vercel, with Neon storing onboarding records. There is no cloud settings database, email-reading service or LLM integration. Trip estimates use bundled airport data locally; no flight service receives the route.

## Calendar scope, profiles and trips

Only selected workspace calendars provide events and free/busy data for scheduling, profile suggestions and alerts. Calendar names remain available for selection. An exact target from an already reviewed uncertain operation may be read for recovery before setup is complete.

Profile event treatment, blockers and trips change local scheduling rules. They do not edit the source appointments. Linked flight changes require review before updating a saved trip. Missing calendar access does not silently remove a saved flight. Profile import and restore validate local configuration and calendar references; they do not change Google appointments or sharing permissions.

Calendar and profile text is displayed as text or escaped markup. Provider links are restricted to supported destinations. Application scripts, fonts, icons and lookup data are bundled; calendar content cannot supply executable extension code.

## Backups, disconnect and removal

Ordinary backup/profile files are unencrypted JSON. They contain selected profiles and their settings; full backups also include workspace/display settings. They exclude credentials, loaded appointment bodies, meeting drafts, registration records and calendar-change recovery. Treat exported files as sensitive.

The separate **Download saved data** action for an unreadable workspace exports raw local recovery data. It can contain unfinished invitation details and recovery records, so it requires greater care than an ordinary backup.

Disconnect clears the active connection and loaded calendar information while retaining saved configuration and unfinished operations. **Settings → Clear data** removes the connected account's saved workspace after unresolved calendar operations are handled. It does not delete Google appointments or remove a submitted registration record. Revoke the app separately through your Google account to remove its consent grant. Contact [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com) for registration correction, removal or updates opt-out.

## Verification and limitations

Source reviews and automated checks cover write allowlists, account/permission checks, stale versions, duplicate-safe recovery, local import validation and synthetic calendar integrity. The [validation record](testing.md) identifies versions, environments and remaining checks. These checks do not establish that every browser, Google configuration or future change is secure.

SlotDesk is in closed beta. Platform logging/redaction, broader abuse controls, store approvals and real-provider/device coverage remain part of [release-readiness work](release-readiness-review.md). This document is not a security certification. Workplace use also requires your organization's approval for the extension, Google permissions, hosted connection and local storage.
