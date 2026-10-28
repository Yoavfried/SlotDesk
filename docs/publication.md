# Distribution and publication decisions

SlotDesk's [source repository](https://github.com/Yoavfried/SlotDesk) became public on 28 October 2026 under the MIT license. Public source availability is separate from extension-store publication: Google access remains a closed beta, and Chrome, Edge and Firefox listings are not yet live. The [1.0.0 plan](release-1.0.0-plan.md) records the remaining distribution work; Outlook follows 1.0.0.

## Store preparation

See the [per-store readiness table](extension-stores.md) for Chrome, Edge, Firefox listed/unlisted, Safari and Opera. Generated packages are development/beta artifacts, not approved listings. [Browser evidence](browser-compatibility.md) and [Google activation](browser-signin-setup.md) are separate records. Publisher registrations are complete; final packages, reviewer access and store approvals remain separate steps.

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
