# Optional newsletter / onboarding contact record — proposal

Requested 15 October 2026. **Not implemented in 0.8.1. No collection endpoint, subscriber table or marketing send is authorized or deployed by this planning record.**

The owner asks about email, name, assigned timezone and actual onboarding time in a central table. The clarified purpose is a possible future newsletter from the project owners, not sale/sharing for third-party marketing. This is first-party marketing; using SlotDesk or accepting a privacy notice is not by itself newsletter permission.

## Recommended experience, pending agreement

- Offer an optional newsletter signup at the end of onboarding. It is unchecked by default and declining it does not prevent scheduling.
- State the actual sender and newsletter subject matter before signup. The umbrella website/business name remains undecided; do not ship a placeholder as the data-controller identity or promise unspecified future marketing.
- Prefer an independently completed signup form on the product/owner website. Collect subscriber contact details directly for that purpose, instead of automatically exporting Google-connected profiles or Calendar-derived data. The precise placement must satisfy extension single-purpose and Google data-use policies; consent alone does not override prohibited uses.
- Keep the privacy notice accessible. Marketing permission is separate from any actual service terms/registration purpose; a generic Accept privacy terms checkbox is not a substitute.
- No import of existing users, saved profiles, guests or calendar contacts. Existing users may be offered the same voluntary signup later.
- Users can withdraw permission/unsubscribe and request applicable deletion. Define retention, controller identity, hosting/provider and administrator access before collection.

## Candidate fields

| Field | Definition / open detail |
| --- | --- |
| Email | Directly supplied/confirmed newsletter address; verification design needed. Do not equate any editable saved profile with verified account ownership. |
| Name | Name directly supplied for signup; decide whether optional. |
| Timezone | User-confirmed IANA timezone at signup/onboarding, not inferred location or travel zone. Necessity and optionality for newsletter purposes remain to be decided. |
| Onboarding completed at | Requested actual completion instant, not the time someone opens the app again. Recording/transferring this linked product event requires a separately disclosed, policy-permitted purpose; an independent signup does not automatically provide it. |
| Subscribed at / received at | Server UTC timestamps for acceptance/receipt. Do not label these onboarding completion when the events differ. |
| Consent record | Specific purpose/sender, text/version, affirmative action time, current subscribed/withdrawn status and withdrawal time. |

If permitted product registration/event recording is separately designed, retain client-observed completion time and server receipt time distinctly: offline/delayed uploads and client clock errors mean receipt is not proof of the exact earlier instant. Use one logical subscriber per verified address, with idempotent retries; reinstalls/repeated onboarding should not overwrite the first event or silently renew withdrawn consent.

## Architecture and launch impact

The shipped extension currently has no application backend. A central record needs a private database/service or a newsletter provider, authorized administration, HTTPS, authenticated/validated writes as appropriate, abuse protection, consent/withdrawal handling and a deletion/retention process. Never embed database administration credentials in the extension. Newsletter operations must be isolated from Calendar writers; no Calendar tokens, event content, other profiles or meeting metadata are needed.

Current local-only privacy statements remain true for 0.8.1. Before introducing collection, update in-product notice, Help/privacy, Chrome Store disclosures and relevant OAuth disclosures. No retroactive undisclosed upload of existing workspaces. Treat this as distribution planning only if approved for initial launch; it does not automatically block the accepted recovery work.

Policy references checked 15 October 2026: [Chrome data/single-purpose rules](https://developer.chrome.com/docs/webstore/program-policies/policies), [Google Workspace data policy](https://developers.google.com/workspace/workspace-api-user-data-developer-policy), [Google API data policy](https://developers.google.com/terms/api-services-user-data-policy), [EDPB lawful processing and consent](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en). Applicable legal basis and marketing rules depend on the operator and user jurisdictions; the final form/notice requires that assessment.
