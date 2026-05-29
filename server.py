from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
import json
import mimetypes
import os
import secrets
import sqlite3


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "database" / "members.sqlite"
SCHEMA_PATH = BASE_DIR / "database" / "schema.sql"
DATABASE_URL = os.environ.get("DATABASE_URL")
HOST = os.environ.get("AROTEC_HOST") or ("0.0.0.0" if os.environ.get("PORT") else "127.0.0.1")
PORT = int(os.environ.get("PORT") or os.environ.get("AROTEC_PORT", "8000"))


def init_db() -> None:
    if DATABASE_URL:
        init_postgres_db()
        return

    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    schema = SCHEMA_PATH.read_text(encoding="utf-8")
    with sqlite3.connect(DB_PATH) as connection:
        connection.executescript(schema)
        connection.commit()


def init_postgres_db() -> None:
    with connect_db() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS members (
                  id BIGSERIAL PRIMARY KEY,
                  member_code TEXT NOT NULL UNIQUE,
                  full_name TEXT NOT NULL,
                  email TEXT NOT NULL UNIQUE,
                  phone TEXT,
                  preferred_language TEXT NOT NULL DEFAULT 'th',
                  company TEXT,
                  job_title TEXT,
                  country TEXT,
                  birth_date TEXT,
                  gender TEXT,
                  wellness_goal TEXT,
                  marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
                  privacy_consent BOOLEAN NOT NULL DEFAULT TRUE,
                  status TEXT NOT NULL DEFAULT 'active',
                  notes TEXT,
                  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_members_email ON members (email)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_members_status ON members (status)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_members_created_at ON members (created_at)")
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS member_events (
                  id BIGSERIAL PRIMARY KEY,
                  member_id BIGINT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
                  event_type TEXT NOT NULL,
                  event_data TEXT,
                  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
        connection.commit()


def connect_db():
    if DATABASE_URL:
        from psycopg import connect
        from psycopg.rows import dict_row

        return connect(DATABASE_URL, row_factory=dict_row)

    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def db_backend() -> str:
    return "postgres" if DATABASE_URL else "sqlite"


def db_param() -> str:
    return "%s" if DATABASE_URL else "?"


def rows_to_dicts(rows) -> list[dict]:
    return [dict(row) for row in rows]


def is_unique_error(error: Exception) -> bool:
    if isinstance(error, sqlite3.IntegrityError):
      return True
    return getattr(error, "sqlstate", None) == "23505"


def make_member_code() -> str:
    return f"AR-{secrets.token_hex(4).upper()}"


def json_response(handler: SimpleHTTPRequestHandler, status: int, payload: dict) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.end_headers()
    handler.wfile.write(body)


def read_json(handler: SimpleHTTPRequestHandler) -> dict:
    length = int(handler.headers.get("Content-Length", "0"))
    if length <= 0:
        return {}
    raw = handler.rfile.read(length).decode("utf-8")
    return json.loads(raw)


def clean_text(value, max_length: int = 255):
    if value is None:
        return None
    text = str(value).strip()
    return text[:max_length] if text else None


class ArotecHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        json_response(self, 200, {"ok": True})

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            json_response(self, 200, {"ok": True, "database": db_backend()})
            return
        if parsed.path == "/api/members":
            self.list_members()
            return
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/members":
            self.create_member()
            return
        json_response(self, 404, {"ok": False, "error": "Not found"})

    def list_members(self) -> None:
        with connect_db() as connection:
            query = """
            SELECT id, member_code, full_name, email, phone, preferred_language,
                   company, wellness_goal, marketing_consent, status, created_at
            FROM members
            WHERE status != 'deleted'
            ORDER BY created_at DESC
            LIMIT 200
            """
            if DATABASE_URL:
                with connection.cursor() as cursor:
                    cursor.execute(query)
                    rows = cursor.fetchall()
            else:
                rows = connection.execute(query).fetchall()
        json_response(self, 200, {"ok": True, "members": rows_to_dicts(rows)})

    def insert_member(self, values: tuple, member_code: str) -> int:
        with connect_db() as connection:
            if DATABASE_URL:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        INSERT INTO members (
                          member_code, full_name, email, phone, preferred_language, company,
                          job_title, country, birth_date, gender, wellness_goal,
                          marketing_consent, privacy_consent, notes
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id
                        """,
                        values,
                    )
                    member_id = cursor.fetchone()["id"]
                    cursor.execute(
                        "INSERT INTO member_events (member_id, event_type, event_data) VALUES (%s, %s, %s)",
                        (member_id, "member_created", json.dumps({"source": "website"}, ensure_ascii=False)),
                    )
                connection.commit()
                return member_id

            cursor = connection.execute(
                """
                INSERT INTO members (
                  member_code, full_name, email, phone, preferred_language, company,
                  job_title, country, birth_date, gender, wellness_goal,
                  marketing_consent, privacy_consent, notes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                values,
            )
            member_id = cursor.lastrowid
            connection.execute(
                "INSERT INTO member_events (member_id, event_type, event_data) VALUES (?, ?, ?)",
                (member_id, "member_created", json.dumps({"source": "website"}, ensure_ascii=False)),
            )
            connection.commit()
            return member_id

    def create_member(self) -> None:
        try:
            payload = read_json(self)
        except json.JSONDecodeError:
            json_response(self, 400, {"ok": False, "error": "Invalid JSON"})
            return

        full_name = clean_text(payload.get("full_name"))
        email = clean_text(payload.get("email"))
        phone = clean_text(payload.get("phone"), 80)
        preferred_language = clean_text(payload.get("preferred_language"), 16) or "th"
        company = clean_text(payload.get("company"))
        job_title = clean_text(payload.get("job_title"))
        country = clean_text(payload.get("country"))
        birth_date = clean_text(payload.get("birth_date"), 32)
        gender = clean_text(payload.get("gender"), 32)
        wellness_goal = clean_text(payload.get("wellness_goal"), 500)
        notes = clean_text(payload.get("notes"), 1000)
        marketing_consent = 1 if payload.get("marketing_consent") else 0
        privacy_consent = 1 if payload.get("privacy_consent", True) else 0

        if not full_name or not email:
            json_response(self, 400, {"ok": False, "error": "Full name and email are required"})
            return
        if "@" not in email:
            json_response(self, 400, {"ok": False, "error": "Email is invalid"})
            return
        if not privacy_consent:
            json_response(self, 400, {"ok": False, "error": "Privacy consent is required"})
            return

        member_code = make_member_code()
        values = (
            member_code,
            full_name,
            email.lower(),
            phone,
            preferred_language,
            company,
            job_title,
            country,
            birth_date,
            gender,
            wellness_goal,
            marketing_consent,
            privacy_consent,
            notes,
        )
        try:
            member_id = self.insert_member(values, member_code)
        except Exception as error:
            if not is_unique_error(error):
                raise
            json_response(self, 409, {"ok": False, "error": "This email is already registered"})
            return

        json_response(self, 201, {"ok": True, "member": {"id": member_id, "member_code": member_code}})


def main() -> None:
    init_db()
    mimetypes.add_type("application/javascript; charset=utf-8", ".js")
    mimetypes.add_type("text/css; charset=utf-8", ".css")
    server = ThreadingHTTPServer((HOST, PORT), ArotecHandler)
    print(f"Arotec member server running at http://{HOST}:{PORT}/")
    print(f"Member register page: http://{HOST}:{PORT}/pages/members.html")
    print(f"Database: {db_backend()}")
    server.serve_forever()


if __name__ == "__main__":
    main()
