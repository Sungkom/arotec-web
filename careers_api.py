"""Recruitment API using the site's existing database and admin password.

PDF files are stored as private database blobs, never as public static assets.
"""
import hashlib
import json
import re
import secrets
import threading
import time
from collections import OrderedDict
from contextlib import contextmanager
from datetime import datetime, timezone
from email import policy
from email.parser import BytesParser
from urllib.parse import parse_qs, quote, urlparse


MIB = 1024 * 1024
FILE_LIMITS = {"resume": 10 * MIB, "portfolio": 20 * MIB}
JOB_STATES = {"draft", "published", "closed"}
APPLICATION_STATES = {"new", "in_review", "interview", "offer", "hired", "not_selected"}
LOCATIONS = {"Taipei / New Taipei City", "Bangkok", "Tokyo", "Los Angeles / California", "Remote / Flexible", "Open to relocation"}
CONSENT_VERSION = "2026-09-09"
JOB_COLUMNS = "id,title,department,location,employment_type,experience,summary,description,requirements,status,created_at,updated_at"
APPLICATION_COLUMNS = """id,reference,job_id,job_title,full_name,email,phone,current_location,
preferred_locations,professional_background,current_role,profile_url,privacy_consent,
future_consent,consent_version,status,admin_notes,created_at,updated_at"""
REFERENCE_JOBS = [
    ("Senior Flavorist", "Flavor", "Taipei / Bangkok", "5+ years", "Develop innovative flavors and solutions for food & beverage, health, and functional products."),
    ("Perfumer", "Fragrance", "Tokyo / Bangkok", "3+ years", "Create unique fragrances and sensory experiences for beauty, personal care, and lifestyle products."),
    ("Sensory Scientist", "Sensory Science", "Taipei / Tokyo", "3+ years", "Design and conduct sensory research and consumer studies to drive product and experience innovation."),
]


class APIError(Exception):
    def __init__(self, status, message):
        self.status = status
        self.message = message
        super().__init__(message)


def timestamp():
    return datetime.now(timezone.utc).isoformat(timespec="microseconds")


def field(payload, name, limit, required=False):
    value = payload.get(name, "")
    if not isinstance(value, str):
        raise APIError(400, "Invalid field: " + name)
    value = value.strip()
    if len(value) > limit or "\x00" in value:
        raise APIError(400, "Field is too long or invalid: " + name)
    if required and not value:
        raise APIError(400, "Required field: " + name)
    return value


class CareersAPI:
    def __init__(self, connect, postgres, admin_password):
        self.connect = connect
        self.postgres = postgres
        self.admin_password = admin_password
        self.rate_lock = threading.Lock()
        self.rate_windows = OrderedDict()
        self.upload_slots = threading.BoundedSemaphore(2)

    @contextmanager
    def database(self):
        connection = self.connect()
        try:
            if not self.postgres:
                connection.execute("PRAGMA foreign_keys=ON")
                connection.execute("PRAGMA busy_timeout=10000")
            yield connection
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

    def execute(self, connection, sql, parameters=()):
        cursor = connection.cursor()
        cursor.execute(sql.replace("?", "%s") if self.postgres else sql, parameters)
        return cursor

    def initialize(self):
        blob_type = "BYTEA" if self.postgres else "BLOB"
        statements = [
            """CREATE TABLE IF NOT EXISTS career_meta (
                name TEXT PRIMARY KEY, value TEXT NOT NULL)""",
            """CREATE TABLE IF NOT EXISTS career_jobs (
                id TEXT PRIMARY KEY, title TEXT NOT NULL, department TEXT NOT NULL,
                location TEXT NOT NULL, employment_type TEXT NOT NULL, experience TEXT NOT NULL,
                summary TEXT NOT NULL, description TEXT NOT NULL, requirements TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'draft', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)""",
            """CREATE TABLE IF NOT EXISTS career_applications (
                id TEXT PRIMARY KEY, reference TEXT NOT NULL UNIQUE,
                submission_key TEXT NOT NULL UNIQUE, submission_hash TEXT NOT NULL,
                job_id TEXT REFERENCES career_jobs(id), job_title TEXT NOT NULL,
                full_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
                current_location TEXT NOT NULL, preferred_locations TEXT NOT NULL,
                professional_background TEXT NOT NULL, current_role TEXT NOT NULL,
                profile_url TEXT NOT NULL, privacy_consent INTEGER NOT NULL,
                future_consent INTEGER NOT NULL, consent_version TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'new', admin_notes TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL, updated_at TEXT NOT NULL)""",
            """CREATE TABLE IF NOT EXISTS career_files (
                application_id TEXT NOT NULL REFERENCES career_applications(id) ON DELETE CASCADE,
                kind TEXT NOT NULL, filename TEXT NOT NULL, size_bytes INTEGER NOT NULL,
                content """ + blob_type + """ NOT NULL, PRIMARY KEY (application_id, kind))""",
            "CREATE INDEX IF NOT EXISTS idx_career_jobs_status ON career_jobs(status)",
            "CREATE INDEX IF NOT EXISTS idx_career_applications_created ON career_applications(created_at)",
            "CREATE INDEX IF NOT EXISTS idx_career_applications_status ON career_applications(status)",
        ]
        with self.database() as connection:
            for statement in statements:
                self.execute(connection, statement)
            marker = self.execute(
                connection,
                "INSERT INTO career_meta(name,value) VALUES (?,?) ON CONFLICT(name) DO NOTHING",
                ("reference_jobs_seeded", "1"),
            )
            if marker.rowcount:
                for title, department, location, experience, summary in REFERENCE_JOBS:
                    now = timestamp()
                    self.execute(connection, """INSERT INTO career_jobs
                        (id,title,department,location,employment_type,experience,summary,description,requirements,status,created_at,updated_at)
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
                        (secrets.token_hex(16), title, department, location, "Full-time", experience,
                         summary, summary, "Add and approve role requirements before publishing.", "draft", now, now))

    def response(self, handler, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        handler.send_response(status)
        handler.send_header("Content-Type", "application/json; charset=utf-8")
        handler.send_header("Content-Length", str(len(body)))
        handler.send_header("Cache-Control", "no-store, private")
        handler.send_header("X-Content-Type-Options", "nosniff")
        handler.send_header("Referrer-Policy", "no-referrer")
        handler.end_headers()
        handler.wfile.write(body)

    def rate_limit(self, handler, group, limit, seconds):
        key = (group, handler.client_address[0])
        now = time.monotonic()
        with self.rate_lock:
            count, start = self.rate_windows.get(key, (0, now))
            if now - start >= seconds:
                count, start = 0, now
            if count >= limit:
                raise APIError(429, "Too many attempts. Please try again later.")
            self.rate_windows[key] = (count + 1, start)
            self.rate_windows.move_to_end(key)
            while len(self.rate_windows) > 10000:
                self.rate_windows.popitem(last=False)

    def require_admin(self, handler):
        if not self.admin_password:
            raise APIError(503, "Admin access is not configured. Set AROTEC_ADMIN_PASSWORD on the server.")
        authorization = handler.headers.get("Authorization", "")
        token = authorization[7:] if authorization.startswith("Bearer ") else ""
        if len(token) > 4096 or not secrets.compare_digest(token, self.admin_password):
            self.rate_limit(handler, "admin-auth", 10, 600)
            raise APIError(401, "Incorrect admin password.")

    def check_origin(self, handler):
        if handler.headers.get("Sec-Fetch-Site") == "cross-site":
            raise APIError(403, "Cross-site requests are not allowed.")
        origin = handler.headers.get("Origin")
        if origin:
            parsed = urlparse(origin)
            if parsed.scheme not in {"http", "https"} or parsed.netloc.lower() != handler.headers.get("Host", "").lower():
                raise APIError(403, "Request origin does not match this website.")

    def body(self, handler, maximum):
        lengths = handler.headers.get_all("Content-Length", [])
        if len(lengths) != 1 or handler.headers.get("Transfer-Encoding"):
            raise APIError(411, "A single Content-Length header is required.")
        try:
            length = int(lengths[0])
        except ValueError:
            raise APIError(400, "Invalid request length.")
        if length <= 0 or length > maximum:
            raise APIError(413, "The request exceeds the upload size limit.")
        handler.connection.settimeout(45)
        data = handler.rfile.read(length)
        if len(data) != length:
            raise APIError(400, "Upload was incomplete. Please try again.")
        return data

    def json_body(self, handler):
        if handler.headers.get_content_type() != "application/json":
            raise APIError(415, "JSON content is required.")
        try:
            data = json.loads(self.body(handler, 64 * 1024).decode("utf-8"))
        except (ValueError, UnicodeError):
            raise APIError(400, "Invalid JSON request.")
        if not isinstance(data, dict):
            raise APIError(400, "A JSON object is required.")
        return data

    def multipart(self, handler):
        content_type = handler.headers.get("Content-Type", "")
        if len(content_type) > 200 or handler.headers.get_content_type() != "multipart/form-data":
            raise APIError(415, "Use the application form to upload your documents.")
        boundary = handler.headers.get_param("boundary")
        if not boundary or not re.fullmatch(r"[A-Za-z0-9'()+_,./:=?-]{1,70}", boundary):
            raise APIError(400, "Invalid upload boundary.")
        raw = self.body(handler, 32 * MIB)
        envelope = ("Content-Type: " + content_type + "\r\nMIME-Version: 1.0\r\n\r\n").encode("ascii") + raw
        message = BytesParser(policy=policy.default).parsebytes(envelope)
        if not message.is_multipart() or message.defects:
            raise APIError(400, "Malformed upload.")
        allowed = {"submission_key", "full_name", "email", "phone", "current_location", "job_id",
                   "general_application", "preferred_locations", "professional_background", "current_role",
                   "profile_url", "privacy_consent", "future_consent", "company_website"}
        fields, files = {}, {}
        parts = list(message.iter_parts())
        if len(parts) > 20:
            raise APIError(400, "Too many form fields.")
        for part in parts:
            if part.is_multipart() or part.get_content_disposition() != "form-data":
                raise APIError(400, "Invalid form part.")
            name = part.get_param("name", header="content-disposition")
            if name in fields or name in files:
                raise APIError(400, "Duplicate form field.")
            content = part.get_payload(decode=True)
            if not isinstance(content, bytes):
                raise APIError(400, "Invalid form content.")
            filename = part.get_filename()
            if filename is not None:
                if name not in FILE_LIMITS:
                    raise APIError(400, "Unexpected upload field.")
                if not filename and not content:
                    continue
                filename = filename.replace("\\", "/").rsplit("/", 1)[-1]
                filename = "".join(c for c in filename if ord(c) >= 32 and ord(c) != 127)[:180]
                if not filename.lower().endswith(".pdf") or part.get_content_type() not in {"application/pdf", "application/octet-stream"}:
                    raise APIError(400, "Resume and supporting documents must be PDF files.")
                if not content or len(content) > FILE_LIMITS[name]:
                    raise APIError(413, "Resume limit: 10 MB. Supporting document limit: 20 MB.")
                if not content.startswith(b"%PDF-") or b"%%EOF" not in content[-4096:]:
                    raise APIError(400, "The uploaded document is not a recognized PDF file.")
                files[name] = {"filename": filename, "content": content, "size_bytes": len(content)}
            else:
                if name not in allowed or len(content) > 30000:
                    raise APIError(400, "Unexpected or oversized form field.")
                try:
                    fields[name] = content.decode("utf-8")
                except UnicodeError:
                    raise APIError(400, "Form text must be UTF-8.")
        return fields, files

    def public_jobs(self, handler):
        with self.database() as connection:
            jobs = self.execute(connection, "SELECT " + JOB_COLUMNS + " FROM career_jobs WHERE status=? ORDER BY created_at,id", ("published",)).fetchall()
        self.response(handler, 200, {"ok": True, "jobs": [dict(row) for row in jobs], "accepting_applications": bool(self.admin_password)})

    def create_application(self, handler):
        if not self.admin_password:
            raise APIError(503, "Recruitment is not accepting applications yet. Please try again later.")
        self.rate_limit(handler, "applications", 8, 3600)
        if not self.upload_slots.acquire(blocking=False):
            raise APIError(503, "Uploads are busy. Please try again shortly.")
        try:
            payload, files = self.multipart(handler)
            if field(payload, "company_website", 200):
                raise APIError(400, "Application could not be accepted.")
            submission_key = field(payload, "submission_key", 64, True)
            if not re.fullmatch(r"[a-f0-9-]{32,36}", submission_key):
                raise APIError(400, "Invalid submission key. Reload the form.")
            data = {
                "full_name": field(payload, "full_name", 180, True),
                "email": field(payload, "email", 254, True).lower(),
                "phone": field(payload, "phone", 80, True),
                "current_location": field(payload, "current_location", 180, True),
                "professional_background": field(payload, "professional_background", 8000),
                "current_role": field(payload, "current_role", 180),
                "profile_url": field(payload, "profile_url", 500),
            }
            if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", data["email"]):
                raise APIError(400, "Enter a valid email address.")
            if data["profile_url"]:
                link = urlparse(data["profile_url"])
                if link.scheme not in {"http", "https"} or not link.netloc:
                    raise APIError(400, "Profile links must use http or https.")
            if payload.get("privacy_consent") != "1":
                raise APIError(400, "Privacy consent is required.")
            if "resume" not in files:
                raise APIError(400, "Please upload your resume as a PDF.")
            try:
                preferences = json.loads(payload.get("preferred_locations", "[]"))
            except ValueError:
                raise APIError(400, "Invalid preferred locations.")
            if not isinstance(preferences, list) or len(preferences) > 6 or any(not isinstance(item, str) or item not in LOCATIONS for item in preferences):
                raise APIError(400, "Invalid preferred locations.")
            data["preferred_locations"] = json.dumps(list(dict.fromkeys(preferences)))
            data["future_consent"] = int(payload.get("future_consent") == "1")
            general = payload.get("general_application") == "1"
            job_id = None if general else field(payload, "job_id", 32, True)
            fingerprint = hashlib.sha256(json.dumps({"data": data, "job_id": job_id,
                "files": {kind: hashlib.sha256(file["content"]).hexdigest() for kind, file in files.items()}},
                sort_keys=True).encode("utf-8")).hexdigest()
            with self.database() as connection:
                previous = self.execute(connection, "SELECT reference,submission_hash FROM career_applications WHERE submission_key=?", (submission_key,)).fetchone()
                if previous:
                    if not secrets.compare_digest(previous["submission_hash"], fingerprint):
                        raise APIError(409, "This submission key was already used. Reload the form before making a new application.")
                    reference = previous["reference"]
                else:
                    title = "Open application / General talent pool"
                    if job_id:
                        job = self.execute(connection, "SELECT title FROM career_jobs WHERE id=? AND status=?", (job_id, "published")).fetchone()
                        if not job:
                            raise APIError(409, "This position is no longer available. Refresh the page or choose an open application.")
                        title = job["title"]
                    application_id = secrets.token_hex(16)
                    reference = "APP-" + secrets.token_hex(6).upper()
                    now = timestamp()
                    self.execute(connection, """INSERT INTO career_applications
                        (id,reference,submission_key,submission_hash,job_id,job_title,full_name,email,phone,current_location,
                         preferred_locations,professional_background,current_role,profile_url,privacy_consent,future_consent,
                         consent_version,status,admin_notes,created_at,updated_at)
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                        ON CONFLICT(submission_key) DO NOTHING""",
                        (application_id, reference, submission_key, fingerprint, job_id, title,
                         data["full_name"], data["email"], data["phone"], data["current_location"],
                         data["preferred_locations"], data["professional_background"], data["current_role"], data["profile_url"],
                         1, data["future_consent"], CONSENT_VERSION, "new", "", now, now))
                    saved = self.execute(connection, "SELECT id,reference,submission_hash FROM career_applications WHERE submission_key=?", (submission_key,)).fetchone()
                    if not secrets.compare_digest(saved["submission_hash"], fingerprint):
                        raise APIError(409, "Submission conflict. Reload the form before applying again.")
                    reference = saved["reference"]
                    if saved["id"] == application_id:
                        for kind, file in files.items():
                            self.execute(connection, """INSERT INTO career_files(application_id,kind,filename,size_bytes,content)
                                VALUES (?,?,?,?,?)""", (application_id, kind, file["filename"], file["size_bytes"], file["content"]))
            self.response(handler, 201, {"ok": True, "reference": reference})
        finally:
            self.upload_slots.release()

    def jobs(self, handler, job_id=None):
        method = handler.command
        if method == "GET" and not job_id:
            with self.database() as connection:
                rows = self.execute(connection, "SELECT " + JOB_COLUMNS + " FROM career_jobs ORDER BY created_at DESC,id").fetchall()
            self.response(handler, 200, {"ok": True, "jobs": [dict(row) for row in rows]})
            return
        if method not in {"POST", "PUT"} or (method == "PUT" and not job_id) or (method == "POST" and job_id):
            raise APIError(405, "Method not allowed.")
        payload = self.json_body(handler)
        values = [
            field(payload, "title", 180, True), field(payload, "department", 120),
            field(payload, "location", 180, True), field(payload, "employment_type", 80, True),
            field(payload, "experience", 80), field(payload, "summary", 1000, True),
            field(payload, "description", 15000, True), field(payload, "requirements", 15000),
            field(payload, "status", 20, True),
        ]
        if values[-1] not in JOB_STATES:
            raise APIError(400, "Invalid position status.")
        now = timestamp()
        with self.database() as connection:
            if method == "POST":
                job_id = secrets.token_hex(16)
                self.execute(connection, """INSERT INTO career_jobs
                    (title,department,location,employment_type,experience,summary,description,requirements,status,id,created_at,updated_at)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""", (*values, job_id, now, now))
            else:
                expected = field(payload, "updated_at", 60, True)
                cursor = self.execute(connection, """UPDATE career_jobs SET title=?,department=?,location=?,employment_type=?,
                    experience=?,summary=?,description=?,requirements=?,status=?,updated_at=? WHERE id=? AND updated_at=?""",
                    (*values, now, job_id, expected))
                if not cursor.rowcount:
                    raise APIError(409, "The position changed or no longer exists. Reload before editing.")
        self.response(handler, 201 if method == "POST" else 200, {"ok": True, "id": job_id})

    def applications(self, handler, application_id, query):
        if handler.command == "GET" and not application_id:
            try:
                page = max(1, min(int(query.get("page", ["1"])[0]), 100000))
            except ValueError:
                raise APIError(400, "Invalid page.")
            status = query.get("status", [""])[0]
            search = query.get("q", [""])[0].strip()[:180]
            conditions, values = [], []
            if status:
                if status not in APPLICATION_STATES:
                    raise APIError(400, "Invalid status.")
                conditions.append("status=?")
                values.append(status)
            if search:
                conditions.append("(LOWER(full_name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(reference) LIKE ? OR LOWER(job_title) LIKE ?)")
                values.extend(["%" + search.lower() + "%"] * 4)
            where = " WHERE " + " AND ".join(conditions) if conditions else ""
            with self.database() as connection:
                count = self.execute(connection, "SELECT COUNT(*) AS total FROM career_applications" + where, tuple(values)).fetchone()["total"]
                rows = self.execute(connection, """SELECT id,reference,full_name,email,job_title,status,created_at
                    FROM career_applications""" + where + " ORDER BY created_at DESC,id LIMIT 25 OFFSET ?",
                    (*values, (page - 1) * 25)).fetchall()
            self.response(handler, 200, {"ok": True, "applications": [dict(row) for row in rows], "page": page, "total": count})
            return
        if not application_id:
            raise APIError(405, "Method not allowed.")
        with self.database() as connection:
            row = self.execute(connection, "SELECT " + APPLICATION_COLUMNS + " FROM career_applications WHERE id=?", (application_id,)).fetchone()
            if not row:
                raise APIError(404, "Application not found.")
            if handler.command == "GET":
                result = dict(row)
                result["preferred_locations"] = json.loads(result["preferred_locations"])
                result["files"] = [dict(file) for file in self.execute(connection,
                    "SELECT kind,filename,size_bytes FROM career_files WHERE application_id=? ORDER BY kind", (application_id,)).fetchall()]
            elif handler.command == "PUT":
                payload = self.json_body(handler)
                status = field(payload, "status", 30, True)
                notes = field(payload, "admin_notes", 10000)
                if status not in APPLICATION_STATES:
                    raise APIError(400, "Invalid application status.")
                expected = field(payload, "updated_at", 60, True)
                cursor = self.execute(connection, """UPDATE career_applications SET status=?,admin_notes=?,updated_at=?
                    WHERE id=? AND updated_at=?""", (status, notes, timestamp(), application_id, expected))
                if not cursor.rowcount:
                    raise APIError(409, "The application changed. Reload before saving.")
                result = {"id": application_id}
            elif handler.command == "DELETE":
                self.execute(connection, "DELETE FROM career_files WHERE application_id=?", (application_id,))
                self.execute(connection, "DELETE FROM career_applications WHERE id=?", (application_id,))
                result = {"deleted": True}
            else:
                raise APIError(405, "Method not allowed.")
        self.response(handler, 200, {"ok": True, "application": result})

    def download(self, handler, application_id, kind):
        with self.database() as connection:
            row = self.execute(connection, "SELECT filename,content FROM career_files WHERE application_id=? AND kind=?", (application_id, kind)).fetchone()
        if not row:
            raise APIError(404, "Document not found.")
        body = bytes(row["content"])
        handler.send_response(200)
        handler.send_header("Content-Type", "application/octet-stream")
        handler.send_header("Content-Length", str(len(body)))
        handler.send_header("Content-Disposition", "attachment; filename=" + kind + ".pdf; filename*=UTF-8''" + quote(row["filename"], safe=""))
        handler.send_header("Cache-Control", "no-store, private")
        handler.send_header("X-Content-Type-Options", "nosniff")
        handler.send_header("Content-Security-Policy", "sandbox; default-src 'none'")
        handler.send_header("Referrer-Policy", "no-referrer")
        handler.end_headers()
        handler.wfile.write(body)

    def handle(self, handler):
        parsed = urlparse(handler.path)
        path = parsed.path.rstrip("/")
        if not (path == "/api/careers" or path.startswith("/api/careers/") or path == "/api/admin/careers" or path.startswith("/api/admin/careers/")):
            return False
        try:
            if handler.command == "OPTIONS":
                self.response(handler, 200, {"ok": True})
                return True
            self.check_origin(handler)
            if path.startswith("/api/admin/careers"):
                self.require_admin(handler)
                jobs = re.fullmatch(r"/api/admin/careers/jobs(?:/([a-f0-9]{32}))?", path)
                applications = re.fullmatch(r"/api/admin/careers/applications(?:/([a-f0-9]{32}))?", path)
                download = re.fullmatch(r"/api/admin/careers/applications/([a-f0-9]{32})/files/(resume|portfolio)", path)
                if jobs:
                    self.jobs(handler, jobs.group(1))
                elif applications:
                    self.applications(handler, applications.group(1), parse_qs(parsed.query))
                elif download and handler.command == "GET":
                    self.download(handler, download.group(1), download.group(2))
                else:
                    raise APIError(404, "Not found.")
            elif path == "/api/careers/jobs" and handler.command == "GET":
                self.public_jobs(handler)
            elif path == "/api/careers/applications" and handler.command == "POST":
                self.create_application(handler)
            else:
                raise APIError(404, "Not found.")
        except APIError as error:
            handler.close_connection = True
            self.response(handler, error.status, {"ok": False, "error": error.message})
        except (TimeoutError, ConnectionError):
            handler.close_connection = True
        except Exception:
            handler.close_connection = True
            self.response(handler, 500, {"ok": False, "error": "The recruitment service could not complete this request. Please try again."})
        return True

