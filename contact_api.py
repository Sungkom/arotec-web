"""Private contact inquiries using the existing Arotec database and admin access."""
import hashlib
import json
import re
import secrets
from urllib.parse import parse_qs, urlparse

from careers_api import APIError, CareersAPI, field, timestamp


AREAS = ["Flavor","Fragrance","Food ingredients","Functional solutions","Skincare","Sensory science","Biotechnology","Business partnership","Other"]
HELP_TOPICS = ["new_project","improve_product","sensory_strategy","find_solution","co_creation","partnership"]
STATES = {"new", "in_progress", "replied", "closed"}
CONSENT_VERSION = "contact-2026-09-09"
DETAIL_COLUMNS = """id,reference,first_name,last_name,company,job_title,email,country,
area_of_interest,help_topic,message,privacy_consent,consent_version,status,admin_notes,created_at,updated_at"""


class ContactAPI(CareersAPI):
    """Reuse database, request limits, origin checks and response helpers."""

    def initialize(self):
        with self.database() as connection:
            self.execute(connection, """CREATE TABLE IF NOT EXISTS contact_inquiries (
                id TEXT PRIMARY KEY, reference TEXT NOT NULL UNIQUE,
                submission_key TEXT NOT NULL UNIQUE, submission_hash TEXT NOT NULL,
                first_name TEXT NOT NULL, last_name TEXT NOT NULL, company TEXT NOT NULL,
                job_title TEXT NOT NULL, email TEXT NOT NULL, country TEXT NOT NULL,
                area_of_interest TEXT NOT NULL, help_topic TEXT NOT NULL, message TEXT NOT NULL,
                privacy_consent INTEGER NOT NULL, consent_version TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'new', admin_notes TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL, updated_at TEXT NOT NULL)""")
            self.execute(connection, "CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_inquiries(created_at)")
            self.execute(connection, "CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_inquiries(status)")

    def require_admin(self, handler):
        if not self.admin_password:
            raise APIError(503, "Admin access is not configured.")
        authorization = handler.headers.get("Authorization", "")
        token = authorization[7:] if authorization.startswith("Bearer ") else ""
        if len(token) > 4096 or not secrets.compare_digest(token.encode("utf-8"), self.admin_password.encode("utf-8")):
            self.rate_limit(handler, "contact-admin-auth", 10, 600)
            raise APIError(401, "Incorrect admin password.")

    def create_inquiry(self, handler):
        if not self.admin_password:
            raise APIError(503, "The inquiry service is not accepting submissions yet.")
        self.rate_limit(handler, "contact-submit", 8, 3600)
        payload = self.json_body(handler)
        allowed = {"submission_key", "first_name", "last_name", "company", "job_title",
                   "email", "country", "area_of_interest", "help_topic", "message",
                   "privacy_consent", "company_website"}
        if set(payload) - allowed:
            raise APIError(400, "Unexpected form fields.")
        if field(payload, "company_website", 200):
            raise APIError(400, "The inquiry could not be accepted.")
        key = field(payload, "submission_key", 32, True)
        if not re.fullmatch(r"[a-f0-9]{32}", key):
            raise APIError(400, "Reload the form before submitting.")
        data = {
            "first_name": field(payload, "first_name", 100, True),
            "last_name": field(payload, "last_name", 100, True),
            "company": field(payload, "company", 180, True),
            "job_title": field(payload, "job_title", 180),
            "email": field(payload, "email", 254, True).lower(),
            "country": field(payload, "country", 120, True),
            "area_of_interest": field(payload, "area_of_interest", 100, True),
            "help_topic": field(payload, "help_topic", 60, True),
            "message": field(payload, "message", 10000),
        }
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", data["email"]):
            raise APIError(400, "Enter a valid email address.")
        if data["area_of_interest"] not in AREAS or data["help_topic"] not in HELP_TOPICS:
            raise APIError(400, "Select an area of interest and how we can help.")
        if payload.get("privacy_consent") is not True:
            raise APIError(400, "Please consent to the use of your details to respond to this inquiry.")
        fingerprint = hashlib.sha256(json.dumps(data, sort_keys=True).encode("utf-8")).hexdigest()
        now = timestamp()
        record = {
            "id": secrets.token_hex(16), "reference": "INQ-" + secrets.token_hex(6).upper(),
            "submission_key": key, "submission_hash": fingerprint, **data,
            "privacy_consent": 1, "consent_version": CONSENT_VERSION,
            "status": "new", "admin_notes": "", "created_at": now, "updated_at": now,
        }
        with self.database() as connection:
            self.execute(connection,
                "INSERT INTO contact_inquiries (" + ",".join(record) + ") VALUES (" +
                ",".join("?" for _ in record) + ") ON CONFLICT(submission_key) DO NOTHING",
                tuple(record.values()))
            saved = self.execute(connection,
                "SELECT reference,submission_hash FROM contact_inquiries WHERE submission_key=?", (key,)).fetchone()
            if not saved or not secrets.compare_digest(saved["submission_hash"], fingerprint):
                raise APIError(409, "This submission key was already used. Reload before sending a new inquiry.")
            reference = saved["reference"]
        self.response(handler, 201, {"ok": True, "reference": reference})

    def list_inquiries(self, handler, query):
        try:
            page = max(1, min(int(query.get("page", ["1"])[0]), 100000))
        except ValueError:
            raise APIError(400, "Invalid page.")
        status = query.get("status", [""])[0]
        search = query.get("q", [""])[0].strip()[:180]
        conditions, values = [], []
        if status:
            if status not in STATES:
                raise APIError(400, "Invalid status.")
            conditions.append("status=?")
            values.append(status)
        if search:
            conditions.append("""(LOWER(first_name || ' ' || last_name) LIKE ? OR
                LOWER(company) LIKE ? OR LOWER(email) LIKE ? OR LOWER(reference) LIKE ?)""")
            values.extend(["%" + search.lower() + "%"] * 4)
        where = " WHERE " + " AND ".join(conditions) if conditions else ""
        with self.database() as connection:
            total = self.execute(connection, "SELECT COUNT(*) AS total FROM contact_inquiries" + where, tuple(values)).fetchone()["total"]
            rows = self.execute(connection, """SELECT id,reference,first_name,last_name,company,email,
                area_of_interest,help_topic,status,created_at FROM contact_inquiries""" +
                where + " ORDER BY created_at DESC,id LIMIT 25 OFFSET ?", (*values, (page - 1) * 25)).fetchall()
        self.response(handler, 200, {"ok": True, "inquiries": [dict(row) for row in rows], "total": total, "page": page})

    def inquiry(self, handler, inquiry_id):
        method = handler.command
        if method not in {"GET", "PUT", "DELETE"}:
            raise APIError(405, "Method not allowed.")
        payload = self.json_body(handler) if method == "PUT" else None
        with self.database() as connection:
            row = self.execute(connection, "SELECT " + DETAIL_COLUMNS + " FROM contact_inquiries WHERE id=?", (inquiry_id,)).fetchone()
            if not row:
                raise APIError(404, "Inquiry not found.")
            if method == "GET":
                result = dict(row)
            elif method == "PUT":
                status = field(payload, "status", 30, True)
                notes = field(payload, "admin_notes", 10000)
                expected = field(payload, "updated_at", 60, True)
                if status not in STATES:
                    raise APIError(400, "Invalid status.")
                changed = self.execute(connection, """UPDATE contact_inquiries SET status=?,admin_notes=?,updated_at=?
                    WHERE id=? AND updated_at=?""", (status, notes, timestamp(), inquiry_id, expected))
                if not changed.rowcount:
                    raise APIError(409, "This inquiry changed. Reopen it before saving.")
                result = dict(self.execute(connection, "SELECT " + DETAIL_COLUMNS + " FROM contact_inquiries WHERE id=?", (inquiry_id,)).fetchone())
            else:
                self.execute(connection, "DELETE FROM contact_inquiries WHERE id=?", (inquiry_id,))
                result = {"deleted": True}
        self.response(handler, 200, {"ok": True, "inquiry": result})

    def handle(self, handler):
        parsed = urlparse(handler.path)
        path = parsed.path.rstrip("/")
        if not (path == "/api/contact" or path.startswith("/api/contact/") or
                path == "/api/admin/contact" or path.startswith("/api/admin/contact/")):
            return False
        try:
            self.check_origin(handler)
            if handler.command == "OPTIONS":
                self.response(handler, 200, {"ok": True})
            elif path.startswith("/api/admin/contact"):
                self.require_admin(handler)
                match = re.fullmatch(r"/api/admin/contact/inquiries(?:/([a-f0-9]{32}))?", path)
                if not match:
                    raise APIError(404, "Not found.")
                if match.group(1):
                    self.inquiry(handler, match.group(1))
                elif handler.command == "GET":
                    self.list_inquiries(handler, parse_qs(parsed.query))
                else:
                    raise APIError(405, "Method not allowed.")
            elif path == "/api/contact/status" and handler.command == "GET":
                self.response(handler, 200, {"ok": True, "accepting_inquiries": bool(self.admin_password)})
            elif path == "/api/contact/inquiries" and handler.command == "POST":
                self.create_inquiry(handler)
            else:
                raise APIError(404, "Not found.")
        except APIError as error:
            handler.close_connection = True
            self.response(handler, error.status, {"ok": False, "error": error.message})
        except (TimeoutError, ConnectionError):
            handler.close_connection = True
        except Exception:
            handler.close_connection = True
            self.response(handler, 500, {"ok": False, "error": "The inquiry service could not complete this request. Please try again."})
        return True

