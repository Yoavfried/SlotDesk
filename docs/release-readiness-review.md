# 1.0.0 technical readiness

Reviewed 28 October 2026 against **0.9.5.9**, revision `7eb54e0890e598227eed78481b640ed3278ff9ba`. Publication status updated 28 October: [SlotDesk source](https://github.com/Yoavfried/SlotDesk) is public under MIT. Google connection remains a closed beta; initial store targets are Chrome, Edge and Firefox, and Outlook follows 1.0.0.

## Security and privacy

An independent baseline review covered all handwritten production extension JavaScript, hosted services, SQL migrations, manifest generation, packaging and CI. A focused review traced every Firefox dynamic-HTML warning through actual callers and output contexts. No new vulnerability was established in the production extension or hosted services. Earlier imported-regex, transient-trip-metadata and sign-in admission issues are addressed in this snapshot.

One low-severity issue was found in the archived standalone reference app: imported backup labels reached parsed HTML in its comparison table. The renderer now uses text nodes, and both embedded downloads were regenerated. Eight isolated browser checks confirmed that the original markup executed harmless test markers while the corrected markup remained literal text. These files are excluded from the extension package and have no Google connection.

Reviewed boundaries include credential handling, extension messages, calendar scope, account/window isolation, imports, persistence and separate create, reschedule and detail/guest transports. Existing-event changes bind account, target and version and use narrow PATCH payloads. Creation uses a stable identifier and same-target verification after uncertain responses. There is no event DELETE/calendar-move transport; explicit guest removal can withdraw that guest's invitation.

The review also covered current support/history documents and developer tests. Two browser-test scripts now verify a loopback origin and synthetic transport before clearing storage or confirming a meeting change. Twenty-three automated regressions cover these guards, the reference renderer and embedded-copy identity. This is not a security certification: geographic record accuracy, font/image parser internals and third-party dependency implementation are outside this authored-source review. Private audit evidence is retained separately.

## Production verification

Read-only checks on 28 October established:

- The stable production alias is ready. All eight deployed backend source/lock/configuration file hashes match the reviewed snapshot exactly, including the admission fix. Repository pushes do not deploy the backend automatically.
- Effective `slotdesk_ingest` privileges allow INSERT and deny SELECT, UPDATE, DELETE and TRUNCATE on `public.leads`. The role has no superuser, role-creation or database-creation privilege.
- The seven-column schema uses an onboarding UUID primary key and non-unique email index, matching separate onboardings and idempotent retries.
- Status and deliberately invalid requests return expected readiness, origin-rejection, validation and invalid-session responses with no-store/nosniff; auth also uses no-referrer. No valid contact or Calendar write was submitted.
- No application credential/registration/calendar-body logging sink was found. Recent runtime-log queries returned no application log events; this does not prove absence of platform request logs.

Vercel's runtime-log details include request metadata/search parameters; Hobby runtime-log retention is one hour. OAuth callback URLs contain short-lived code/state, protected separately by PKCE and encrypted state. Owner-level log access, drains, infrastructure retention and secret-storage classification remain unverified. The connector denied environment-variable metadata access; the CLI has no signed-in account. Firewall/drain lookups returned not-found responses, which do not establish absence of protections or drains. [Vercel logging](https://vercel.com/docs/logs/runtime).

Registration retention remains indefinite during the preview, as disclosed. Neon currently has a six-hour recovery-history window. Row removal does not immediately erase independent branches or recovery history. The [removal procedure](registration-data-removal.md) covers duplicate emails, updates opt-out, queued retries, copies and restores. Exact-email selection was checked with read-only synthetic rows; destructive erasure has not been rehearsed. No real lead was deleted.

Public intake supports legacy clients. Origin checks are not authentication; per-instance throttling is not a distributed limit. Verify a hosting-level abuse budget before unrestricted distribution.

## History and media

A separate offline review covered **15 locally reachable refs, 96 commits and 1,420 text blobs** (about 31 MB), commit metadata, structured JSON, two embedded HTML payloads and 88 binary blobs for known credential strings. No actual credential, private key, private calendar export, credential store or database dump was established. Matches were placeholders and synthetic tests. Image metadata had no GPS, email or calendar signals.

Current documentation/store/reference screenshots were visually reviewed and show synthetic/example data. Icons/fonts were inventoried. No rotation or history rewrite is indicated. Arbitrary obfuscated content, remote-only refs, unreachable objects, forks and hosting caches are not cleared by these checks. Public OAuth IDs and extension keys are intentional identifiers.

## Browser and package checks

Native Windows Chrome 155, Edge 156 and Firefox 158 passed **64 current-build assertions** using real extension/background/identity APIs with synthetic OAuth and Calendar services. Chrome/Edge updates from 0.9.5.8 retained both account workspaces. Account switching, reload, disconnect, cancelled authorization and reconnect passed. Firefox opt-out onboarding sent no registration. Nine baseline appointments remained unchanged; no Calendar write occurred.

Development installations do not prove store persistence. Chrome/Edge data survived restart after reloading the same temporary identity. Firefox temporary removal/reinstallation did not retain its workspace; signed-install behavior remains unverified. [Detailed compatibility evidence](compatibility-review-2026-10-28.md).

Firefox lint reports **0 errors, 0 notices and 79 warnings**. All 78 HTML sinks have source-backed dispositions; the remaining warning concerns Android metadata for a desktop-only package. No warning was suppressed and no Mozilla approval is implied. [Firefox reviewer appendix](firefox-validation-review.md).

Application, backend, calendar-comparison, endpoint-configuration and repository checks passed again on 28 October. These tests do not establish production Google consent or mail delivery.

## Remaining gates

| Gate | Required evidence |
| --- | --- |
| Production Google | Approved-account consent, calendar loading, disconnect/reconnect in final Chrome, Edge and Firefox packages; exact store-issued callbacks. |
| Persistent installation | Normal signed/store installation, update retaining settings, restart and Firefox native disclosures; minimum supported versions. |
| macOS | Native installation, connection, update/restart and OS controls on a Mac. No Mac was available here. |
| Hosting | Owner-level secret/log/drain/retention/access checks, distributed abuse limit and isolated synthetic removal rehearsal. |
| Publication | Existing public privacy URL matches the notice; Google/store approvals, final media and concrete publication approval. |

MIT, team attribution, publisher registrations, source publication and previously accepted UX review are complete. The website now deploys from TheBestProject; its public privacy route is being prepared separately and is not yet verified live. Public source does not establish Google or store approval. Announce 1.0.0 only when the selected listings are live. [Submission kit](store-kit/README.md) · [Release plan](release-1.0.0-plan.md).
