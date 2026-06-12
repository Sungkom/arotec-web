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
