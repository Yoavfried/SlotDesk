# 0.9.4.6 — desktop browser compatibility

Authorized by the owner on 21 October 2026: implement as much browser/desktop compatibility as possible and document remaining adjustments/store requirements. The owner requested autonomous progress and one combined list of remaining owner actions at the end.

Implemented: shared browser API/capability/launcher and safe lock adapter; serialized background authentication; independent Google authorization-code window with state/PKCE and hosted callback/exchange/refresh; session-only credentials; authenticated five-field registration relay for new targets; safe connection diagnostics; deterministic Chromium, unsigned Firefox and Safari-source packaging; privacy/help/install/support/store documentation; strict extension UTF-8 checks.

The existing Google project/approved audience, Chromium key/client/scopes, scheduling policy, reviewed mutation transports and portable-file boundaries remain. Missing safe locks continue to prevent mutations. Legacy native Chrome sign-in is retained while the new service is inactive. Server secrets never enter the extension or leads table.

Engineering evidence and exact limitations are in [testing](testing.md), [the compatibility matrix](browser-compatibility.md) and [the structured record](validation-0.9.4.6.json). The owner completed Google/Vercel activation on 21 October after the initial release. Production deployment the recorded deployment is READY and public readiness is verified true for 0.9.4.6. The Vercel connector could not manage the required variables, so the owner entered them directly. All steps remain in [one activation guide](browser-signin-setup.md) for reference; actual new-flow Google consent remains unverified.

Not delivered: real Google consent validation for the new flow, public store publication/Google verification, signed Firefox installation, Safari authentication, untested browser/OS support, mobile or a hosted no-install workspace. Store-specific dependencies are recorded in [store readiness](extension-stores.md). Wider error-reporting and owner UX review remain open. Advanced-profile wording/UX/logic stays reserved for the owner's separate 0.9.5 review.
