"""Isolated HTTP integration checks. Never uses the site's live database."""
import importlib.util
import json
import os
from pathlib import Path
import re
import secrets
import shutil
import tempfile
import threading
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
PYTHON_PASSWORD = secrets.token_urlsafe(32)
os.environ.pop("DATABASE_URL", None)
os.environ["AROTEC_ADMIN_PASSWORD"] = PYTHON_PASSWORD
import sys
sys.path.insert(0, str(ROOT))
spec = importlib.util.spec_from_file_location("careers_test_server", ROOT / "server.py")
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)

PDF = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n"


class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        if tag in {"script", "img"} and attributes.get("src"):
            self.urls.append(attributes["src"])
        if tag == "link" and attributes.get("rel") == "stylesheet":
            self.urls.append(attributes["href"])


class RecruitmentHTTP(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_parent = (ROOT / "tmp").resolve()
        cls.temp_parent.mkdir(exist_ok=True)
        cls.data_directory = Path(tempfile.mkdtemp(prefix="careers-http-test-", dir=cls.temp_parent)).resolve()
        if cls.data_directory.parent != cls.temp_parent:
            raise RuntimeError("Unexpected test directory")
        server.DB_PATH = cls.data_directory / "test.sqlite"
        server.init_db()
        execute = server.CAREERS.execute
        def postgres_identifier_guard(connection, sql, parameters=()):
            # SQLite accepts CURRENT_ROLE as a bare column; PostgreSQL treats
            # it as a reserved session expression. Check the SQL actually used
            # by schema creation, submission, and admin reads in this suite.
            if re.search(r'(?<!")\bcurrent_role\b(?!")', sql, re.IGNORECASE):
                raise AssertionError('The SQL column "current_role" must be quoted')
            return execute(connection, sql, parameters)
        guard = patch.object(server.CAREERS, "execute", side_effect=postgres_identifier_guard)
        guard.start()
        cls.addClassCleanup(guard.stop)
        server.CAREERS.initialize()
        server.CAREERS.initialize()
        class QuietHandler(server.ArotecHandler):
            def log_message(self, *args):
                pass
        cls.http = server.ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
        cls.url = "http://127.0.0.1:" + str(cls.http.server_address[1])
        cls.thread = threading.Thread(target=cls.http.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown()
        cls.http.server_close()
        cls.thread.join(timeout=5)
        resolved = cls.data_directory.resolve()
        if resolved.parent != cls.temp_parent or not resolved.name.startswith("careers-http-test-"):
            raise RuntimeError("Refusing unsafe test cleanup")
        shutil.rmtree(resolved)

    def setUp(self):
        server.CAREERS.rate_windows.clear()

    def request(self, path, method="GET", payload=None, auth=False, raw=None, headers=None):
        values = dict(headers or {})
        if auth:
            values["Authorization"] = "Bearer " + PYTHON_PASSWORD
        if payload is not None:
            raw = json.dumps(payload).encode("utf-8")
            values["Content-Type"] = "application/json"
        request = Request(self.url + path, data=raw, headers=values, method=method)
        try:
            response = urlopen(request, timeout=30)
        except HTTPError as error:
            response = error
        with response:
            body = response.read()
            data = json.loads(body) if body and "application/json" in response.headers.get("Content-Type", "") else body
            return response.status, data, response.headers

    def multipart(self, fields, files=None):
        boundary = "RecruitmentBoundary" + secrets.token_hex(8)
        parts = []
        for name, value in fields.items():
            parts.append(("--" + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"\r\n\r\n' + str(value) + "\r\n").encode())
        for name, filename, content in files or [("resume", "test-resume.pdf", PDF), ("portfolio", "test-portfolio.pdf", PDF)]:
            parts.append(("--" + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"; filename="' + filename + '"\r\nContent-Type: application/pdf\r\n\r\n').encode() + content + b"\r\n")
        parts.append(("--" + boundary + "--\r\n").encode())
        return b"".join(parts), {"Content-Type": "multipart/form-data; boundary=" + boundary}

    def application_fields(self, job_id=None):
        fields = {"submission_key": secrets.token_hex(16), "full_name": "Integration Test Applicant",
                  "email": "careers-test@example.invalid", "phone": "+66000000000",
                  "current_location": "Test location", "preferred_locations": '["Bangkok"]',
                  "privacy_consent": "1", "future_consent": "1",
                  "professional_background": "Synthetic test data. Not a real application.",
                  "current_role": "Tester", "profile_url": "https://example.invalid/profile",
                  "company_website": ""}
        fields["job_id" if job_id else "general_application"] = job_id if job_id else "1"
        return fields

    def submit(self, fields, files=None, headers=None):
        body, values = self.multipart(fields, files)
        values.update(headers or {})
        return self.request("/api/careers/applications", "POST", raw=body, headers=values)

    def test_01_page_assets_and_private_static_paths(self):
        from urllib.parse import urljoin, urlparse
        for page in ("/pages/join-us.html", "/pages/careers-admin.html"):
            code, body, _ = self.request(page)
            self.assertEqual(code, 200, page)
            assets = Assets()
            assets.feed(body.decode("utf-8"))
            for href in assets.urls:
                target = urlparse(urljoin(self.url + page, href))
                if target.netloc == urlparse(self.url).netloc:
                    path = target.path + ("?" + target.query if target.query else "")
                    code, _, _ = self.request(path, "HEAD")
                    self.assertEqual(code, 200, path)
        for path in ("/database/members.sqlite", "/database/schema.sql", "/.env.local", "/server.py", "/careers_api.py", "/.git/config"):
            for method in ("GET", "HEAD"):
                code, _, _ = self.request(path, method)
                self.assertEqual(code, 403, method + " " + path)
        self.assertEqual(self.request("/database/")[0], 403)

    def test_02_draft_seeding_and_authentication(self):
        self.assertEqual(self.request("/api/admin/careers/jobs")[0], 401)
        self.assertEqual(self.request("/api/admin/careers/applications")[0], 401)
        self.assertEqual(self.request("/api/admin/careers/applications/" + "a" * 32 + "/files/resume")[0], 401)
        code, result, _ = self.request("/api/admin/careers/jobs", auth=True)
        self.assertEqual(code, 200)
        self.assertEqual(len(result["jobs"]), 3)
        self.assertTrue(all(job["status"] == "draft" for job in result["jobs"]))
        code, result, _ = self.request("/api/careers/jobs")
        self.assertEqual(code, 200)
        self.assertEqual(result["jobs"], [])
        self.assertTrue(result["accepting_applications"])

    def test_03_position_application_and_private_download_lifecycle(self):
        job = {"title": "Integration test position", "department": "Test", "location": "Bangkok",
               "employment_type": "Full-time", "experience": "3+ years", "summary": "Test summary",
               "description": "Test description", "requirements": "Test requirements", "status": "draft"}
        code, result, _ = self.request("/api/admin/careers/jobs", "POST", job, auth=True)
        self.assertEqual(code, 201)
        job_id = result["id"]
        self.assertEqual(self.request("/api/careers/jobs")[1]["jobs"], [])
        saved = next(item for item in self.request("/api/admin/careers/jobs", auth=True)[1]["jobs"] if item["id"] == job_id)
        job.update({"status": "published", "updated_at": saved["updated_at"]})
        self.assertEqual(self.request("/api/admin/careers/jobs/" + job_id, "PUT", job, auth=True)[0], 200)
        self.assertEqual(self.request("/api/careers/jobs")[1]["jobs"][0]["id"], job_id)
        self.assertEqual(self.request("/api/admin/careers/jobs/" + job_id, "PUT", job, auth=True)[0], 409)
        fields = self.application_fields(job_id)
        code, receipt, _ = self.submit(fields)
        self.assertEqual(code, 201, receipt)
        self.assertTrue(receipt["reference"].startswith("APP-"))
        code, repeated, _ = self.submit(fields)
        self.assertEqual(code, 201)
        self.assertEqual(repeated["reference"], receipt["reference"])
        code, listing, _ = self.request("/api/admin/careers/applications?q=careers-test", auth=True)
        self.assertEqual(code, 200)
        self.assertEqual(listing["total"], 1)
        application_id = listing["applications"][0]["id"]
        path = "/api/admin/careers/applications/" + application_id
        self.assertEqual(self.request(path)[0], 401)
        detail = self.request(path, auth=True)[1]["application"]
        self.assertEqual(detail["full_name"], fields["full_name"])
        self.assertEqual(detail["current_role"], fields["current_role"])
        self.assertEqual(detail["preferred_locations"], ["Bangkok"])
        self.assertEqual(len(detail["files"]), 2)
        self.assertEqual(detail["future_consent"], 1)
        for kind in ("resume", "portfolio"):
            code, body, headers = self.request(path + "/files/" + kind, auth=True)
            self.assertEqual(code, 200)
            self.assertEqual(body, PDF)
            self.assertIn("attachment", headers["Content-Disposition"])
            self.assertEqual(headers["X-Content-Type-Options"], "nosniff")
        self.assertEqual(self.request(path, "PUT", {"status": "in_review", "admin_notes": "Test notes", "updated_at": detail["updated_at"]}, auth=True)[0], 200)
        self.assertEqual(self.request(path, auth=True)[1]["application"]["status"], "in_review")
        current = next(item for item in self.request("/api/admin/careers/jobs", auth=True)[1]["jobs"] if item["id"] == job_id)
        current["status"] = "closed"
        self.assertEqual(self.request("/api/admin/careers/jobs/" + job_id, "PUT", current, auth=True)[0], 200)
        self.assertEqual(self.request("/api/careers/jobs")[1]["jobs"], [])
        self.assertEqual(self.submit(self.application_fields(job_id))[0], 409)
        self.assertEqual(self.request(path, "DELETE", auth=True)[0], 200)
        self.assertEqual(self.request(path, auth=True)[0], 404)
        self.assertEqual(self.request(path + "/files/resume", auth=True)[0], 404)
        self.assertEqual(self.request("/api/admin/careers/applications", auth=True)[1]["total"], 0)

    def test_04_upload_validation_and_required_consent(self):
        fields = self.application_fields()
        code, result, _ = self.submit(fields, [("resume", "not-a-pdf.pdf", b"not pdf")])
        self.assertEqual(code, 400, result)
        fields = self.application_fields()
        code, _, _ = self.submit(fields, [("resume", "oversized.pdf", b"%PDF-1.4\n" + b"x" * (10 * 1024 * 1024) + b"\n%%EOF")])
        self.assertEqual(code, 413)
        fields = self.application_fields()
        fields["privacy_consent"] = "0"
        self.assertEqual(self.submit(fields)[0], 400)
        self.assertEqual(self.request("/api/admin/careers/applications", auth=True)[1]["total"], 0)

    def test_05_cross_site_and_missing_admin_configuration(self):
        self.assertEqual(self.submit(self.application_fields(), headers={"Origin": "https://untrusted.invalid"})[0], 403)
        original = server.CAREERS.admin_password
        try:
            server.CAREERS.admin_password = ""
            self.assertFalse(self.request("/api/careers/jobs")[1]["accepting_applications"])
            self.assertEqual(self.submit(self.application_fields())[0], 503)
            self.assertEqual(self.request("/api/admin/careers/jobs", auth=True)[0], 503)
        finally:
            server.CAREERS.admin_password = original


if __name__ == "__main__":
    unittest.main(verbosity=2)
