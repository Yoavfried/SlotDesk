# SlotDesk registration intake

## Browser-independent Google connection — 0.9.4.6

The same hosting project also provides `api/google.mjs`, backed by the testable `google-auth.mjs` broker. It uses server-only Web client/encryption secrets and an exact return allowlist. Code exchange, state/PKCE and encrypted session refresh are separate from the insert-only leads database; no token table is created. The new authenticated registration relay uses the same onboarding record as the direct intake. The existing direct intake stays available for the old Chrome path.

Run `npm run test:backend` at the repository root. Set up hosting through [the single owner guide](../docs/browser-signin-setup.md). `GET /api/google?op=status` returns `ready:false` until all required variables are configured. Never deploy `.env`, private OAuth secrets, test credentials or calendar exports. See [security](../docs/security.md) for boundaries and wider-rollout limits.

The registration intake stores the [leads record](../docs/leads-table.md). The intake does not receive Calendar content or store Google tokens. A separate sign-in function on the same hosting project exchanges and refreshes Google credentials; tokens transit that function and are not stored in Neon. The Chrome app remains usable when submission is unavailable, keeping the original registration queued locally.

## Activation status

Activated on 15 October 2026 at **https://slotdesk-leads.vercel.app/api/leads**. The owner configured `DATABASE_URL` and `SLOTDESK_ORIGIN` in Vercel; the connected plugin then deployed the reviewed backend to Frankfurt. The separate **SlotDesk** Neon project contains `public.leads`. The application role has INSERT permission and no SELECT, UPDATE or DELETE permission. The extension endpoint and exact-origin host/CSP permission are configured. [Deployment and verification record](../docs/registration-deployment.md).

## Deploy

Use Node.js 22 or later. Run `npm ci` and `npm test` in this directory. Deploy this directory as a framework-free Vercel project, with Frankfurt functions close to the database.

Configure encrypted `DATABASE_URL` using a dedicated database login. Apply `migrations/001-leads.sql` followed by `migrations/002-onboarding-browser.sql`; grant that login USAGE on schema `public` and INSERT on `public.leads` only. Do not use the database owner login. Set `SLOTDESK_ORIGIN` to `chrome-extension://blpliafbiiidhcffegochddjhagkhhip`. Keep database credentials in server environment variables, never extension code or Git. A new credential can be generated/reset in the Neon console when configuring hosting.

After the endpoint is deployed, configure the exact public URL:

```sh
node scripts/configure-leads.mjs https://YOUR-HOST/api/leads
```

Run the repository checks and rebuild the extension ZIP. Verify a synthetic registration against an isolated database branch before enabling the real intake. Do not seed the live leads table with test contacts.

## Contract and access

`POST /api/leads` accepts the required `email`, `name`, `timezone`, `onboarded_at` and `updates_opt_in`, plus `onboarding_id` and `browser` from current clients. Email is normalized but is not unique: each onboarding gets its own UUID. `INSERT … ON CONFLICT DO NOTHING` deduplicates retries by that UUID and preserves every prior row. Legacy five-field clients remain supported: their key is derived deterministically from normalized email and the original millisecond completion time; absent browser information becomes Unknown. This compatibility hash is an idempotency key, not authentication. Both routes use `insert-lead.mjs`. Identical success responses do not reveal whether an identifier already existed. There is no public read, update, export or delete route. Owners inspect the private table through Neon.

Requests have a 2 KiB body cap, field validation, a fixed extension-origin CORS policy, no cookies and no submitted-value/error logging. Origin checks are not identity verification. The per-instance request throttle is coarse and is not a distributed abuse limit. These are user-reported registrations, not independently verified email identities. Wider distribution needs hosting-level abuse limits and the existing [distribution work](../docs/roadmap.md).

Owners handle correction/removal and future opt-out requests directly; this implementation does not send project-update emails. No additional Google permission is requested.

## Browser labels and migration

Browser is one of Chrome, Chromium, Edge, Vivaldi, Brave, Opera, Firefox, Safari or Unknown. Do not store full user-agent strings, versions or device fingerprints. Vivaldi and other browsers may hide their brand; record Chromium when only that engine is exposed. Browser labels are self-reported analytics, not verified identity.

Apply migrations in order as the database owner, within a transaction. Migration 002 preserves the original five values, adds Unknown for old rows, gives old submissions their compatible retry keys, and replaces email uniqueness with the onboarding key. The intake role retains INSERT only. Test on a short-lived database branch before production. Never insert synthetic contacts into production.
