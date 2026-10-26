# Owner publication steps

Preparation can proceed without signing in inside Codex. Do these account steps in your normal browser when the prepared release is ready.

1. **Support and website supplied.** Use [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com) and [https://buildwithspeedy.com](https://buildwithspeedy.com) in repository, extension and store fields. Keep mailbox credentials private. This records the owner-provided details; email delivery and domain verification are separate checks.
2. **MIT approved and adopted.** The [license decision](license-proposal.md) and root LICENSE credit Speedy, Nina Banai and Yoav Fried. This item is complete; public repository visibility is a separate final approval.
3. **Publisher registration complete.** On 26 October 2026 the owner confirmed Chrome registration/payment, Microsoft Edge enrollment and Mozilla setup through the file-upload stage. Store-issued extension identities, submitted packages and live listings are separate steps. Keep sign-in/payment details private; no fees/account purchases have been made by the agent.
4. **Use the existing website pages.** The owner reports the SlotDesk page exists and is handling the website and its repository separately. Do not change that website/repository in this workstream. Use the existing product/privacy URLs and support@buildwithspeedy.com when completing store/OAuth forms; obtain exact URLs when needed for submission. Domain ownership verification remains an account-configuration step. [Google production policy guidance](https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance).
5. **Complete Google public OAuth verification.** Confirm production audience, brand/domain ownership, exact scopes and demonstration video. Keep beta access restricted until that review is complete. Existing public client IDs are identifiers, not secrets; keep client secrets only in hosting settings.
6. **Reserve store identities and configure exact callbacks.** Share the public store-issued IDs. The Chromium pilot ID and Firefox ID are recorded in the build script; Edge may issue a different identity. Register only the resulting exact authorized returns in the hosted sign-in configuration. Do not broaden returns to wildcards.
7. **Run native installation/update checks.** Verify Chrome, Edge and signed Firefox clean installation, restart, consent cancellation/revocation, account switch and update with settings preserved. Use your normal browser for real Google consent. The owner completed the product UX review and approved proceeding on 26 October 2026; native release checks remain separate.
8. **Approve the concrete public repository and submission packages.** After code/security/privacy/history review, retain the adopted MIT license and verify the supplied support contact. Explicit approval is still required before changing repository visibility. Submit the correct packages and reviewer access notes. Store/provider decisions may require changes.
9. **Release 1.0.0 once all three listings are live.** Add real store links to README/install instructions and link listings to the public source repository where supported. Do not claim 1.0.0 publication before these facts exist. Outlook remains after 1.0.0.

The sign-in rate-limit fix is prepared in `backend/`; it is not deployed by pushing this repository because the existing hosting project has no Git integration. Deploy that reviewed backend update to the existing project before wider distribution, without changing its secrets or callback settings. A preparation ZIP alone cannot update the hosted service.

No secret needs to be pasted into this chat for these steps.

## Publisher accounts in plain language

A publisher account is your developer registration with an extension store. It lets you upload SlotDesk, manage its listing and publish future updates. You can enroll using accounts you already control; signing in and any account verification happen in your regular browser.

| Store | Account used | Registration guidance |
| --- | --- | --- |
| Chrome Web Store | Google account | [Chrome developer registration](https://developer.chrome.com/docs/webstore/register); one-time registration fee. |
| Microsoft Edge Add-ons | Microsoft account, including personal GitHub sign-in linked by Microsoft | [Edge developer registration](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account) and [GitHub sign-in](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/github); no registration fee. |
| Firefox Add-ons | Mozilla account | [Mozilla developer submission](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/). |

Use Speedy as the public publisher label where permitted by the store and the selected account type. The agent prepares the packages, listing text and permission explanations; the owner handles account sign-in, verification, agreements and any payment. Store accounts do not replace the app's Google OAuth production approval.
