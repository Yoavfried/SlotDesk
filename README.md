![SlotDesk — make room for what matters](design/assets/slotdesk-banner.svg)

**0.7.0 · Google Calendar · private Chrome pilot**

SlotDesk helps executive assistants find meeting times across people, calendars and timezones. Review a new invitation, browse existing meetings, or choose a new time for an appointment. Every calendar write requires an explicit review and confirmation.

Created and maintained by **[Yoavfried](https://github.com/Yoavfried)** and **[ninabanai-maker](https://github.com/ninabanai-maker)**. Part of **[Website name TBD]**. See [project credits](AUTHORS.md).

## What you can do

- Set up email-based profiles with a confirmed timezone, working schedules, travel and availability constraints.
- Compare suitable times, with optional guests, comfort ranking and clear warnings when calendar coverage is incomplete.
- Create reviewed Google Calendar invitations with an optional Google Meet link.
- Browse multiple calendars and any date range, inspect guest responses and expand overlap details.
- Review an individual reschedule, including one recurring occurrence, while retaining the guests, meeting content and existing video link.
- Follow up on declined invitations and plan replacement times for other overlapping appointments.

SlotDesk never moves another appointment automatically. Its application code has no calendar deletion or move operation. Calendar access and proposal confidence depend on the permissions actually granted.

## Try the approved pilot

Download the ZIP from [releases](https://github.com/Yoavfried/slotdesk/releases), extract it and open `START-HERE.html`. Load the extracted folder as an unpacked Chrome extension. Google sign-in is currently limited to the owner's approved pilot audience; a work account also needs workplace approval.

For source installation, load the **`extension/`** folder. The repository move preserves the extension identity and Google OAuth configuration. [Installation and updates](docs/install.md).

## Develop locally

Node.js 18 or later; no application dependency installation is required.

```sh
npm run dev
npm test
npm run test:calendar-kit
npm run check
npm run package:slotdesk
```

The preview at `http://127.0.0.1:8770/` shows the disconnected interface. Calendar connection uses Chrome extension identity. The package is generated in ignored `dist/`.

## Decisions, evidence and next work

| Read | Purpose |
| --- | --- |
| [Product overview](docs/overview.md) | Available features and current limits |
| [UX decisions](docs/ux-decisions.md) · [scheduling rules](docs/scheduling-decisions.md) | Accepted behavior, including unimplemented/deferred decisions |
| [Rescheduling](docs/rescheduling.md) | Individual time changes, alerts and manual follow-up |
| [Roadmap](docs/roadmap.md) | Outlook, distribution and explicitly deferred features |
| [Validation record](docs/testing.md) | Automated coverage and reported live results |
| [Security and privacy](docs/security.md) | Write boundaries, local storage and work-account use |
| [Design language](design/README.md) | Original style guide, fonts and design assets |
| [Product changelog](docs/changelog.md) · [repository changelog](CHANGELOG.md) | Product releases and repository migration |

Local validation includes 1,146 synthetic application checks and 22 export-comparison checks. Basic live creation and the first dense-calendar integrity comparison passed. The owner also reports working decline alerts, sensible proposals, successful rescheduling and correct overlap details. Work-account access depends on the organization allowing the extension and Google permissions.

![Overlap details with synthetic calendar data](docs/assets/overlaps-v070.png)

## Repository map

```text
extension/       Chrome application, scheduling engine, bundled fonts and tests
docs/            Product decisions, architecture, roadmap and acceptance records
design/          Original design-kit references and documentation artwork
scripts/         Preview, validation, synthetic fixtures and ZIP packaging
.github/         Automated checks and contributor templates
```

The project remains private. A public software license has not been selected. Preserve the supplied font licenses and consult the [publication checklist](docs/publication.md) before wider distribution. Calendar exports, credentials and private workplace information do not belong in this repository.
