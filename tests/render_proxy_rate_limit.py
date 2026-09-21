"""Render public-proxy regression checks; no database or network is used."""
import os
from pathlib import Path
import sys
from types import SimpleNamespace
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from careers_api import APIError, CareersAPI
from contact_api import ContactAPI


class RenderProxyRateLimit(unittest.TestCase):
    def api(self, cls=CareersAPI, **overrides):
        environment = {
            "AROTEC_TRUST_RENDER_PROXY": "true",
            "RENDER": "true",
            "RENDER_SERVICE_TYPE": "web",
            **overrides,
        }
        with patch.dict(os.environ, environment):
            return cls(self.no_database, False, "synthetic-test-password")

    @staticmethod
    def no_database():
        raise AssertionError("These tests must not access a database")

    @staticmethod
    def handler(ip=None):
        headers = {} if ip is None else {"CF-Connecting-IP": ip}
        return SimpleNamespace(client_address=("10.0.0.5", 12345), headers=headers)

    def assert_status(self, status, operation):
        with self.assertRaises(APIError) as raised:
            operation()
        self.assertEqual(raised.exception.status, status)

    def test_opt_in_and_render_public_web_markers_required(self):
        for override in (
            {"AROTEC_TRUST_RENDER_PROXY": ""},
            {"AROTEC_TRUST_RENDER_PROXY": "false"},
            {"RENDER": ""},
            {"RENDER": "false"},
            {"RENDER_SERVICE_TYPE": ""},
            {"RENDER_SERVICE_TYPE": "pserv"},
        ):
            with self.subTest(override=override):
                api = self.api(**override)
                first = self.handler("198.51.100.10")
                second = self.handler("198.51.100.11")
                api.rate_limit(first, "test", 1, 60)
                self.assert_status(429, lambda: api.rate_limit(second, "test", 1, 60))

    def test_distinct_public_visitors_have_separate_submission_limits(self):
        for cls in (CareersAPI, ContactAPI):
            with self.subTest(api=cls.__name__):
                api = self.api(cls)
                first = self.handler("198.51.100.10")
                second = self.handler("198.51.100.11")
                for _ in range(8):
                    api.rate_limit(first, "submit", 8, 3600)
                self.assert_status(429, lambda: api.rate_limit(first, "submit", 8, 3600))
                api.rate_limit(second, "submit", 8, 3600)

    def test_invalid_or_missing_headers_share_socket_fallback(self):
        for value in (None, "", "unknown", "198.51.100.10, 198.51.100.11", "198.51.100.10:443", "[2001:db8::1]", "fe80::1%eth0"):
            with self.subTest(header=value):
                api = self.api()
                api.rate_limit(self.handler(), "test", 1, 60)
                self.assert_status(429, lambda: api.rate_limit(self.handler(value), "test", 1, 60))

    def test_ipv6_spellings_cannot_get_extra_rate_buckets(self):
        api = self.api()
        api.rate_limit(self.handler("2001:0db8:0000:0000:0000:0000:0000:0001"), "test", 1, 60)
        self.assert_status(429, lambda: api.rate_limit(self.handler("2001:db8::1"), "test", 1, 60))

    def test_failed_login_does_not_throttle_other_visitor(self):
        for cls in (CareersAPI, ContactAPI):
            with self.subTest(api=cls.__name__):
                api = self.api(cls)
                first = self.handler("198.51.100.10")
                for _ in range(10):
                    self.assert_status(401, lambda: api.require_admin(first))
                self.assert_status(429, lambda: api.require_admin(first))
                self.assert_status(401, lambda: api.require_admin(self.handler("198.51.100.11")))

    def test_https_public_origin_survives_internal_http_proxy_hop(self):
        api = self.api()
        handler = self.handler("198.51.100.10")
        handler.headers.update({"Host": "arotec-example.onrender.com", "Origin": "https://arotec-example.onrender.com", "X-Forwarded-Proto": "https", "Sec-Fetch-Site": "same-origin"})
        api.check_origin(handler)
        handler.headers["Origin"] = "https://untrusted.invalid"
        self.assert_status(403, lambda: api.check_origin(handler))


if __name__ == "__main__":
    unittest.main(verbosity=2)
