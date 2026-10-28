# Road to 1.0.0

Owner direction, 26 October 2026: complete 0.9.5 and its review, then prepare public distribution. Outlook support is deferred until after 1.0.0. **1.0.0 means published extensions**, not only a version number or a packaged ZIP.

## Sequence

| Stage | Required outcome |
| --- | --- |
| 0.9.5 | Implement accepted trips/flights, minute clocks and the approved icon; review and fix regressions. Owner assesses the UX. |
| 1.0.0 preparation | Complete the store, provider, privacy/security, repository, licensing and installation/update work below. |
| 1.0.0 | Chrome Web Store, Microsoft Edge Add-ons and Firefox AMO listings are live, installation/update paths are verified, and the owner approves publication of the prepared repository. |
| After 1.0.0 | Plan and implement Outlook/Microsoft 365 support; settle connection/account UX first. |

Initial targets: **Chrome, Edge and Firefox**, confirmed by the owner. [The concrete submission kit](store-kit/README.md) contains listing copy, declarations, reviewer instructions, media and the remaining owner steps. Preparation build **0.9.5.1** implements Firefox-only optional lead sharing and security fixes; it does not mark 1.0.0 published. The owner supplied [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com) and [buildwithspeedy.com](https://buildwithspeedy.com) on 26 October; use them in repository, extension and store materials. Safari remains later platform work.

## Repository and attribution

Owner status, 26 October 2026: the product UX review is complete and the owner approved proceeding. Chrome registration/payment, Edge enrollment and Mozilla setup through the file-upload stage are confirmed. Store identities, submissions, technical release checks and public repository visibility remain separate from those completed steps.

Credit **Speedy**, **Nina Banai** and **Yoav Fried**, with the two real GitHub profiles in [AUTHORS](../AUTHORS.md). The approved website is [buildwithspeedy.com](https://buildwithspeedy.com). Do not add placeholder URLs. Add extension-platform links only once real listings exist; use the repository as the source-code destination in listings where supported. Do not invent store URLs.

Before making the repository public, review tracked files **and Git history** for credentials, private calendar/user data, internal access/configuration details that need not be published, obsolete artifacts and misleading claims. Remove unnecessary material and rotate any actual exposed credential; deleting a current file does not remove history. Keep useful source, installation/development instructions, decisions, changelogs, third-party notices and accurate support/privacy documentation. Public visibility remains a later owner action.

The required security/privacy review must cover both extension and hosted services, authentication/token lifecycle, selected-calendar scope, account/window isolation, imports, logs, registration/consent, stored data and reviewed calendar writes. Fix findings and record evidence and limitations. No finite review can establish an absolute guarantee that software has no vulnerabilities; do not advertise one.

## Adopted license

**MIT was approved by the owner and adopted on 26 October 2026**, copyright Speedy, Nina Banai and Yoav Fried. It permits people to use, modify, distribute and sell the source, including in larger proprietary products, while retaining the copyright/license notice. A later larger Speedy product may use more restrictive terms for its own code. Already distributed MIT-covered code remains usable under MIT; publishing it is not something later licensing can revoke for recipients following those terms. Contributions and third-party licenses must be reviewed before relicensing code the team does not own. Software licensing does not itself grant rights to the Speedy/SlotDesk names or branding.

The [root LICENSE](../LICENSE) and bundled `extension/LICENSE.txt` contain the adopted text. Preserve third-party font/data notices. [MIT text](https://opensource.org/license/mit) · [MIT permissions and conditions](https://choosealicense.com/licenses/mit/). Public repository visibility still requires final approval.

## Distribution gates

- Use [the store checklist](extension-stores.md) for real publisher accounts, platform identities, signing, listing assets, data declarations, reviewer access, provider approvals and actual install/update tests.
- Match the public privacy notice and optional-updates wording to the store build. Use support@buildwithspeedy.com for support/privacy contact and buildwithspeedy.com as the website. The website now deploys from `ninabanai-maker/TheBestProject/main`; prepare only a standalone SlotDesk privacy page, a small Privacy link and necessary concise factual corrections. Verify the planned `https://buildwithspeedy.com/slotdesk/privacy.html` route before using it in submission forms. No separate support page is planned.
- Review Google scopes and production consent/verification requirements at submission time. Closed-beta OAuth setup is not production approval.
- Validate the intended browser/OS combinations. Keep unsigned Firefox and Safari source limitations explicit until signing/authentication/runtime requirements are met.
- Verify clean install, update with retained settings, backup/import migration, browser restart, account changes, connection loss and recovery; preserve calendar integrity.
- Link each live listing back to the source repository when the platform permits, and list the real install links in README/installation instructions.

The owner completed UX acceptance on 26 October 2026 and retains control of publication. Planning completion or passing automated checks alone does not mean 1.0.0 is ready.
