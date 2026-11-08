# Distribution and publication decisions

SlotDesk's [source repository](https://github.com/Yoavfried/SlotDesk) became public on 28 October 2026 under the MIT license. Version 1.0.0 is available on Chrome, Edge and Firefox through the [public store listings](install.md). Google Calendar access remains subject to the permissions granted by the account and its organization. Outlook follows 1.0.0.

## Store preparation

See [store status and release checks](extension-stores.md) for current and prospective channels. Use the public stores for normal installation and updates, or [GitHub releases](https://github.com/Yoavfried/SlotDesk/releases) for manual packages. [Browser evidence](browser-compatibility.md) and [Google activation](browser-signin-setup.md) are separate records.

- Maintain accurate automated and user-reported validation evidence; do not mark unperformed checks as passed.
- Confirm the target organization allows the extension and requested Google access for work-account use.
- Choose a supported extension installation/update channel and organization onboarding guidance.
- Follow the proposed [browser compatibility plan](browser-compatibility.md): explicit targets and evidence, stable per-store identities, appropriate manifests/redirects and browser-specific signing/distribution. Compatibility work and closed-beta OAuth do not by themselves authorize public store publication.
- Complete applicable Google OAuth/distribution approval and target-organization requirements.
- Source, reachable history, screenshots and downloadable artifacts were reviewed before source publication. Continue reviewing new changes and artifacts for credentials or private data. Keep intentionally public extension/OAuth identifiers distinct from secrets. [Review evidence](release-readiness-review.md).
- MIT was approved and adopted on 26 October 2026; retain the root LICENSE and bundled license copy. Preserve existing third-party/font/data license texts.
- Credit **Speedy**, **Nina Banai** and **Yoav Fried**, with [buildwithspeedy.com](https://buildwithspeedy.com) as the approved website and [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com) as support. Add real extension-listing links once published.
- The [public privacy notice](https://buildwithspeedy.com/slotdesk/privacy) is live and was verified on 28 October 2026. Use that canonical URL in store/OAuth forms and keep its privacy/storage/data-retention statements aligned with the actual store build. New data handling, email access, LLM or cloud backup requires updated decisions and disclosures.
- Link store descriptions to the public MIT source repository. Add real extension-listing links to the repository only once those listings exist.

Outlook is accepted future provider work. Email/appointment LLM extraction, flight APIs and meeting-content search remain [deferred](roadmap.md).
