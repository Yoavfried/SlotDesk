# Error-reporting review

Owner direction: 21 October 2026. **A complete system-wide review is required and remains open.** The first implementation covers Google sign-in; this does not complete the review or establish owner UX approval. Keep this workstream separate from the owner-led advanced-profile review reserved for 0.9.5.

## First case: Google connection

The owner reproduced an immediate Vivaldi failure. A direct identity API call returned `The user turned off browser signin`. The current application calls `chrome.identity.getAuthToken`; the method exists in this browser but refuses browser-managed Google sign-in. A signed-in Gmail website does not establish availability of that browser service. The earlier generic message lost the actionable reason and could wrongly suggest investigating Google account blocking.

The 0.9.4.5 same-version hotfix classifies known sign-in failures and supplies a next action plus a stable reference. Unsupported identity API (G101), disabled/unavailable browser sign-in (G102), missing browser account (G103), explicit organization blocking (G104), OAuth configuration (G105), missing/withdrawn permissions (G106), reported network failure (G107), absent token (G108), explicit cancellation (G109) and unknown failure (G199) remain distinct. Browser limitations are not classified as a user's canceled consent, network failure or rejected Calendar write. Only explicit provider evidence supports the organization/configuration explanations. Unknown failures do not claim Google blocked access.

The Google authentication wrapper checks for the required method before calling it. Known references survive normalized failure metadata. Raw provider error strings, tokens and account/calendar contents are not added to persistent diagnostics, logs or remote reports. The Help page explains the user actions. This changes reporting only: browser-independent OAuth is proposed separately in [Google connection direction](google-connection.md), not implemented by this hotfix.

## Required review inventory

| Area | Review requirements |
| --- | --- |
| Connection and account changes | Unsupported browser, browser sign-in, canceled consent, wrong account, expired/revoked access, missing scopes, explicit beta/organization restrictions and configuration failures; truthful action for each. |
| Onboarding and registration | Invalid fields, incomplete calendar scope, local save failure and failed/queued registration; distinguish setup from central registration and avoid claiming success before confirmation. |
| Calendar reads and availability | Offline, timeout, quota/rate limit, failed/partial/canceled reads, lost access, invalid provider entries and stale caches; identify affected source and keep incomplete availability visibly unknown. |
| New meeting, editing and rescheduling | Validation rejection, changed permissions/version/account, exact target, rejected request and uncertain result; retain drafts/operations, protect against duplicates and use existing readback recovery. |
| Profiles, travel and settings | Live-save failure, invalid fields, rejected rollback, shared-window conflicts, unavailable mappings and per-entry Save/Discard failure; explain what was retained or changed. |
| Backup, restore and profile files | Invalid/missing columns, defaults, unavailable calendars, identity exclusions, overwrite, incompatible versions and failed atomic replacement; no Calendar changes implied. |
| Meetings, alerts and follow-ups | Failed refresh, unverified old/source event, unavailable reschedule target, stale response scan and unresolved overlap; no silent dismissal or false resolution. |
| Browser/platform and presentation | Missing platform APIs, storage failure, extension update, unsupported context and closed dialogs; consistent placement, focus, keyboard access, screen-reader announcement and readable narrow layouts. |

For each case record the trigger, reliable evidence, user-facing explanation, affected data/action, whether an operation is rejected or unconfirmed, a safe next action, placement, persistence/dismissal and verification. Do not automatically retry a calendar mutation or promise that it failed when only its reply was lost. Prefer clear cause/action over repeated generic Try again. Define safe diagnostic facts and references for currently unmapped failures during the wider review; no telemetry or developer reporting service is authorized by this record.

The owner still controls wording/UX approval. Coverage of this first failure family is engineering evidence, not completion of the system-wide review.

## 0.9.4.6 connection additions

The independent path is now implemented, with G110 for owner setup, G111 for an unregistered package return, G112 for missing background communication and G114 for an unverifiable sign-in result. Help → Connection details provides a safe local capability report. [Activation](browser-signin-setup.md) completed on 21 October with public readiness verified true; real Google consent remains pending; this still does not complete the system-wide reporting review.
