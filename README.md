![SlotDesk — make room for what matters](design/assets/slotdesk-banner.svg)

SlotDesk helps executive assistants find meeting times across Google calendars and timezones. Compare suggestions, review invitations, and manage existing meetings from a browser side panel or full workspace tab.

Made by **[Speedy](https://buildwithspeedy.com) — [Nina Banai](https://github.com/ninabanai-maker) and [Yoav Fried](https://github.com/Yoavfried)**.

[Website](https://buildwithspeedy.com) · [Downloads](https://github.com/Yoavfried/SlotDesk/releases) · [Documentation](docs/README.md) · [Support](mailto:support@buildwithspeedy.com)

**Closed beta:** Google connection is limited to approved test accounts. Store distribution is not yet available. The Chromium package can be loaded manually; the Firefox package is unsigned, and the Safari archive contains source preparation only. See [installation](docs/install.md) and [browser compatibility](docs/browser-compatibility.md).

## Features

- Find meeting times using each participant's timezone, working hours, convenience hours, calendar availability and scheduling preferences.
- Add saved profiles or email-only guests, mark guests optional, and compare clear and conflicting options with participant-specific details.
- Create a reviewed invitation with an optional Google Meet link, or copy a planning email containing the displayed suggestions.
- Browse multiple calendars, inspect guest responses and overlaps, and review edits to a meeting's details, guests or time.
- Set profile blockers, notices, buffers and event treatment. Plan trips with multiple flights, connections and arrival-time timezone changes.
- Back up profiles and settings locally, restore a workspace, or transfer selected profiles between installations.

Calendar changes require review and confirmation. SlotDesk does not automatically move other appointments and has no calendar-event deletion or calendar-move feature. Calendar access depends on the permissions granted by Google and your organization.

![Overlap details with synthetic calendar data](docs/assets/overlaps-v070.png)

## Install and update

1. Download the Chromium ZIP from [releases](https://github.com/Yoavfried/SlotDesk/releases) and extract it into a permanent folder.
2. Open your browser's extension manager, enable Developer mode, choose **Load unpacked**, and select the extracted folder containing `manifest.json`.
3. Open SlotDesk, connect an approved Google account, and complete calendar selection, your profile and optional profile suggestions.

When updating, replace the files in the existing folder and reload the extension. Keeping the same installation preserves its local profiles and settings. For source installation, load `extension/` instead of the repository root. [Full installation instructions](docs/install.md).

## Privacy and accessibility

Profiles, preferences, trips and unfinished meetings are stored in the current browser. They do not synchronize across devices. Ordinary backups exclude credentials and loaded calendar events. Onboarding registration sends the fields described in the [privacy notice](extension/privacy.html); sharing that record is optional in Firefox. Optional email updates use a separate checkbox. Store packages limit these to SlotDesk updates; the unpacked beta also offers updates about future projects.

Read [security and data handling](docs/security.md), [accessibility support](docs/accessibility.md), or [report a vulnerability privately](SECURITY.md). Use [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com) for support and privacy requests.

## Develop and contribute

Use Node.js 22, matching CI. The browser application has no dependency-install or frontend build step.

```sh
npm run dev
npm test
npm run test:backend
npm run test:calendar-kit
npm run test:release
npm run check
npm run package:slotdesk
```

The local preview runs at `http://127.0.0.1:8770/`. Google connection requires an installed extension. Generated packages are written to `dist/`. The hosted service has separate dependencies and setup instructions in [backend/](backend/README.md).

Read [contributing](CONTRIBUTING.md), the [design guide](design/README.md) and [current scheduling rules](docs/new-meeting-current-contract.md) before changing behavior. Use synthetic calendar data for development and issue reports.

## Project documentation

| Topic | Documentation |
| --- | --- |
| Using SlotDesk | [Product overview](docs/overview.md), [installation](docs/install.md), [backup and import/export](docs/export-import.md) |
| Scheduling | [Current New meeting rules](docs/new-meeting-current-contract.md), [meeting editing](docs/meeting-editing.md), [rescheduling](docs/rescheduling.md) |
| Platform and data | [Browser compatibility](docs/browser-compatibility.md), [security and privacy](docs/security.md), [accessibility](docs/accessibility.md) |
| Project plans and history | [Roadmap](docs/roadmap.md), [release notes](docs/releases/README.md), [changelog](CHANGELOG.md) |

## Repository layout

```text
extension/       Browser application, scheduling engine, tests and bundled assets
backend/         Google connection and onboarding registration services
docs/            User guides, technical references, decisions and release history
design/          Design guide, artwork and asset licenses
scripts/         Local preview, checks, synthetic fixtures and packaging
.github/         CI workflow and contribution templates
```

## License and credits

SlotDesk is available under the [MIT license](LICENSE), copyright 2026 Speedy, Nina Banai and Yoav Fried. Bundled third-party materials retain their own licenses. See [project credits](AUTHORS.md).
