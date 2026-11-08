# Owner publication steps

SlotDesk 1.0.0 is live on all three [initial stores](../install.md). These steps record completed setup and the work to retain for future store updates.

1. **Support and website supplied.** Use [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com) and [https://buildwithspeedy.com](https://buildwithspeedy.com) in repository, extension and store fields. Keep mailbox credentials private. This records the owner-provided details; email delivery and domain verification are separate checks.
2. **MIT and public source complete.** The [license decision](license-proposal.md) and root LICENSE credit Speedy, Nina Banai and Yoav Fried. The [source repository](https://github.com/Yoavfried/SlotDesk) became public on 28 October 2026 following explicit approval.
3. **Publisher registration complete.** On 26 October 2026 the owner confirmed Chrome registration/payment, Microsoft Edge enrollment and Mozilla setup through the file-upload stage. Store-issued extension identities, submitted packages and live listings are separate steps. Keep sign-in/payment details private; no fees/account purchases have been made by the agent.
4. **Public privacy page complete.** The website deploys from `ninabanai-maker/TheBestProject/main`. The standalone SlotDesk policy and small Privacy link are live, preserving the homepage layout. Use https://buildwithspeedy.com/slotdesk/privacy in store/OAuth forms; an anonymous check on 28 October 2026 confirmed HTTP 200 and the expected policy text. The `.html` address redirects to this canonical URL. A dedicated support page is unnecessary: use support@buildwithspeedy.com, and the public repository issue tracker where a web support URL is useful. Domain ownership verification remains an account-configuration step. [Google production policy guidance](https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance).
5. **Confirm applicable Google OAuth verification.** Check the production audience, brand/domain ownership, exact scopes and required review materials when the Google connection changes. Keep any beta test audience restricted until applicable review is complete. Existing public client IDs are identifiers, not secrets; keep client secrets only in hosting settings.
6. **Preserve store identities and exact callbacks.** The Chrome, Edge and Firefox identities and deployed returns are recorded in [store identities](store-identities.md) and [browser sign-in setup](../browser-signin-setup.md). Use the corresponding exact authorized returns in hosted sign-in settings and verify real connections. Do not broaden returns to wildcards.
7. **Run native installation/update checks.** Verify Chrome, Edge and signed Firefox clean installation, restart, consent cancellation/revocation, account switch and update with settings preserved. Use your normal browser for real Google consent. The owner completed the product UX review and approved proceeding on 26 October 2026; native release checks remain separate.
8. **Prepare future submission packages.** Keep the MIT license, credits and accurate release status. Include the public source link in store descriptions. Validate final store packages, reviewer access and distribution requirements for each update.
9. **Initial store publication complete.** Keep the live store links in README/install instructions and link listings to the public source repository where supported. Outlook remains after 1.0.0.

Production verification on 28 October 2026 confirmed that all eight backend source/lock/configuration hashes match the reviewed 0.9.5.9 snapshot, including the sign-in admission fix. Future pushes still do not deploy the hosted service automatically. See the [current technical review](../release-readiness-review.md).

No secret needs to be pasted into this chat for these steps.

## Publisher accounts in plain language

A publisher account is your developer registration with an extension store. It lets you upload SlotDesk, manage its listing and publish future updates. You can enroll using accounts you already control; signing in and any account verification happen in your regular browser.

| Store | Account used | Registration guidance |
| --- | --- | --- |
| Chrome Web Store | Google account | [Chrome developer registration](https://developer.chrome.com/docs/webstore/register); one-time registration fee. |
| Microsoft Edge Add-ons | Microsoft account, including personal GitHub sign-in linked by Microsoft | [Edge developer registration](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account) and [GitHub sign-in](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/github); no registration fee. |
| Firefox Add-ons | Mozilla account | [Mozilla developer submission](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/). |

Use Speedy as the public publisher label where permitted by the store and the selected account type. The agent prepares the packages, listing text and permission explanations; the owner handles account sign-in, verification, agreements and any payment. Store accounts do not replace the app's Google OAuth production approval.
