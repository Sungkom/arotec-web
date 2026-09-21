# Deploy Arotec Website With Backend Database

This project is ready for Render Web Service + Render Postgres.

## What Render Runs

- Build command: `pip install -r requirements.txt`
- Start command: `python server.py`
- Public page: `/index.html`
- Member form: `/pages/members.html`
- Customized commerce page: `/pages/customized.html`
- Admin member list: `/pages/admin-members.html`
- Health check: `/api/health`

## Required Service Setup

Use the included `render.yaml` as a Render Blueprint. It creates:

- `arotec-web` web service
- `arotec-members-db` PostgreSQL database
- `DATABASE_URL` environment variable connected to the database
- `AROTEC_ADMIN_PASSWORD` environment variable for admin member, product, formula and order data

## Notes

- Locally, `server.py` uses SQLite at `database/members.sqlite`.
- On Render, `server.py` uses PostgreSQL automatically when `DATABASE_URL` exists.
- The server binds to `0.0.0.0` when Render provides `PORT`.
- Admin member list: `/pages/admin-members.html`
- Product, formula and order management is inside `/pages/customized.html` using the admin icon.
- Public commerce APIs include `/api/catalog/products`, `/api/formulas` and `/api/orders`.
- Admin APIs include `/api/admin/products`, `/api/admin/formulas` and `/api/admin/orders`.

## Contact and recruitment deployment

The same web service serves all HTML, assets, and Python API routes. Use its
HTTPS Render URL (or an attached custom domain) for both public forms and admin:

- `/pages/get-in-touch.html` and `/pages/contact-admin.html`
- `/pages/join-us.html` and `/pages/careers-admin.html`

The GitHub Pages copy remains static and cannot run these APIs. Do not point
the forms at a different origin without reviewing the integration and origin
protection first.

### Blueprint configuration

Connect `Sungkom/arotec-web` through Render's GitHub integration, select `main`,
and use `render.yaml`. The Blueprint sets automatic deployment on each commit,
Python 3.14.6, the `/api/health` health check, and Singapore for both the web
service and PostgreSQL. The database accepts internal connections only, and
Render injects its internal connection string as `DATABASE_URL`.

Set `AROTEC_ADMIN_PASSWORD` in Render's secret environment field. Never put
its value in the repository, screenshots, logs, or a public frontend file.
The API disables contact submissions and administration until it is configured.
Do not reuse the local SQLite database on Render's ephemeral filesystem.

The Blueprint retains the Free plans until the owner selects the deployment
plan. Free PostgreSQL expires after 30 days and is not durable production
storage; use an approved paid database plan for ongoing inquiries and resumes.
Free web services also sleep after inactivity. Review the actual service and
storage charges in Render before creating paid resources.

`AROTEC_TRUST_RENDER_PROXY=true` enables per-visitor rate limits behind Render's
public edge only when Render also supplies `RENDER=true` and
`RENDER_SERVICE_TYPE=web`. It uses the validated
`CF-Connecting-IP` supplied by that edge, with the socket address as fallback.
Do not enable this setting for an untrusted proxy or another hosting platform.

### Verify after the first deployment

1. Confirm `/api/health` reports PostgreSQL, `/api/contact/status` enables
   submissions, and `/api/careers/jobs` returns JSON.
2. Confirm anonymous access to both admin APIs is rejected, then test sign-in.
3. Confirm the web service cannot serve dotfiles, database files, or uploaded
   applicant PDFs as public static files.
4. Review the reference job drafts in Recruitment Admin and publish only real
   vacancies. Startup does not publish the reference drafts automatically.
5. Use clearly identified synthetic records for any approved submission checks;
   verify them through admin and remove only those test records afterward.

See `CONTACT_SETUP.md` and `CAREERS_SETUP.md` for the supported workflows.
