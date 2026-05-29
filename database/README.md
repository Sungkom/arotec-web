# Arotec Member Database

This folder contains the local SQLite member database for the Arotec website.

## Files

- `schema.sql` defines the member tables, indexes, and update trigger.
- `init_members_db.py` creates or updates `members.sqlite` from the schema.
- `members.sqlite` is the real local database file.

## Run The Website With Database

From the project folder:

```powershell
python server.py
```

If `python` is not available on this computer, double-click this file from the project folder:

```text
start-member-server.cmd
```

Then open:

```text
http://127.0.0.1:8000/pages/members.html
```

Opening the website directly with `file://` will still display pages, but the member form cannot save to the database unless the backend server is running.

## API

- `GET /api/health` checks that the server and database are ready.
- `POST /api/members` creates a member.
- `GET /api/members` lists active members for local admin checking.

## Member Fields

The main `members` table stores:

- `member_code`
- `full_name`
- `email`
- `phone`
- `preferred_language`
- `company`
- `job_title`
- `country`
- `birth_date`
- `gender`
- `wellness_goal`
- `marketing_consent`
- `privacy_consent`
- `status`
- `notes`
- `created_at`
- `updated_at`
