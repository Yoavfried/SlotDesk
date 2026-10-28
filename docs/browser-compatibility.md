# Browser and desktop compatibility

Current evidence: **0.9.5.9 · 28 October 2026**. Initial targets are desktop Chrome, Edge and Firefox. Capability support, synthetic native testing, production Google authorization and store approval are separate checks.

| Target | Implementation and evidence | Remaining boundary |
| --- | --- | --- |
| Chrome / Windows | Native Chrome 155.0.8059.41 extension/background/identity tests, account separation, reload, source update and restart data checks passed. | Production Google; persistent/store install and update; minimum versions. |
| Edge / Windows | Shared Chromium core and panel/full-tab adapter. Edge 156.0.4314.50 passed the same lifecycle/account/data checks. | Production Google; persistent/store install and update; minimum versions. |
| Firefox / Windows | Desktop manifest, background scripts and sidebar. Firefox 158.0.1 passed synthetic native sign-in, account switching, reload, reconnect and opt-out onboarding. | Signed install/update/restart, Google consent and native disclosures. |
| Vivaldi / Windows | Earlier 0.9.4.6 native synthetic authorization/calendar loading passed without browser-account sign-in. | Current-build regression and actual Google. |
| Brave / Opera / Opera GX | Shared Chromium package and guarded panel/full-tab fallback. | No native verification here. |
| macOS / Linux | Portable core and manifests. | No native device coverage in this Windows review. |
| Safari | Source preparation archive. | Apple auth bridge, packaging/signing and native tests; not a functional release. |
| Android / mobile / hosted workspace | Not delivered; Firefox omits `gecko_android`. | Outside this desktop release. A full extension tab is not a hosted app. |

The [dated native report](compatibility-review-2026-10-28.md) records 64 current-build assertions and temporary-install limits. Its providers/calendars are synthetic; no real Google consent or Calendar write is claimed. Nine baseline appointments remained unchanged.

## Shared runtime

`browser-platform.js` wraps browser APIs, background messages and launcher fallback. Missing/rejected sidebar APIs open a full extension tab. Configuration/Calendar mutations require Web Locks and fail closed when unavailable.

The independent Google connection uses the background session broker and hosted state/PKCE service. Credentials use browser session storage/background memory. Profiles/settings/drafts remain account-separated local data with no cross-browser/device sync. Restart ends the hosted credential session; reconnecting should retain configuration. Legacy Chrome-managed authorization is a guarded fallback while the service is inactive. [Connection design](google-connection.md) · [Activation](browser-signin-setup.md).

No content scripts, arbitrary-site access, remote application code, broader Google scopes, event DELETE or calendar move are introduced for these targets. Help → Connection details excludes tokens, account email and appointment content.

## Packaging and updates

`npm run package:slotdesk` produces an unpacked Chromium beta ZIP, a separate `Chromium-store.zip` for Chrome/Edge dashboard uploads without the development key, an unsigned Firefox XPI, a Safari source ZIP, checksums and target metadata. Tests/fixtures are excluded. Preserve the installed folder/identity for development updates. Normal Firefox installation requires signing; temporary add-ons are not an update channel.

Unpacked Chromium beta identity: `blpliafbiiidhcffegochddjhagkhhip`. Firefox: `{39c56104-958b-43a6-bcfe-5e9db811c74b}`. Each Chromium store assigns its own identity. Register/retest any changed store-issued authorization return before distribution. [Installation](install.md) · [Stores](extension-stores.md).

Firefox lint has zero errors and 79 reviewed warnings. [Warning dispositions](firefox-validation-review.md) document actual escaping/link controls and the desktop-only Android warning. They do not establish Mozilla approval.

[Technical release gates](release-readiness-review.md) retain the outstanding provider, signing and device checks. The [system-wide error review](error-reporting-review.md) remains separate future work.
