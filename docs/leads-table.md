# Onboarding leads table

Original scope agreed 15 October 2026. Updated 26 October 2026 in **0.9.4.8**: record every completed onboarding separately; deduplication of people can be considered later. Existing records are retained. This supersedes the earlier email-keyed uniqueness rule.

## Record

| Field | Meaning |
| --- | --- |
| email | Email confirmed by the onboarding user; normalized lowercase. Repeated emails are allowed. |
| name | Name confirmed by that user. Names are not unique. |
| timezone | Assigned IANA timezone confirmed by that user. |
| onboarded_at | App-generated UTC completion timestamp. |
| updates_opt_in | Optional project-updates checkbox; false by default. |
| browser | Reported browser name, without its version or complete user-agent string. |
| onboarding_id | Internal random UUID identifying this completion and its retries; not a device identifier. |

Create the lead whether or not the optional updates box is checked. Its value controls permission for future first-party project updates, not registration recording. The table is for onboarding/product analysis and potential future project updates; there is no mailing feature or specific campaign.

## Submission behavior

| Situation | Result |
| --- | --- |
| Complete onboarding in a new browser/installation | Add a new lead, even with an existing email or name. |
| Retry a queued submission after a connection failure | Reuse its UUID and original timestamp; keep the existing row unchanged. |
| Open the app again after completing onboarding | No new lead. |
| Edit a saved profile or import profiles/settings | No lead is added or edited. |
| Existing row created before this release | Preserve all original values; browser is Unknown. |
| An older client submits its original five fields | Derive a stable retry key from email/completion time and store browser as Unknown. A different completion time creates another row. |

Local setup and completion still belong to the browser installation/account. Cloud leads are separate from those settings. This change does not add account settings sync or bypass onboarding.

## Browser identification

Labels are Chrome, Chromium, Edge, Vivaldi, Brave, Opera, Firefox, Safari or Unknown. Read only the exposed browser brand list/user-agent in memory, then send the label. Do not send or store the full string, version, device details or a fingerprint. Labels may be masked/spoofed. [Vivaldi hides identifiable branding by default](https://help.vivaldi.com/developers/web/vivaldi-user-agent-and-client-hints-user-agent/); record Chromium when that is all it exposes. This field is useful analytics, not a guaranteed browser identity.

## Onboarding notice

> We store your email, name, chosen timezone, browser and setup date to understand SlotDesk registrations and improve the product. See our privacy notice.

Optional, unchecked by default:

> You may email me occasional updates about SlotDesk and our future projects. I can opt out at any time.

No extra Google permission is needed. The user can complete setup without choosing updates. An unavailable intake keeps the exact registration queued locally without blocking calendar use. Previously saved registrations are not silently resubmitted to fill the browser column.

## Storage and access

Private Neon project **SlotDesk**, main branch, database **slotdesk**, table **public.leads**. The dedicated role `slotdesk_ingest` has INSERT only, with no SELECT/UPDATE/DELETE. Both the direct intake and authenticated Google relay use the same validation and parameterized insert. There is no public read/export/delete API. Owners view the table in Neon and handle correction/removal/opt-out requests. [Backend contract](../backend/README.md), [deployment evidence](registration-deployment.md), [privacy notice](../extension/privacy.html).

Migration 002 changes the primary key without removing lead rows or changing the original five fields. Testing uses an expiring isolated branch; no synthetic lead is inserted into production. Tokens, calendar data, other people’s profiles, flights and meeting drafts are excluded. Browser-based workspace storage remains acceptable for this release.
