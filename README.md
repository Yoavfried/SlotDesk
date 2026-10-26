![SlotDesk — make room for what matters](design/assets/slotdesk-banner.svg)

**0.9.4.9 · Google Calendar · private desktop-extension beta**

Version **0.9.4.9** automatically selects linked calendars in profile meeting management, keeps calendar choices in compact rows and replaces treatment buttons with a live dropdown showing automatic detection or manual overrides. Earlier onboarding/browser and timezone-overlay improvements remain available. [Release scope](docs/release-plan-0.9.4.9.md) · [Validation](docs/testing.md) · [Version history](docs/changelog.md). The [trip-based travel redesign](docs/trips-0.9.5.md) is planned for 0.9.5 and remains under owner review. The existing browser-independent Google service remains active; [compatibility](docs/browser-compatibility.md) and [store requirements](docs/extension-stores.md) retain their documented limits. Appointment logic and the wider UX remain open to owner review.

SlotDesk helps executive assistants find meeting times across people, calendars and timezones. Review a new invitation, browse existing meetings, edit its details and guests, or choose a new time for an appointment. Every calendar write requires an explicit review and confirmation.

Created and maintained by **[Yoavfried](https://github.com/Yoavfried)** and **[ninabanai-maker](https://github.com/ninabanai-maker)**. Part of **[Website name TBD]**. See [project credits](AUTHORS.md).

## What you can do

- Follow three-step onboarding: selected workspace calendars, your profile and optional familiar people. Incomplete setup starts again at calendars after reopening; completed setup is retained.
- Set up email-based profiles with searchable timezones, visible calendar mappings and direct Travel & flights access.
- Add email guests with a meeting-only timezone; saving a profile is optional. Automatically include profiles mapped to the organizing calendar.
- Use independent working/convenience preferences, recurring blockers and saved or per-meeting overlap ignoring. Explicit protected time remains blocked.
- Compare suitable times, with optional guests, comfort ranking and clear warnings when calendar coverage is incomplete.
- Create reviewed Google Calendar invitations with an optional Google Meet link.
- Browse multiple calendars and any date range, inspect guest responses and expand overlap details.
- Review an individual reschedule, including one recurring occurrence, while retaining the guests, meeting content and existing video link.
- Edit a meeting’s title, location, description and guest list through a before/after review.
- Follow up on declined invitations and plan replacement times for other overlapping appointments.

SlotDesk never moves another appointment automatically. Its application code has no calendar deletion or move operation. Calendar access and proposal confidence depend on the permissions actually granted.

## Try the approved pilot

Download the ZIP from [releases](https://github.com/Yoavfried/slotdesk/releases), extract it and open `START-HERE.html`. Load the Chromium ZIP as an unpacked desktop extension. Other target artifacts have explicit unsigned/source-only limits; consult the compatibility matrix. Google sign-in is currently limited to the owner's approved pilot audience; a work account also needs workplace approval.

For source installation, load the **`extension/`** folder. The repository move preserves the extension identity and Google OAuth configuration. [Installation and updates](docs/install.md).

## Develop locally

Node.js 18 or later; no application dependency installation is required.

```sh
npm run dev
npm test
npm run test:backend
npm run test:calendar-kit
npm run check
npm run package:slotdesk
```

The preview at `http://127.0.0.1:8770/` shows the disconnected interface. Calendar connection needs the installed extension. The browser-independent service is activated; use the updated extension to connect. The native Chrome pilot remains available as a fallback when that service is inactive. Target packages are generated in ignored `dist/`.

## Decisions, evidence and next work

| Read | Purpose |
| --- | --- |
| [Product overview](docs/overview.md) | Available features and current limits |
| [Onboarding and profiles](docs/onboarding-and-profiles.md) | Calendar scope, unsaved guests, automatic attendance and independent flexibility |
| [UX decisions](docs/ux-decisions.md) · [scheduling rules](docs/scheduling-decisions.md) | Accepted behavior, including unimplemented/deferred decisions |
| [Meeting editing](docs/meeting-editing.md) · [rescheduling](docs/rescheduling.md) | Guest/detail edits, individual time changes, alerts and manual follow-up |
| [Roadmap](docs/roadmap.md) | Outlook, distribution and explicitly deferred features |
| [Future LLM assistance](docs/llm-assistance.md) | User-supplied API keys, prepared prompts, email assistance and unconfirmed automation |
| [Validation record](docs/testing.md) | Automated coverage and reported live results |
| [Security and privacy](docs/security.md) | Write boundaries, local storage and work-account use |
| [Design language](design/README.md) | Original style guide, fonts and design assets |
| [Product changelog](docs/changelog.md) · [repository changelog](CHANGELOG.md) | Product releases and repository migration |

Current exact validation counts and per-browser scope are recorded in [the validation record](docs/testing.md), alongside 22 export-comparison checks. The onboarding, scope, guest and flexibility flows have synthetic browser/transport coverage; real Google guest-edit delivery has not been independently observed. Basic live creation and the first dense-calendar integrity comparison passed. The owner also reports working decline alerts, sensible proposals, successful rescheduling and correct overlap details. Work-account access depends on the organization allowing the extension and Google permissions.

![Overlap details with synthetic calendar data](docs/assets/overlaps-v070.png)

## Repository map

```text
extension/       Shared browser application, scheduling engine, bundled fonts and tests
docs/            Product decisions, architecture, roadmap and acceptance records
design/          Original design-kit references and documentation artwork
scripts/         Preview, validation, synthetic fixtures and ZIP packaging
.github/         Automated checks and contributor templates
```

The project remains private. A public software license has not been selected. Preserve the supplied font licenses and consult the [publication checklist](docs/publication.md) before wider distribution. Calendar exports, credentials and private workplace information do not belong in this repository.
