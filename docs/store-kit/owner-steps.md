# Owner publication steps

Preparation can proceed without signing in inside Codex. Do these account steps in your normal browser when the prepared release is ready.

1. **Create a public support mailbox.** Supply only the address to the project; keep its password private. It will be used in the privacy notice, support instructions and store dashboards.
2. **Approve the software license and copyright attribution.** The concrete [MIT proposal](license-proposal.md) credits Speedy, Nina Banai and Yoav Fried. No project-wide license has been adopted yet.
3. **Set up publisher accounts.** Chrome Web Store Developer Dashboard, Microsoft Partner Center for Edge Add-ons and Mozilla Add-on Developer Hub. Complete the dashboards’ identity/contact requirements yourself; do not share passwords or payment details in chat. No fees/account purchases have been made by the agent.
4. **Prepare public privacy and Google-verification pages.** The current privacy source is `extension/privacy.html`. It needs the real contact/removal route and an accessible public URL. Google public OAuth review also expects an app information homepage on an owned/verified domain with privacy links. This is a small SlotDesk verification requirement, not an umbrella website. Domain/hosting selection and publication need an owner decision. [Google production policy guidance](https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance).
5. **Complete Google public OAuth verification.** Confirm production audience, brand/domain ownership, exact scopes and demonstration video. Keep beta access restricted until that review is complete. Existing public client IDs are identifiers, not secrets; keep client secrets only in hosting settings.
6. **Reserve store identities and configure exact callbacks.** Share the public store-issued IDs. The Chromium pilot ID and Firefox ID are recorded in the build script; Edge may issue a different identity. Register only the resulting exact authorized returns in the hosted sign-in configuration. Do not broaden returns to wildcards.
7. **Run native installation/update checks.** Verify Chrome, Edge and signed Firefox clean installation, restart, consent cancellation/revocation, account switch and update with settings preserved. Use your normal browser for real Google consent. Final UX acceptance remains yours.
8. **Approve the concrete public repository and submission packages.** After code/security/privacy/history review, add the approved license and real contact. Explicit approval is still required before changing repository visibility. Submit the correct packages and reviewer access notes. Store/provider decisions may require changes.
9. **Release 1.0.0 once all three listings are live.** Add real store links to README/install instructions and link listings to the public source repository where supported. Do not claim 1.0.0 publication before these facts exist. Outlook remains after 1.0.0.

The sign-in rate-limit fix is prepared in `backend/`; it is not deployed by pushing this repository because the existing hosting project has no Git integration. Deploy that reviewed backend update to the existing project before wider distribution, without changing its secrets or callback settings. A preparation ZIP alone cannot update the hosted service.

No secret needs to be pasted into this chat for these steps.
