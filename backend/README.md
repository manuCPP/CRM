# Immobiliare lead bridge

Node.js worker that reads a dedicated agency Gmail inbox, imports recognized lead emails into that agency's Supabase project, and optionally sends Telegram notifications.

## Requirements

- Node.js 20 or later
- Gmail API enabled in a Google Cloud project
- OAuth Desktop credentials in `credentials.json` and a per-instance OAuth token in `token.json`
- One Supabase project per agency instance

## Setup

1. Copy `.env.example` to `.env` for this deployment. Set the tenant slug, agency identity, source domains and the agency's Supabase URL/secret key.
2. Keep Gmail `credentials.json` and `token.json` local to this deployment. Authorize the Gmail account that receives this agency's leads.
3. Apply the SQL migrations in `../supabase/migrations` in filename order. The initial migration creates `public.leads` if it does not exist and adds the opaque `crm_id` and Gmail deduplication key.
4. Create the agency's first Supabase Auth admin and a matching RLS policy for reading leads. The backend secret stays server-side; the frontend uses only the publishable key and signed-in user session.
5. Set both Telegram variables to enable notifications, or leave both empty to disable them.
6. Run `npm start` from this backend directory.

## Per-instance behavior

- `TENANT_SLUG`, `AGENCY_NAME`, `AGENCY_LOCATION` identify the deployment in logs and UI configuration.
- `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_LEADS_TABLE` point to that agency's database.
- `LEAD_SOURCE_DOMAINS` is a comma-separated list of accepted lead source domains. The test subject prefix defaults to `[LEAD TEST]`.
- `POLL_INTERVAL_MS` defaults to 10 seconds.
- Each instance must have its own Gmail OAuth token and Supabase credentials. Never share backend secrets or credential files between agencies.

Lead rows store the contact fields, source, received time, message body and Gmail message ID. The unique Gmail ID makes retries idempotent. Only recognized source-domain emails and explicit test emails are imported.
