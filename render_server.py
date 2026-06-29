import threading
import traceback

import server as app


db_status = {
    "ready": False,
    "error": None,
}


def initialize_database() -> None:
    try:
        app.init_db()
        db_status["ready"] = True
        db_status["error"] = None
        print("Database initialized successfully.")
    except Exception as error:  # Keep the website online even if the database is unavailable.
        db_status["ready"] = False
        db_status["error"] = f"{type(error).__name__}: {error}"
        traceback.print_exc()
        print("Database initialization failed. Static website will continue serving.")


class RenderHandler(app.ArotecHandler):
    def do_GET(self) -> None:
        parsed = app.urlparse(self.path)
        if parsed.path in ("/healthz", "/api/health"):
            app.json_response(
                self,
                200,
                {
                    "ok": True,
                    "database": app.db_backend(),
                    "database_ready": db_status["ready"],
                    "database_error": db_status["error"],
                },
            )
            return
        super().do_GET()

    def list_products(self, public_only: bool) -> None:
        try:
            super().list_products(public_only)
        except Exception as error:
            traceback.print_exc()
            app.json_response(
                self,
                503,
                {
                    "ok": False,
                    "error": "Product catalog is temporarily unavailable",
                    "detail": f"{type(error).__name__}: {error}",
                },
            )


def main() -> None:
    app.mimetypes.add_type("application/javascript; charset=utf-8", ".js")
    app.mimetypes.add_type("text/css; charset=utf-8", ".css")

    threading.Thread(target=initialize_database, daemon=True).start()

    http_server = app.ThreadingHTTPServer((app.HOST, app.PORT), RenderHandler)
    print(f"Arotec web server running at http://{app.HOST}:{app.PORT}/")
    print(f"Health check: http://{app.HOST}:{app.PORT}/healthz")
    print(f"Database target: {app.db_backend()}")
    http_server.serve_forever()


if __name__ == "__main__":
    main()
