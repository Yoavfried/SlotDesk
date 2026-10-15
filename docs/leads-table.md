# Onboarding leads table — requested direction

Clarified 15 October 2026. **Proposed; not implemented in 0.8.1.** The owner wants a private leads table, not a newsletter product or a separate subscriber onboarding flow. No specific campaign is planned. Intended uses are product/onboarding analysis and possible first-party news about the owners' projects later. No third-party marketing sale/sharing is requested.

## Requested record

| Field | Meaning |
| --- | --- |
| email | The onboarding user's own email, never saved guests/other profiles. Record its provenance; an editable profile is not independently verified identity. |
| name | The name supplied/confirmed for the user's own profile. |
| timezone | The assigned IANA profile timezone at completion, not travel or inferred location. |
| onboarded_at | Actual observed completion instant in UTC, not each app opening or upload receipt. |

One logical lead per user/email with idempotent submission; repeated starts/retries must not duplicate the record or replace first onboarding time. If upload is delayed, a separate server receipt timestamp avoids pretending receipt time is completion time. Client time may be inaccurate; exact trustworthy offline event time cannot be guaranteed.

## Minimal proposed UX

- Use an upfront onboarding notice naming these four fields and a concrete analysis purpose, such as understanding registrations over time and timezone distribution to improve SlotDesk. Analysis should not be used as an unspecified catch-all justification.
- Future promotional contact is a separate purpose. Recommended optional unchecked wording: "You may email me occasional updates about SlotDesk and your future projects. I can opt out at any time." Store the choice and consent-text version/time as internal metadata; the table remains a leads table.
- A generic privacy-policy acceptance or "we reserve the right" clause is not treated as affirmative marketing permission. The final notice must identify the actual operator and explain data handling; jurisdictions and lawful basis still need assessment.
- No separate newsletter signup page, newsletter service, campaign builder or newsletter-specific table is selected or required by this plan. External signup was an earlier assistant recommendation, not an owner requirement.
- Existing users must see any new collection disclosure before transmission. No retroactive undisclosed upload and no collection of guests, calendar contents or Google tokens.

## Remaining implementation decisions

Choose the private storage/endpoint and operator identity; define retention, administrator access, correction/deletion and withdrawal handling proportionately. Keep administrator credentials out of the extension. The product currently has no application backend, so these records are not being collected today.

Before implementation, establish which values are provided by the user and which originate from Google APIs, and whether the precise collection/purposes satisfy Google's and Chrome's data-use rules. An unchecked contact option is not a workaround for prohibited repurposing. Merely moving the same Google-derived values to another form does not change their provenance. User-entered data is also covered by Chrome's single-purpose rules. Whether mandatory identifiable lead collection is justified for analysis remains an open design/policy question, not a settled permission.

The current local-only privacy statement stays accurate for 0.8.1. Any implemented central collection needs matching onboarding, Help/privacy and distribution disclosures. This planning update deploys no endpoint, table, transfer or message and does not change recovery implementation status.

References checked 15 October 2026: [Chrome user-data rules](https://developer.chrome.com/docs/webstore/program-policies/policies), [Google Workspace data policy](https://developers.google.com/workspace/workspace-api-user-data-developer-policy), [EDPB lawful processing](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en).
