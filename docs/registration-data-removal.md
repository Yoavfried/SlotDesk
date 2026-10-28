# Registration correction, removal and updates opt-out

Operator procedure prepared 28 October 2026. The exact-email selection rule has been checked against the current schema and intake contract. No correction or erasure was executed to prepare this document. A live rehearsal on an isolated branch containing only synthetic registrations remains pending explicit approval; production changes require a verified request and explicit operator approval.

Requests go privately to [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com). The [privacy notice](../extension/privacy.html) currently states that preview registrations have no automatic expiry. There is no automated mailing feature or public record-management API.

## Verify the request and target

1. Privately verify the requester's authority over the exact address and the requested action. An email typed into onboarding is user-reported, not proof of ownership. For an address correction, verify authority over both the original and replacement address. Request only the evidence necessary; never request Google tokens or calendar exports.
2. Record the request reference, authorized scope and operator in a restricted support record. Do not publish registrations, query results, addresses or SQL containing personal data in Git, issues or screenshots.
3. Open the owner's Neon SQL console: project **SlotDesk**, the intended branch, database **slotdesk**, table **public.leads**. Confirm the branch before every operation. The application role `slotdesk_ingest` has INSERT only and cannot SELECT, UPDATE, DELETE or TRUNCATE; use an authorized owner/admin session without changing that role's permissions.
4. Match the normalized exact email, never a name, substring or domain. `onboarding_id` is the primary key; email is lowercase and indexed but **not unique**. A general removal, correction or updates opt-out covers every matching onboarding row. If the requester explicitly identifies one registration, additionally bind its UUID and keep the email predicate.

Use parameter binding for the statements below: `$1` is the privately verified email; normalize it with `lower(btrim($1))`. Keep values outside saved SQL files. Never substitute a broader predicate when a count is unexpected.

`$1` is a bound parameter, not a value the SQL console supplies automatically. In a client without parameter binding, use PostgreSQL `PREPARE`/`EXECUTE` in the same session. For example, prepare the read-only preview as `PREPARE registration_preview(text) AS SELECT count(*) FROM public.leads WHERE email = lower(btrim($1));`, then execute it with the privately verified address. Use a parameter-capable client for mutations rather than concatenating request text into SQL.

## Preview without exporting records

Run this read-only query on each relevant branch. It returns counts, without names or full records:

```sql
SELECT count(*) AS matching_onboardings,
       count(*) FILTER (WHERE updates_opt_in) AS opted_in_onboardings
FROM public.leads
WHERE email = lower(btrim($1));
```

Repeated emails are expected; do not choose only the newest row. For a specifically authorized single-registration request, add `AND onboarding_id = $2::uuid` to **every** preview, mutation and verification predicate. Confirm privately that the UUID belongs to the verified email. A zero count needs no mutation; unexpected counts require review.

## Apply only the approved action

Run one action in an owner-controlled transaction. Set a short timeout and preserve a **ROLLBACK** default:

```sql
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- Repeat the exact count preview above here.
-- Run exactly one approved statement below, with bound parameters.
-- Run the corresponding verification query before deciding to commit.

ROLLBACK;
```

The first rehearsal must roll back. Review the selected branch, bound address/scope and before/affected/after counts. Only an explicitly approved execution may finish with `COMMIT` instead of `ROLLBACK`; do not execute both. Use a client/session that keeps the whole transaction on one connection. If the SQL console runs each submission independently, use one reviewed batch ending in `ROLLBACK` for rehearsal and a separately approved batch ending in `COMMIT`; do not assume an open transaction survives between submissions. Any error or mismatch requires rollback and investigation.

### Remove registrations

```sql
WITH removed AS (
  DELETE FROM public.leads
  WHERE email = lower(btrim($1))
  RETURNING 1
)
SELECT count(*) AS removed_onboardings FROM removed;
```

Require the removed count to match the reviewed preview count. Then verify:

```sql
SELECT count(*) AS remaining_onboardings
FROM public.leads
WHERE email = lower(btrim($1));
```

Require zero before commit and repeat the same read-only check after commit. The statement returns a count only; do not use `RETURNING *` or export deleted records. A concurrent or later onboarding can create another row, so investigate any nonzero readback rather than broadening the deletion.

### Opt out of updates

Apply to all matching rows, including registrations from other browsers:

```sql
WITH changed AS (
  UPDATE public.leads SET updates_opt_in = false
  WHERE email = lower(btrim($1)) AND updates_opt_in = true
  RETURNING 1
)
SELECT count(*) AS changed_onboardings FROM changed;
```

The changed count should equal the preview's opted-in count. Re-run the preview: `opted_in_onboardings` must be zero; registration rows remain. Repeat after commit. Also honor the request in any separately managed owner mailing/contact copies. There is currently no global suppression service: a later onboarding creates a separate record with its newly submitted choice. Do not describe this database update as preventing all future registration or automatically administering an external mailing tool.

### Correct submitted details

Change only the fields expressly requested. For example, with verified replacement name `$2` and valid IANA timezone `$3`:

```sql
WITH changed AS (
  UPDATE public.leads SET name = $2, timezone = $3
  WHERE email = lower(btrim($1))
  RETURNING 1
)
SELECT count(*) AS changed_onboardings FROM changed;
```

Validate requested values against the [intake contract](../backend/README.md#contract-and-access); preserve UUID, original completion time, browser and updates choice unless the request separately authorizes correcting them. Require the affected count to match the preview, then require zero mismatches:

```sql
SELECT count(*) FILTER (
  WHERE name IS DISTINCT FROM $2 OR timezone IS DISTINCT FROM $3
) AS mismatches
FROM public.leads
WHERE email = lower(btrim($1));
```

For an email-only correction, use `SET email = lower(btrim($2))` instead of the name/timezone assignment, after verifying the replacement address. If both normalized addresses are identical, no email change is needed. Otherwise preview the replacement address's existing count first; after the update, require zero rows for the old address and a replacement-address count equal to its prior count plus the changed count. Email is not unique, so preserve any pre-existing replacement-address rows. Repeat verification after commit. Central correction does not update the person's browser-local profile or future queued submissions.

## Prevent pending retries and explain separate data

Before central erasure, coordinate with the requester to remove any **unsent queued registration** from each known installation. Keep the extension offline while doing so to prevent an automatic retry. In Firefox, turn off **Settings → Registration sharing**; this removes an unsent queue and prevents retries while sharing remains off. In Chrome/Edge, clearing the connected account's workspace through **Settings → Clear data** removes its queued registration; first resolve any uncertain Calendar operation. A normal configuration backup excludes registration/recovery data if the user wants to preserve supported settings. Disconnect alone retains the queue.

Do not complete onboarding again while coordinating removal. Clear data resets setup; completing onboarding later can create a new record. Chrome/Edge record each completed onboarding regardless of the optional updates checkbox. Firefox sharing defaults off and is separately controlled by native permission. If a queue on another device cannot be cleared, record that limitation and arrange a follow-up count check; do not claim reinsertion is impossible.

Local Clear data affects that browser account's workspace. Disconnect clears the active connection and loaded Calendar information while retaining configuration and unfinished operations. Neither action removes submitted database records, deletes Google appointments or revokes Google's consent grant. Google consent must be revoked through Google's app-access controls. Central correction/removal does not change local profiles, exported files or another installation. See [security and data handling](security.md#backups-disconnect-and-removal).

## Branches, retained history and completion

The branch inventory checked on **28 October 2026** included **main**, **development** and **registration-verification-2026-10-15**. Recheck the current inventory: branches can retain independent copies, and deleting a row on main does not remove it from an existing branch. Apply the authorized exact-email action to every managed copy that contains the data, including relevant branches, owner exports/contact lists and any separately managed backups. Do not delete whole branches or unrelated records as part of a person's request.

The project's Neon history window was verified as **6 hours on 28 October 2026**. This is the configured recovery window, not a promise of immediate physical erasure. Neon can restore historical states within the configured window; consult [Neon's history-window documentation](https://neon.com/docs/postgres/backup-restore/history-window). Independently retained branches or exports can outlive that window. Record applicable backup/provider retention and remaining limits; do not promise that every physical copy disappears at commit or exactly six hours later.

Prevent deleted or opted-out data from returning during restore, branch reset, historical branching or import. Restrict access to retained copies; before restored data is made available, reapply outstanding verified removal/opt-out requests and repeat count checks. Keep only the minimal restricted request reference needed to enforce that restoration rule, not a bulk export of erased rows.

Record each branch/copy checked, action, before/affected/after counts, commit time and any remaining retention or inaccessible-copy limitation in the private support record. Confirm the result privately to the requester with the scope and limitations. Do not mark removal complete while a managed live copy still contains the targeted registrations or while an unresolved retry can recreate them.
