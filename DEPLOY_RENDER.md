# Deploy Arotec with GitHub, Render Free and Neon Free

GitHub stores the source, Render runs the Python website and APIs, and Neon
stores PostgreSQL data. The included `render.yaml` configures the existing Free
Render service `arotec-web` in Oregon (US West), preserving
[arotec-web.onrender.com](https://arotec-web.onrender.com). It does not create a
Render Postgres database.

## Database and secrets

1. Create a Neon project on its Free plan in AWS Oregon (`us-west-2`), near the
   existing Render service. If unavailable, choose the nearest available region
   while keeping the existing Render service in Oregon.
2. Copy Neon's **direct PostgreSQL connection string**, with connection pooling
   disabled. Keep all provider-supplied parameters intact, including
   `sslmode=require` and any `channel_binding` setting. Use a backend database
   role that can create the site's tables and indexes.
3. Enter the complete connection string as Render's secret `DATABASE_URL`.
4. The owner enters `AROTEC_ADMIN_PASSWORD` in Render's secret environment
   field. It controls contact, recruitment, member, and commerce administration.

Both secrets use `sync: false` in the Blueprint. Never put their values in
GitHub, screenshots, logs, or frontend files. No additional Python package is
needed. Without `DATABASE_URL`, the server falls back to SQLite; do not use
that fallback on Render's ephemeral filesystem.

## GitHub connection and automatic deployment

Reuse the existing `arotec-web` service, its Blueprint, and its **GitHub provider
integration** for `Sungkom/arotec-web` on `main`. Automatic deployment is already
enabled; sync this `render.yaml` through that existing Blueprint. Keep the
current service and region so its URL is preserved. The Public Git Repository
URL deployment option does not support automatic deploys.

The Blueprint configures:

- Existing Free Python web service `arotec-web` in Oregon.
- Automatic deployment on each commit to `main`.
- Python 3.14.6.
- Build: `pip install -r requirements.txt`.
- Start: `python server.py`.
- Health check: `/api/health`.

The server listens on Render's `PORT` at `0.0.0.0`. Use the same HTTPS Render
URL, or attached custom domain, for pages and APIs:

- Website: `/index.html`.
- Contact: `/pages/get-in-touch.html`; admin: `/pages/contact-admin.html`.
- Recruitment: `/pages/join-us.html`; admin: `/pages/careers-admin.html`.
- Members: `/pages/members.html`; admin: `/pages/admin-members.html`.
- Commerce administration: the admin control in `/pages/customized.html`.

The GitHub Pages copy remains static and cannot execute the Python APIs.
Connecting Render and Neon does not make forms on the GitHub Pages origin
submit to Render automatically.

`AROTEC_TRUST_RENDER_PROXY=true` enables per-visitor rate limits only when
Render also supplies `RENDER=true` and `RENDER_SERVICE_TYPE=web`. It validates
the public edge's `CF-Connecting-IP`, with the socket address as fallback.

## Storage and Free-only cost guardrail

The owner selected **Free plans only**. Do not select paid plans or enable
paid add-ons. Before deployment, inspect the Render account's billing controls
and confirm there is no automatic overage charge path. Without a payment
method, exhausting applicable free quotas can suspend services or stop builds;
if billing is already attached, review the relevant spending controls before
creating resources. A paid upgrade requires separate owner approval.

Startup initializes PostgreSQL tables and indexes. Reference recruitment
positions are seeded once as drafts, not published vacancies. This setup does
not migrate existing SQLite or Render Postgres records, notes, applications,
or documents. Existing data needs a separate migration before a database switch.

PDFs remain private PostgreSQL `BYTEA` values and count against **Neon's
database storage quota**, not an object-storage quota. Each application can
contain a 10 MiB resume and a 20 MiB portfolio. Downloads transfer the complete
file through Render.

Render Free can sleep after inactivity, and Neon Free can suspend idle compute,
so first requests can take longer. Storage is independent of Render restarts,
but Free compute, storage, transfer, and usage limits still apply. This setup
does not promise unlimited usage or permanent availability. Review
[Render Free limits](https://render.com/docs/free) and
[Neon plans and limits](https://neon.com/pricing).

## Verify after deployment

1. Confirm `/api/health` reports `postgres`. It identifies the selected backend;
   also check `/api/careers/jobs` to exercise a real database read.
2. Confirm `/api/contact/status` enables submissions, anonymous admin access is
   rejected, and the owner can sign in through the HTTPS admin pages.
3. Confirm dotfiles, private database paths, and applicant documents cannot be
   fetched as public static files. Documents require authenticated downloads.
4. Review recruitment drafts and publish only approved vacancies.
5. For authorized submission checks, use clearly labeled synthetic data, verify
   it in admin, and remove only those test records afterward.
6. Confirm a subsequent GitHub commit triggers Render deployment without
   replacing or resetting the Neon database.

See `CONTACT_SETUP.md` and `CAREERS_SETUP.md` for supported workflows.
