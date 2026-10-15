CREATE TABLE IF NOT EXISTS public.leads (
  email text PRIMARY KEY CHECK (email = lower(email) AND length(email) BETWEEN 3 AND 320),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 200),
  timezone text NOT NULL CHECK (length(timezone) BETWEEN 1 AND 100),
  onboarded_at timestamptz NOT NULL,
  updates_opt_in boolean NOT NULL DEFAULT false
);
