# Registration service activation

## Current update — 26 October 2026, 0.9.4.8

The existing SlotDesk service was updated to **one lead per completed onboarding**, with a bounded browser label and retry UUID. Migration 002 is applied to the production `slotdesk.public.leads` table. Its original fields and row count were unchanged across migration; historical browser values are Unknown. The intake account retains INSERT and has no SELECT/UPDATE/DELETE.

- Production deployment: READY at the existing `slotdesk-leads.vercel.app` alias.
- Backend source: `421265be36e4c6a22a133925db53ab967e8a9321`, eight explicit runtime/lock/config files, no local credentials.
- Expiring test branch: `onboarding-browser-migration-2026-10-26`, expiry 27 October 2026, 09:30 UTC. Original five values survived migration; insert-only-role tests stored two separate onboardings for one synthetic email and preserved both after a retry.
- Public checks: status 200/ready:true, allowed preflight 204, reads 405, invalid current-format payload 400, unrelated origin 403. No valid contact was submitted to production for verification.
- The unchanged Google broker still reports its component version 0.9.4.6; the intake contract/app release is 0.9.4.8. Existing Google secrets, callback, approved audience and OAuth scopes are unchanged.

Older five-field clients remain supported. This supersedes the original email-unique behavior described in the historical activation evidence below. [Current fields and rules](leads-table.md).

## Original activation evidence

Original activation: 15 October 2026 for the private 0.9.0 preview. The table and evidence below describe that activation. The release at that stage was 0.9.4.6. The owner completed [Google/Vercel activation](browser-signin-setup.md); production redeployment is recorded as READY. A public check on 21 October returned HTTP 200 with `ready:true`, version 0.9.4.6 and flow authorization-code. This confirms configuration readiness, not a completed Google sign-in. An earlier broker deployment preceded that configuration. Invalid intake input still returns 400; no lead was inserted during the 21 October checks.

| Component | Configuration |
| --- | --- |
| Public intake | `https://slotdesk-leads.vercel.app/api/leads` |
| Vercel project | `slotdesk-leads`, Yoavfried team, Node.js 24, Frankfurt |
| Deployment | Historical production deployment, verified on the recorded date |
| Reviewed backend source | `6f5a5c9a437827fce469814d50d63aaaf6ca38e5`, directory `backend/` |
| Private database | SlotDesk Neon project, `main` branch, `slotdesk` database, `public.leads` |
| Application login | `slotdesk_ingest`: INSERT only on the leads table |
| Allowed browser origin | `chrome-extension://blpliafbiiidhcffegochddjhagkhhip` |

The owner entered the two server environment variables directly in Vercel. The connected plugin could deploy even though its environment-variable API returned HTTP 403. Credentials remain on the server; the extension contains only the public endpoint. The deployment uses five reviewed backend files, without local environment files or the extension source. A public intake URL does not make the repository or leads table public.

## Verification

- Vercel reports READY and assigned the stable `slotdesk-leads.vercel.app` address.
- Requests to that public address returned 204 for the allowed preflight, 400 for an invalid registration, 403 for an unrelated origin and 405 for a read request. Allowed responses carry the exact extension origin.
- Database authentication as the production intake role succeeded. Privilege checks confirmed INSERT and denied SELECT, UPDATE and DELETE on `public.leads`. A zero-row INSERT checked its production SQL permission without creating a contact.
- An isolated branch, `registration-verification-2026-10-15`, copied the schema and limited role. The actual `backend/api/leads.mjs` entrypoint and pinned Neon driver ran behind a local HTTP bridge with that branch's connection supplied privately over standard input. Initial and duplicate requests both returned 202. Owner readback confirmed the original name, timezone, timestamp and `updates_opt_in=false` were preserved after the duplicate tried different values.
- Synthetic contacts exist only on that isolated verification branch. The production table held zero records at the final deployment check. No Google token, calendar read, invitation or meeting change was used in these checks.

The first real onboarding submission through the deployed Vercel function from the updated Chrome extension remains to be observed. This is distinct from the verified public request checks and isolated database round trip. After updating/reloading the extension, complete its registration notice if shown and check Settings for the registration's saved/waiting state; an existing queued record can use Retry. No Google Cloud configuration change is required.

## Updates

Deploy the `backend/` directory using its committed lockfile and `vercel.json`. Server-environment changes need a new deployment. Keep the stable intake address; changing it also requires updating the extension configuration, manifest host permission, CSP and package with `scripts/configure-leads.mjs`.

Use the owner-only Neon console to inspect registrations. This service has no public listing/export or email-sending endpoint. The [operator guide](../backend/README.md), [agreed fields](leads-table.md), [privacy notice](../extension/privacy.html) and [security limits](security.md) remain authoritative.
