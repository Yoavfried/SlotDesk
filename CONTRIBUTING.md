# Contributing to SlotDesk

SlotDesk is made by Speedy, Nina Banai and Yoav Fried. See [credits](AUTHORS.md).

Before proposing a feature, read the [roadmap](docs/roadmap.md), [UX decisions](docs/ux-decisions.md) and [scheduling decisions](docs/scheduling-decisions.md). Discuss changes to scheduling semantics or user-facing flows before implementing them. Final UX acceptance belongs to the product owners.

Use Node 22 for the checks run by CI:

```sh
npm test
npm run test:backend
npm run test:calendar-kit
npm run test:release
npm run check
npm run package:slotdesk
```

The extension has no dependency-install or frontend build step. The hosted registration function has its own dependencies in `backend/`. Use synthetic fixtures for development. Never commit credentials, real calendar exports or personal screenshots. Existing appointment changes must retain explicit review, account/target/version validation and duplicate-safe recovery.

Keep focused changes, meaningful validation and accurate documentation/changelog entries. Preserve the approved design assets and font/data licenses. Report vulnerabilities through [the security guidance](SECURITY.md).

Follow the [design guide](design/README.md): keep the VT323 wordmark without a separate background tile and let lime fill the header. Distinguish implemented, planned and deferred decisions. Product releases belong in [the product changelog](docs/changelog.md); repository-only changes belong in [the repository changelog](CHANGELOG.md). Do not add appointment deletion, calendar moves or automatic changes to other meetings without a new accepted scope and validation. Mocked results do not establish real invitation delivery, provider recurrence behavior or work-account readiness; record controlled live evidence separately.

SlotDesk uses the [MIT license](LICENSE). Contributions are provided under that license. Retain existing authorship and third-party notices; identify the license of any new third-party material. No contributor copyright assignment is required by this document.
