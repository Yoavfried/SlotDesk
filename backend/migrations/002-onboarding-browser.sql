-- Apply after 001. Preserve existing lead data; replace email uniqueness with
-- one key per completed onboarding. A retry of an old five-field payload derives
-- the same key from its email and frozen completion timestamp (not a security hash).
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS onboarding_id uuid;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS browser text NOT NULL DEFAULT 'Unknown'
  CHECK (browser IN ('Chrome','Chromium','Edge','Vivaldi','Brave','Opera','Firefox','Safari','Unknown'));
UPDATE public.leads SET onboarding_id = md5(email || E'\n' ||
  to_char(onboarded_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))::uuid
  WHERE onboarding_id IS NULL;
ALTER TABLE public.leads ALTER COLUMN onboarding_id SET NOT NULL;
ALTER TABLE public.leads ALTER COLUMN onboarding_id SET DEFAULT gen_random_uuid();
-- The primary-key constraint changes, not any saved email or registration field.
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_pkey;
ALTER TABLE public.leads ADD CONSTRAINT leads_pkey PRIMARY KEY (onboarding_id);
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);
GRANT INSERT ON public.leads TO slotdesk_ingest;
