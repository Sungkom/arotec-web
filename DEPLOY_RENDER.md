# Deploy Arotec Website With Member Database

This project is ready for Render Web Service + Render Postgres.

## What Render Runs

- Build command: `pip install -r requirements.txt`
- Start command: `python server.py`
- Public page: `/index.html`
- Member form: `/pages/members.html`
- Health check: `/api/health`

## Required Service Setup

Use the included `render.yaml` as a Render Blueprint. It creates:

- `arotec-web` web service
- `arotec-members-db` PostgreSQL database
- `DATABASE_URL` environment variable connected to the database

## Notes

- Locally, `server.py` uses SQLite at `database/members.sqlite`.
- On Render, `server.py` uses PostgreSQL automatically when `DATABASE_URL` exists.
- The server binds to `0.0.0.0` when Render provides `PORT`.
