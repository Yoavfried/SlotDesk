# SlotDesk registration intake

## Browser-independent Google connection — 0.9.4.6

The same hosting project also provides `api/google.mjs`, backed by the testable `google-auth.mjs` broker. It uses server-only Web client/encryption secrets and an exact return allowlist. Code exchange, state/PKCE and encrypted session refresh are separate from the insert-only leads database; no token table is created. The new authenticated registration relay still inserts only the original five fields. The existing direct intake stays available for the old Chrome path.

Run `npm run test:backend` at the repository root. Set up hosting through [the single owner guide](../docs/browser-signin-setup.md). `GET /api/google?op=status` returns `ready:false` until all required variables are configured. Never deploy `.env`, private OAuth secrets, test credentials or calendar exports. See [security](../docs/security.md) for boundaries and wider-rollout limits.

This optional server component stores the five-column [leads record](../docs/leads-table.md). It never receives Google tokens or calendar content. The Chrome app remains usable when submission is unavailable, keeping the original registration queued locally.

## Activation status

Activated on 15 October 2026 at **https://slotdesk-leads.vercel.app/api/leads**. The owner configured `DATABASE_URL` and `SLOTDESK_ORIGIN` in Vercel; the connected plugin then deployed the reviewed backend to Frankfurt. The separate **SlotDesk** Neon project contains `public.leads`. The application role has INSERT permission and no SELECT, UPDATE or DELETE permission. The extension endpoint and exact-origin host/CSP permission are configured. [Deployment and verification record](../docs/registration-deployment.md).

## Deploy

Use Node.js 22 or later. Run `npm ci` and `npm test` in this directory. Deploy this directory as a framework-free Vercel project, with Frankfurt functions close to the database.

Configure encrypted `DATABASE_URL` using a dedicated database login. Apply `migrations/001-leads.sql`; grant that login USAGE on schema `public` and INSERT on `public.leads` only. Do not use the database owner login. Set `SLOTDESK_ORIGIN` to `chrome-extension://blpliafbiiidhcffegochddjhagkhhip`. Keep database credentials in server environment variables, never extension code or Git. A new credential can be generated/reset in the Neon console when configuring hosting.

After the endpoint is deployed, configure the exact public URL:

```sh
node scripts/configure-leads.mjs https://YOUR-HOST/api/leads
```

Run the repository checks and rebuild the extension ZIP. Verify a synthetic registration against an isolated database branch before enabling the real intake. Do not seed the live leads table with test contacts.

## Contract and access

`POST /api/leads` accepts exactly `email`, `name`, `timezone`, `onboarded_at` and `updates_opt_in`. Email is normalized before submission and unique in the table. `INSERT … ON CONFLICT DO NOTHING` preserves the initial timestamp and choice; identical success responses do not reveal whether a record already existed. There is no public read, update, export or delete route. Owners inspect the private table through Neon.

Requests have a 2 KiB body cap, field validation, a fixed extension-origin CORS policy, no cookies and no submitted-value/error logging. Origin checks are not identity verification. The per-instance request throttle is coarse and is not a distributed abuse limit. These are user-reported registrations, not independently verified email identities. Wider distribution needs hosting-level abuse limits and the existing [distribution work](../docs/roadmap.md).

Owners handle correction/removal and future opt-out requests directly; this implementation does not send project-update emails. No additional Google permission is requested.
