# 1.0.0 preparation review

26 October 2026. Preparation build **0.9.5.1** is not the public 1.0.0 release. Targets are Chrome, Edge and Firefox; Outlook follows publication. The repository remains private.

The owner completed the product UX review and approved proceeding on 26 October 2026. The owner also confirmed all three publisher registrations, with Mozilla ready at the file-upload stage. These items are complete; they do not establish store submission, provider approval, native compatibility or final technical clearance.

## Source security review

A Standard Codex Security review of source revision `1496e64043d5db6abbaaf7c5e06de7578c0bb7e2` fully audited 52 paths and mapped the broader architecture. Coverage is **partial**: an additional main-controller review stopped because its worker model was at capacity. Architecture mapping and automated tests are not exhaustive security-audit coverage. The private workbench retains the generated report and offline evidence; no private report filesystem path is embedded in this public-facing record.

Three confirmed issues were addressed in this preparation build:

| Issue | Impact established | Change |
| --- | --- | --- |
| Legacy imported regular expressions | A short malicious expression caused synchronous classification to exceed an isolated 1.5-second timeout. | Reject unsupported legacy expressions at profile validation; runtime guard protects already stored profiles. Preserve generated literal alternatives and exact historical helpers. Unsupported custom legacy regexes need updating through Event detection keywords. |
| Imported trip editor metadata | A valid imported flight carried transient occurrence data into generated editor markup. No script execution or Calendar-write bypass was established. | Project saved flight fields, remove unknown transient properties and restrict/escape the occurrence attribute. |
| Shared sign-in budget admission | 256 invalid requests with varied origins made an unrelated new caller receive 429 until the reached warm instance’s one-minute expiry. | Allocate after request/proof validation, key budgets by client rather than Origin, evict bounded entries and retain per-client limits. Hosting-level distributed abuse protection remains a separate check. |

Reviewed Calendar transports use separate new-event insertion and individual time/detail PATCH paths, with target identity, version and account checks. They expose no event DELETE/move operation. Guest removal intentionally withdraws that invitation after review. The absence of a delete route does not prove freedom from all bugs; main-controller integration and real-provider checks remain open.

The owner configuration script also dropped the saved sign-in endpoint when changing the registration endpoint. It now preserves that endpoint and its required host/CSP origins. A temporary-directory regression verifies this without changing actual project configuration.

## Publication hygiene

A separate read-only pattern review covered 83 reachable commits and 1,135 text blobs (about 27 MB), checking common credential patterns and external email domains. Two database-URL matches were example placeholders using `your_neon_host`; no actual credential was established. Binary content, arbitrary secret formats and every possible private detail are not covered by that search. No Git history was rewritten.

Public OAuth IDs and extension keys are intentional identifiers. Operational deployment IDs were removed from seven current documentation/evidence files; the original Git history remains intact. A final necessity review of remaining operational records is still required before public visibility. The parent website’s private strategy remains in its separate repository. Keep source, meaningful decisions/history, design and third-party license notices.

## Firefox consent

The owner approved optional lead sharing **in Firefox only**. It defaults off, does not queue a lead on opt-out, and requests native `technicalAndInteraction` permission on opt-in. Updates consent remains separate and unchecked. Submission/retries require both saved consent and current browser permission; revocation turns off future sharing. Existing already submitted records are not silently deleted. Chrome/Edge retain their agreed registration behavior.

Twenty-two synthetic browser checks cover first onboarding, opt-out, opt-in, denial, revocation, queued records after permission loss and the separate updates choice. They made no Calendar writes and kept nine baseline appointments unchanged. One automated accessibility scan found no violations. Firefox APIs were mocked in Chromium; native Firefox is not installed on this machine. This is not native Firefox, AMO signing or real Google authentication evidence.

The trip UI regression retained 22 browser assertions and two automated accessibility scans without violations; all nine baseline appointments remained unchanged. Application checks total 2,440, backend checks 76, local calendar comparisons 22, and endpoint-configuration checks five. These are automated synthetic checks, not complete manual accessibility or owner UX approval.

Firefox `web-ext` validation has zero errors and 77 warnings: 76 dynamic-HTML review warnings and one Android minimum-version warning. The target is desktop Firefox; Android is not claimed and must be excluded in submission compatibility. Every dynamic-HTML warning still needs a source-backed review/disposition before AMO submission; zero errors does not establish approval. Compact authored JavaScript is the original source, not an undisclosed generated build.

The backend admission fix is source-complete but has not been redeployed. The existing hosted project has no Git integration, so repository updates do not publish that function automatically.

## Remaining gates

- Complete the focused main-controller/rendering security review after these fixes and verify the final package/source snapshot.
- Verify production secrets/log redaction, actual insert-only database privileges, retention/removal process and distributed abuse controls.
- Review the exact name-prefill/registration/update data flow against public Google and store policies; publish a matching privacy notice. The owner supplied support@buildwithspeedy.com and https://buildwithspeedy.com; the public privacy URL and domain/mail delivery verification remain separate.
- MIT, owner UX review and publisher registrations are complete. Obtain store-issued extension identities, register exact callbacks, complete Google verification, and test native install/update/sign-in on all three browsers. The support email and website have been supplied by the owner; website work is handled separately.
- Prepare the concrete repository and submission packages for final publication approval after the technical checks. Add actual store links and mark 1.0.0 only when all selected listings are live. Do not request another general UX review for the already accepted scope.

[Submission kit and owner steps](store-kit/README.md) · [Release plan](release-1.0.0-plan.md).
