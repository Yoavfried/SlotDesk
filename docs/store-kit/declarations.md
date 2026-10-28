# Permissions and data declarations — review draft

## Single purpose

Assist users in finding and managing meeting times using their selected Google calendars, saved participant rules and travel timezones.

| Permission or service | Actual use |
| --- | --- |
| `identity` | Opens Google authorization and receives the exact extension callback; legacy Chrome identity remains a beta fallback. |
| `storage` | Keeps the background connection in session storage. Profiles/settings use account-scoped local browser storage. |
| `sidePanel` — Chromium only | Opens the scheduling workspace beside the current tab; full workspace fallback remains. |
| `https://www.googleapis.com/*` | CalendarList, selected-calendar event/freebusy reads, reviewed event creation and narrow individual event updates. |
| SlotDesk hosted service origin | Google authorization-code exchange, refresh and registration intake. No Calendar event payload is sent to the leads table. |
| Firefox `authenticationInfo` | Google tokens and encrypted refresh-session proof used for sign-in. |
| Firefox `personallyIdentifyingInfo` / `personalCommunications` | Calendar account/participant identities and appointment information needed for scheduling and reviewed invitations. |
| Firefox optional `technicalAndInteraction` | Optional registration analysis record. No record is queued/sent before app opt-in and native permission; revocation prevents future submission. |

No remote JavaScript is executed. Fonts, scheduling logic, timezone/city lookup and airport estimates are bundled. There is no browsing-history collection, email reader, LLM service or cloud settings sync.

## Google OAuth scope justification

| Scope | Why needed |
| --- | --- |
| `calendar.calendarlist.readonly` | Identify the connected account, accessible calendars, timezones and writing permissions; let the user select scope/default calendar. |
| `calendar.events` | Read selected event details and guest responses, create reviewed meetings, and edit/reschedule existing appointments. App-created-event-only access cannot support existing/delegated meeting management. This Google grant technically permits broader operations, including deletion; SlotDesk’s own transports restrict the actions the product exposes. |
| `calendar.events.freebusy` | Read availability from selected calendars where only free/busy access is available. |

Review scopes against [Google’s scope reference](https://developers.google.com/workspace/calendar/api/auth). Provide a verification video showing the actual consent screen, matching client ID and every scope-dependent feature. A closed Testing audience is not public OAuth approval. [Google verification guidance](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification).

## Data flow

| Data | Destination/storage | Purpose and control |
| --- | --- | --- |
| Calendar events, attendees and free/busy | Google API → extension memory | Scheduling, meetings and alerts for selected sources; cleared on disconnect. |
| OAuth code/tokens | Google ↔ hosted sign-in function ↔ extension session | Authorization/refresh; server secret remains hosted; no token storage in Neon. Deployment logs/redaction must be checked. |
| Names, emails, timezones and scheduling/trip settings | Local browser storage; explicit local JSON exports | User configuration. Plaintext, account scoped. Backups do not transfer Google access. |
| Confirmed onboarding fields, completion time, random submission ID and browser label | Hosted intake → private Neon leads table | Registration analysis; optional in Firefox only. Repeated onboarding creates a new record; retries keep the same ID. Updates consent is separate. No automatic record expiry currently exists. |
| Uncertain outgoing Calendar change | Local workspace until resolved; limited recovery history | Read back the same operation and avoid blind replay. Automatic checking does not resend. |

The ordinary backup excludes drafts, credentials and lead records. The separate unreadable-storage recovery download contains the raw workspace and may include pending invitation details and registration metadata; disclose this distinction.

## Publication checks

- Reconcile store form categories with the complete data flow, including transient processing, not only database storage.
- Review optional analysis and updates consent against each store’s current rules. Firefox optional transmission is implemented; AMO acceptance is still a review outcome.
- Onboarding can suggest a name from selected-calendar organizer/attendee information before confirmation. Do not claim every registration field is necessarily typed from scratch. Confirm public Google Limited Use compliance for the exact prefill/analysis/update flow before submission.
- Publish the Google API Limited Use statement alongside the privacy notice, after confirming actual operation complies. [Google Limited Use policy](https://developers.google.com/terms/api-services-user-data-policy), [Chrome Limited Use](https://developer.chrome.com/docs/webstore/program-policies/limited-use).
- Use support@buildwithspeedy.com for support/removal and buildwithspeedy.com as the website. The public privacy URL is https://buildwithspeedy.com/slotdesk/privacy, verified live on 28 October 2026. Establish an owner-approved retention process using the [registration-removal procedure](../registration-data-removal.md) and retain the documented hosting-owner checks. Clear data/disconnect does not delete an already submitted lead.
