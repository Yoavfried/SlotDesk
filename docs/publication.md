# Distribution and publication decisions

The [1.0.0 plan](release-1.0.0-plan.md) records the latest owner direction: finish 0.9.5, prepare Chrome/Edge/Firefox publication, the public repository and licensing, then return to Outlook after 1.0.0.

## 0.9.4.6 store preparation

See the [per-store readiness table](extension-stores.md) for Chrome, Edge, Firefox listed/unlisted, Safari and Opera. Generated packages are development/beta artifacts, not approved listings. [Browser evidence](browser-compatibility.md) and [Google activation](browser-signin-setup.md) are separate records. No public visibility change or publisher-account purchase is authorized by this release.

The repository is private and the product is an approved Google Calendar Chrome pilot. This document records unfinished distribution work; it does not authorize a visibility change.

- Maintain accurate automated and user-reported validation evidence; do not mark unperformed checks as passed.
- Confirm the target organization allows the extension and requested Google access for work-account use.
- Choose a supported extension installation/update channel and organization onboarding guidance.
- Follow the proposed [browser compatibility plan](browser-compatibility.md): explicit targets and evidence, stable per-store identities, appropriate manifests/redirects and browser-specific signing/distribution. Compatibility work and closed-beta OAuth do not by themselves authorize public store publication.
- Complete applicable Google OAuth/distribution approval and target-organization requirements.
- Review source, history, screenshots and downloadable artifacts for credentials or private data before public publication. Keep the intentionally public extension/OAuth identifiers distinct from secrets.
- MIT was approved and adopted on 26 October 2026; retain the root LICENSE and bundled license copy. Preserve existing third-party/font/data license texts.
- Credit **Speedy**, **Nina Banai** and **Yoav Fried**, with [buildwithspeedy.com](https://buildwithspeedy.com) as the approved website and [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com) as support. Add real extension-listing links once published.
- Keep privacy/storage/data-retention statements accurate for the actual architecture. Any backend, email access, LLM or cloud backup requires updated decisions and disclosures.
- Make the repository public only after an explicit owner decision.

Outlook is accepted future provider work. Email/appointment LLM extraction, flight APIs and meeting-content search remain [deferred](roadmap.md).
