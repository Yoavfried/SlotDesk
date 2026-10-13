# Contributing to SlotDesk

Use Node.js 18 or later. The application and development scripts require no third-party npm packages.

## Before submitting a change

```sh
npm test
npm run test:calendar-kit
npm run check
npm run package:slotdesk
```

Record user-visible behavior in [UX decisions](docs/ux-decisions.md) or [scheduling decisions](docs/scheduling-decisions.md). Distinguish implemented, pending live validation, planned and deliberately deferred work. Update [product versions](docs/changelog.md) only for a product release; use the [repository changelog](CHANGELOG.md) for repository-only changes.

Follow the [design guide](design/README.md). Use the bundled VT323 wordmark without a separate background tile; lime fills the whole header. Preserve font licenses.

Calendar writes must remain explicit and reviewed. Creation and time-only rescheduling have separate allowlisted writers. Preserve account, role, event identity, recurrence, version, concurrency and same-operation recovery checks. Do not add deletion, calendar moves or automatic changes to other meetings without a new accepted scope and validation.

Use synthetic data in tests and screenshots. Do not commit exports, access tokens, OAuth client secrets, private keys or workplace event details. The pinned Chrome extension key and OAuth client ID are public identifiers, not secrets.

Mocked checks do not establish real Google invitation delivery, recurrence behavior or work-account readiness. Record controlled live results separately in [testing](docs/testing.md). Public distribution and a project-wide license remain pending decisions.
