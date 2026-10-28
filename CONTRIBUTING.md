# Contributing to SlotDesk

Bug reports, documentation improvements and focused code contributions are welcome. Start with the [product overview](docs/overview.md), [current scheduling rules](docs/new-meeting-current-contract.md), [roadmap](docs/roadmap.md) and [design guide](design/README.md).

## Report a bug or propose a feature

Include the SlotDesk version, browser and operating system, steps to reproduce, and expected and actual behavior. Use synthetic or redacted examples. Never attach credentials, real calendar exports, private meeting details or unredacted personal screenshots.

For scheduling changes, describe how the proposed behavior affects required and optional guests, conflicts, timezones and fallback options. Discuss substantial changes before opening an implementation pull request. Report security vulnerabilities privately using [SECURITY.md](SECURITY.md).

## Set up locally

Use Node.js 22, matching CI. The extension has no dependency-install or frontend build step. Run `npm run dev` for a disconnected local preview, or load `extension/` as an unpacked extension. Google connection requires an approved beta account and configured OAuth credentials. The hosted services have separate instructions in [backend/](backend/README.md).

Run the relevant checks before submitting a pull request:

```sh
npm test
npm run test:backend
npm run test:calendar-kit
npm run test:release
npm run check
npm run package:slotdesk
```

Use synthetic fixtures for calendar operations. Record which checks ran and any environment limits. Mocked transport results do not demonstrate real invitation delivery, provider recurrence behavior or workplace approval. Accessibility checks and local browser instructions are documented in [accessibility](docs/accessibility.md).

## Submit a change

Keep the change focused and explain the user-visible result. Update documentation and the changelog when behavior changes. Follow the design guide for typography, wording, layout and bundled assets. Add meaningful regression coverage when changing scheduling, persistence or calendar writes.

Preserve these calendar-write boundaries:

- Require explicit review and confirmation before creating or changing a meeting.
- Recheck the connected account, target, permissions and provider version before writing.
- Preserve stable operation identifiers and read-back verification for uncertain results.
- Keep unrelated appointments unchanged. Event deletion, calendar moves and automatic changes to other appointments are outside the supported feature set.

Changes to those boundaries need a documented design and dedicated validation before implementation.

## License and attribution

Contributions are provided under the [MIT license](LICENSE). Retain existing authorship and third-party notices, and identify the license of any new third-party material. No contributor copyright assignment is required by this document. See [project credits](AUTHORS.md).
