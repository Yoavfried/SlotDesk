# Fresh-profile scheduling review — 0.9.5.3

## Confirmed defect

The reported `Invalid trip timezone history` error was reproduced from a newly suggested profile with no calendar timezone. Confirming its first timezone called `Trips.manual` with the earlier blank profile timezone. The resulting history contained a valid manual change but an invalid blank `baseZone`. Profile validation ran before that history was attached, allowing the invalid final profile to be saved. Search later rejected it even when the person had no trips.

The 0.9.5.2 browser fixture used profiles with prefilled timezones, and its email-only guest was confirmed before profile promotion. Those checks missed the first-time blank-to-confirmed transition in suggested/manual profile creation.

## Changes

- Initialize the first timezone with a valid origin. Validate the assembled profile after generated timezone history is attached and before modifying workspace identity or promoting a guest.
- On workspace loading and file import, repair only the known blank-origin signature: a nonempty, valid history whose earliest entry is a manual timezone confirmation. Keep the complete history, trips, flights, blockers and other profile settings. Other malformed histories remain invalid.
- Preserve unsupported trip schema versions so validation rejects them rather than silently downgrading them during migration.
- Keep the optional-default-calendar rule consistent during backup restore and in current Help/onboarding instructions. A missing optional default does not become a restore prerequisite.

## Review and evidence

The review traced the common profile editor from onboarding suggestions, Manage profiles, meeting participants, first-time timezone confirmation, subsequent live timezone changes, persistence/reload, trip reconciliation and portable-file import. It also checked the final save boundary and existing booking/edit/reschedule guards. No provider writer or calendar mutation policy was changed.

The focused browser regression starts with empty local storage and adds two suggested people with unknown timezones. It searches Next week for 60 minutes immediately after onboarding, then checks manual profile creation, a later timezone change, email-only scheduling/promotion, replay of the exact old saved defect, restart persistence and layouts at 320, 514 and 1,600px. The earlier default-calendar/email-guest hotfix regression is retained.

See [machine-readable validation](validation-0.9.5.3.json), [browser regression](../scripts/accessibility/profile-lifecycle.js), and the trip/configuration regression cases. Calendar APIs and sign-in are synthetic in these browser checks. Installed Chrome and Edge ran on Windows; native macOS and real Google sign-in are not certified by this record. This scoped correctness review does not close the separate 1.0.0 security/store readiness work.
