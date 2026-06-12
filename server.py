from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
import json
import mimetypes
import os
import secrets
import sqlite3
import traceback


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "database" / "members.sqlite"
SCHEMA_PATH = BASE_DIR / "database" / "schema.sql"
DATABASE_URL = os.environ.get("DATABASE_URL")
ADMIN_PASSWORD = os.environ.get("AROTEC_ADMIN_PASSWORD", "").strip()
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
    seed_products()


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
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS products (
                  id BIGSERIAL PRIMARY KEY,
                  sku TEXT NOT NULL UNIQUE,
                  name TEXT NOT NULL,
                  subtitle TEXT,
                  category TEXT NOT NULL DEFAULT 'neuro-cosmetics',
                  product_type TEXT NOT NULL DEFAULT 'bottle',
                  price INTEGER NOT NULL DEFAULT 0,
                  stock_qty INTEGER NOT NULL DEFAULT 0,
                  image_url TEXT,
                  description TEXT,
                  active BOOLEAN NOT NULL DEFAULT TRUE,
                  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_products_active ON products (active)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_products_category ON products (category)")
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS formulas (
                  id BIGSERIAL PRIMARY KEY,
                  formula_code TEXT NOT NULL UNIQUE,
                  formula_name TEXT NOT NULL,
                  skin_state INTEGER NOT NULL DEFAULT 65,
                  skin_axis INTEGER NOT NULL DEFAULT 40,
                  exposome INTEGER NOT NULL DEFAULT 75,
                  package_size TEXT NOT NULL DEFAULT '30 ml',
                  components_json TEXT NOT NULL,
                  total_percent INTEGER NOT NULL DEFAULT 100,
                  customer_name TEXT,
                  customer_email TEXT,
                  customer_phone TEXT,
                  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_formulas_created_at ON formulas (created_at)")
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS orders (
                  id BIGSERIAL PRIMARY KEY,
                  order_code TEXT NOT NULL UNIQUE,
                  formula_id BIGINT REFERENCES formulas(id) ON DELETE SET NULL,
                  customer_name TEXT NOT NULL,
                  customer_email TEXT NOT NULL,
                  customer_phone TEXT,
                  shipping_address TEXT,
                  status TEXT NOT NULL DEFAULT 'new',
                  subtotal INTEGER NOT NULL DEFAULT 0,
                  total INTEGER NOT NULL DEFAULT 0,
                  note TEXT,
                  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at)")
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS order_items (
                  id BIGSERIAL PRIMARY KEY,
                  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
                  sku TEXT NOT NULL,
                  name TEXT NOT NULL,
                  price INTEGER NOT NULL DEFAULT 0,
                  quantity INTEGER NOT NULL DEFAULT 1,
                  line_total INTEGER NOT NULL DEFAULT 0
                )
                """
            )
        connection.commit()
    seed_products()


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


DEFAULT_PRODUCTS = [
    {
        "sku": "NS-MIST-001",
        "name": "Neuro-Scent Mist",
        "subtitle": "สเปรย์กลิ่นบำบัด",
        "category": "mist",
        "product_type": "mist",
        "price": 1290,
        "stock_qty": 60,
        "image_url": "",
        "description": "A fine sensory mist designed for calm focus and daily neural balance.",
    },
    {
        "sku": "NR-SERUM-001",
        "name": "Neural Recovery Body Serum",
        "subtitle": "เซรั่มฟื้นฟูผิวกาย",
        "category": "body-care",
        "product_type": "pump",
        "price": 1690,
        "stock_qty": 42,
        "image_url": "",
        "description": "Body serum for post-stress skin comfort and sensory recovery.",
    },
    {
        "sku": "AH-BALM-001",
        "name": "Adaptive Hand Balm",
        "subtitle": "บาล์มบำรุงมือ",
        "category": "skin-care",
        "product_type": "tube",
        "price": 890,
        "stock_qty": 80,
        "image_url": "",
        "description": "Hand balm for barrier comfort, scent memory and daily care.",
    },
    {
        "sku": "SR-WASH-001",
        "name": "Sensory Recover Wash",
        "subtitle": "เจลอาบน้ำกลิ่นบำบัด",
        "category": "wash",
        "product_type": "pump",
        "price": 990,
        "stock_qty": 75,
        "image_url": "",
        "description": "A sensory wash for recovery rituals and soft aromatic cleansing.",
    },
    {
        "sku": "NS-CLEAN-001",
        "name": "Neural Scalp Cleanser",
        "subtitle": "แชมพูบำรุงหนังศีรษะ",
        "category": "scalp-care",
        "product_type": "dark-pump",
        "price": 1290,
        "stock_qty": 55,
        "image_url": "",
        "description": "Scalp cleanser for neuro-skin freshness and follicle care.",
    },
]


def seed_products() -> None:
    with connect_db() as connection:
        if DATABASE_URL:
            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) AS count FROM products")
                count = cursor.fetchone()["count"]
                if count:
                    return
                for product in DEFAULT_PRODUCTS:
                    cursor.execute(
                        """
                        INSERT INTO products (
                          sku, name, subtitle, category, product_type, price,
                          stock_qty, image_url, description, active
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, TRUE)
                        """,
                        (
                            product["sku"],
                            product["name"],
                            product["subtitle"],
                            product["category"],
                            product["product_type"],
                            product["price"],
                            product["stock_qty"],
                            product["image_url"],
                            product["description"],
                        ),
                    )
            connection.commit()
            return

        count = connection.execute("SELECT COUNT(*) AS count FROM products").fetchone()["count"]
        if count:
            return
        for product in DEFAULT_PRODUCTS:
            connection.execute(
                """
                INSERT INTO products (
                  sku, name, subtitle, category, product_type, price,
                  stock_qty, image_url, description, active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                """,
                (
                    product["sku"],
                    product["name"],
                    product["subtitle"],
                    product["category"],
                    product["product_type"],
                    product["price"],
                    product["stock_qty"],
                    product["image_url"],
                    product["description"],
                ),
            )
        connection.commit()


def json_response(handler: SimpleHTTPRequestHandler, status: int, payload: dict) -> None:
    body = json.dumps(payload, ensure_ascii=False, default=str).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
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


def clean_number(value, default=0, minimum=0, maximum=None):
    try:
        if value is None or value == "":
            number = default
        else:
            number = float(value)
    except (TypeError, ValueError):
        number = default
    if minimum is not None:
        number = max(minimum, number)
    if maximum is not None:
        number = min(maximum, number)
    return number


def clean_int(value, default=0, minimum=0, maximum=None) -> int:
    return int(round(clean_number(value, default, minimum, maximum)))


def make_public_code(prefix: str) -> str:
    return f"{prefix}-{secrets.token_hex(4).upper()}"


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
        if parsed.path == "/api/catalog/products":
            self.list_products(public_only=True)
            return
        if parsed.path == "/api/admin/products":
            if not self.require_admin():
                return
            self.list_products(public_only=False)
            return
        if parsed.path == "/api/admin/orders":
            if not self.require_admin():
                return
            self.list_orders()
            return
        if parsed.path == "/api/admin/formulas":
            if not self.require_admin():
                return
            self.list_formulas()
            return
        if parsed.path in ("/api/members", "/api/admin/members"):
            if not self.require_admin():
                return
            self.list_members()
            return
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/members":
            self.create_member()
            return
        if parsed.path == "/api/formulas":
            self.create_formula()
            return
        if parsed.path == "/api/orders":
            self.create_order()
            return
        if parsed.path == "/api/admin/products":
            if not self.require_admin():
                return
            self.create_product()
            return
        json_response(self, 404, {"ok": False, "error": "Not found"})

    def do_PUT(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/admin/products/"):
            if not self.require_admin():
                return
            self.update_product(parsed.path.rsplit("/", 1)[-1])
            return
        json_response(self, 404, {"ok": False, "error": "Not found"})

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/admin/products/"):
            if not self.require_admin():
                return
            self.delete_product(parsed.path.rsplit("/", 1)[-1])
            return
        json_response(self, 404, {"ok": False, "error": "Not found"})

    def require_admin(self) -> bool:
        if not ADMIN_PASSWORD:
            json_response(
                self,
                503,
                {
                    "ok": False,
                    "error": "Admin password is not configured",
                    "setup": "Set AROTEC_ADMIN_PASSWORD in Render environment variables.",
                },
            )
            return False

        auth_header = self.headers.get("Authorization", "")
        token = ""
        if auth_header.lower().startswith("bearer "):
            token = auth_header[7:].strip()
        if not token:
            token = self.headers.get("X-Admin-Password", "").strip()

        if secrets.compare_digest(token, ADMIN_PASSWORD):
            return True

        json_response(self, 401, {"ok": False, "error": "Unauthorized"})
        return False

    def list_products(self, public_only: bool) -> None:
        where = "WHERE active = TRUE" if DATABASE_URL and public_only else "WHERE active = 1" if public_only else ""
        query = f"""
        SELECT id, sku, name, subtitle, category, product_type, price, stock_qty,
               image_url, description, active, created_at, updated_at
        FROM products
        {where}
        ORDER BY id ASC
        """
        with connect_db() as connection:
            if DATABASE_URL:
                with connection.cursor() as cursor:
                    cursor.execute(query)
                    rows = cursor.fetchall()
            else:
                rows = connection.execute(query).fetchall()
        json_response(self, 200, {"ok": True, "products": rows_to_dicts(rows)})

    def product_payload(self, payload: dict) -> dict:
        active_raw = payload.get("active", True)
        if isinstance(active_raw, str):
            active = active_raw.strip().lower() not in {"false", "0", "no", "off"}
        else:
            active = bool(active_raw)
        return {
            "sku": (clean_text(payload.get("sku"), 80) or "").upper(),
            "name": clean_text(payload.get("name"), 180),
            "subtitle": clean_text(payload.get("subtitle"), 220),
            "category": clean_text(payload.get("category"), 80) or "neuro-cosmetics",
            "product_type": clean_text(payload.get("product_type"), 40) or "bottle",
            "price": clean_int(payload.get("price"), 0, 0, 999999),
            "stock_qty": clean_int(payload.get("stock_qty"), 0, 0, 999999),
            "image_url": clean_text(payload.get("image_url"), 500) or "",
            "description": clean_text(payload.get("description"), 1000) or "",
            "active": active,
        }

    def create_product(self) -> None:
        try:
            payload = read_json(self)
        except json.JSONDecodeError:
            json_response(self, 400, {"ok": False, "error": "Invalid JSON"})
            return
        product = self.product_payload(payload)
        if not product["sku"] or not product["name"]:
            json_response(self, 400, {"ok": False, "error": "SKU and product name are required"})
            return
        try:
            with connect_db() as connection:
                if DATABASE_URL:
                    with connection.cursor() as cursor:
                        cursor.execute(
                            """
                            INSERT INTO products (
                              sku, name, subtitle, category, product_type, price,
                              stock_qty, image_url, description, active
                            )
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                            RETURNING id
                            """,
                            (
                                product["sku"], product["name"], product["subtitle"],
                                product["category"], product["product_type"], product["price"],
                                product["stock_qty"], product["image_url"], product["description"],
                                product["active"],
                            ),
                        )
                        product_id = cursor.fetchone()["id"]
                    connection.commit()
                else:
                    cursor = connection.execute(
                        """
                        INSERT INTO products (
                          sku, name, subtitle, category, product_type, price,
                          stock_qty, image_url, description, active
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            product["sku"], product["name"], product["subtitle"],
                            product["category"], product["product_type"], product["price"],
                            product["stock_qty"], product["image_url"], product["description"],
                            1 if product["active"] else 0,
                        ),
                    )
                    product_id = cursor.lastrowid
                    connection.commit()
        except Exception as error:
            if is_unique_error(error):
                json_response(self, 409, {"ok": False, "error": "This SKU already exists"})
                return
            traceback.print_exc()
            json_response(self, 500, {"ok": False, "error": "Unable to save product"})
            return
        json_response(self, 201, {"ok": True, "product": {"id": product_id, **product}})

    def update_product(self, raw_product_id: str) -> None:
        try:
            product_id = int(raw_product_id)
            payload = read_json(self)
        except (ValueError, json.JSONDecodeError):
            json_response(self, 400, {"ok": False, "error": "Invalid product update"})
            return
        product = self.product_payload(payload)
        if not product["sku"] or not product["name"]:
            json_response(self, 400, {"ok": False, "error": "SKU and product name are required"})
            return
        try:
            with connect_db() as connection:
                if DATABASE_URL:
                    with connection.cursor() as cursor:
                        cursor.execute(
                            """
                            UPDATE products
                            SET sku=%s, name=%s, subtitle=%s, category=%s, product_type=%s,
                                price=%s, stock_qty=%s, image_url=%s, description=%s,
                                active=%s, updated_at=CURRENT_TIMESTAMP
                            WHERE id=%s
                            """,
                            (
                                product["sku"], product["name"], product["subtitle"],
                                product["category"], product["product_type"], product["price"],
                                product["stock_qty"], product["image_url"], product["description"],
                                product["active"], product_id,
                            ),
                        )
                        rowcount = cursor.rowcount
                    connection.commit()
                else:
                    cursor = connection.execute(
                        """
                        UPDATE products
                        SET sku=?, name=?, subtitle=?, category=?, product_type=?,
                            price=?, stock_qty=?, image_url=?, description=?, active=?
                        WHERE id=?
                        """,
                        (
                            product["sku"], product["name"], product["subtitle"],
                            product["category"], product["product_type"], product["price"],
                            product["stock_qty"], product["image_url"], product["description"],
                            1 if product["active"] else 0, product_id,
                        ),
                    )
                    rowcount = cursor.rowcount
                    connection.commit()
        except Exception as error:
            if is_unique_error(error):
                json_response(self, 409, {"ok": False, "error": "This SKU already exists"})
                return
            traceback.print_exc()
            json_response(self, 500, {"ok": False, "error": "Unable to update product"})
            return
        if not rowcount:
            json_response(self, 404, {"ok": False, "error": "Product not found"})
            return
        json_response(self, 200, {"ok": True, "product": {"id": product_id, **product}})

    def delete_product(self, raw_product_id: str) -> None:
        try:
            product_id = int(raw_product_id)
        except ValueError:
            json_response(self, 400, {"ok": False, "error": "Invalid product id"})
            return
        with connect_db() as connection:
            if DATABASE_URL:
                with connection.cursor() as cursor:
                    cursor.execute("UPDATE products SET active=FALSE, updated_at=CURRENT_TIMESTAMP WHERE id=%s", (product_id,))
                    rowcount = cursor.rowcount
                connection.commit()
            else:
                cursor = connection.execute("UPDATE products SET active=0 WHERE id=?", (product_id,))
                rowcount = cursor.rowcount
                connection.commit()
        if not rowcount:
            json_response(self, 404, {"ok": False, "error": "Product not found"})
            return
        json_response(self, 200, {"ok": True})

    def formula_payload(self, payload: dict) -> dict:
        components = payload.get("components") if isinstance(payload.get("components"), list) else []
        return {
            "formula_name": clean_text(payload.get("formula_name"), 180) or "My Daily Neuro Balance",
            "skin_state": clean_int(payload.get("skin_state"), 65, 0, 100),
            "skin_axis": clean_int(payload.get("skin_axis"), 40, 0, 100),
            "exposome": clean_int(payload.get("exposome"), 75, 0, 100),
            "package_size": clean_text(payload.get("package_size"), 40) or "30 ml",
            "components_json": json.dumps(components, ensure_ascii=False),
            "total_percent": clean_int(payload.get("total_percent"), 100, 0, 100),
            "customer_name": clean_text(payload.get("customer_name"), 180),
            "customer_email": clean_text(payload.get("customer_email"), 180),
            "customer_phone": clean_text(payload.get("customer_phone"), 80),
        }

    def insert_formula(self, connection, payload: dict) -> tuple[int, str]:
        formula = self.formula_payload(payload)
        formula_code = make_public_code("FM")
        values = (
            formula_code,
            formula["formula_name"],
            formula["skin_state"],
            formula["skin_axis"],
            formula["exposome"],
            formula["package_size"],
            formula["components_json"],
            formula["total_percent"],
            formula["customer_name"],
            formula["customer_email"],
            formula["customer_phone"],
        )
        if DATABASE_URL:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO formulas (
                      formula_code, formula_name, skin_state, skin_axis, exposome,
                      package_size, components_json, total_percent,
                      customer_name, customer_email, customer_phone
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    values,
                )
                return cursor.fetchone()["id"], formula_code
        cursor = connection.execute(
            """
            INSERT INTO formulas (
              formula_code, formula_name, skin_state, skin_axis, exposome,
              package_size, components_json, total_percent,
              customer_name, customer_email, customer_phone
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            values,
        )
        return cursor.lastrowid, formula_code

    def create_formula(self) -> None:
        try:
            payload = read_json(self)
        except json.JSONDecodeError:
            json_response(self, 400, {"ok": False, "error": "Invalid JSON"})
            return
        with connect_db() as connection:
            formula_id, formula_code = self.insert_formula(connection, payload)
            connection.commit()
        json_response(self, 201, {"ok": True, "formula": {"id": formula_id, "formula_code": formula_code}})

    def list_formulas(self) -> None:
        query = """
        SELECT id, formula_code, formula_name, skin_state, skin_axis, exposome,
               package_size, components_json, total_percent, customer_name,
               customer_email, customer_phone, created_at
        FROM formulas
        ORDER BY created_at DESC
        LIMIT 200
        """
        with connect_db() as connection:
            if DATABASE_URL:
                with connection.cursor() as cursor:
                    cursor.execute(query)
                    rows = cursor.fetchall()
            else:
                rows = connection.execute(query).fetchall()
        json_response(self, 200, {"ok": True, "formulas": rows_to_dicts(rows)})

    def create_order(self) -> None:
        try:
            payload = read_json(self)
        except json.JSONDecodeError:
            json_response(self, 400, {"ok": False, "error": "Invalid JSON"})
            return

        customer = payload.get("customer") if isinstance(payload.get("customer"), dict) else {}
        items = payload.get("items") if isinstance(payload.get("items"), list) else []
        customer_name = clean_text(customer.get("name"), 180)
        customer_email = clean_text(customer.get("email"), 180)
        customer_phone = clean_text(customer.get("phone"), 80)
        shipping_address = clean_text(customer.get("address"), 1000)
        note = clean_text(payload.get("note"), 1000)
        if not customer_name or not customer_email or "@" not in customer_email:
            json_response(self, 400, {"ok": False, "error": "Customer name and valid email are required"})
            return
        if not items:
            json_response(self, 400, {"ok": False, "error": "Cart is empty"})
            return

        order_code = make_public_code("OR")
        try:
            with connect_db() as connection:
                formula_id = None
                formula_code = None
                if isinstance(payload.get("formula"), dict):
                    formula_payload = {**payload["formula"], "customer_name": customer_name, "customer_email": customer_email, "customer_phone": customer_phone}
                    formula_id, formula_code = self.insert_formula(connection, formula_payload)

                order_items = []
                subtotal = 0
                for item in items:
                    product_id = clean_int(item.get("product_id"), 0, 1)
                    quantity = clean_int(item.get("quantity"), 1, 1, 99)
                    if DATABASE_URL:
                        with connection.cursor() as cursor:
                            cursor.execute(
                                "SELECT id, sku, name, price, stock_qty FROM products WHERE id=%s AND active=TRUE",
                                (product_id,),
                            )
                            product = cursor.fetchone()
                    else:
                        product = connection.execute(
                            "SELECT id, sku, name, price, stock_qty FROM products WHERE id=? AND active=1",
                            (product_id,),
                        ).fetchone()
                    if not product:
                        raise ValueError("Product not found")
                    if int(product["stock_qty"]) < quantity:
                        raise ValueError(f"{product['name']} is out of stock")
                    line_total = int(product["price"]) * quantity
                    subtotal += line_total
                    order_items.append((product, quantity, line_total))

                total = subtotal
                if DATABASE_URL:
                    with connection.cursor() as cursor:
                        cursor.execute(
                            """
                            INSERT INTO orders (
                              order_code, formula_id, customer_name, customer_email,
                              customer_phone, shipping_address, subtotal, total, note
                            )
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                            RETURNING id
                            """,
                            (order_code, formula_id, customer_name, customer_email.lower(), customer_phone, shipping_address, subtotal, total, note),
                        )
                        order_id = cursor.fetchone()["id"]
                        for product, quantity, line_total in order_items:
                            cursor.execute(
                                """
                                INSERT INTO order_items (order_id, product_id, sku, name, price, quantity, line_total)
                                VALUES (%s, %s, %s, %s, %s, %s, %s)
                                """,
                                (order_id, product["id"], product["sku"], product["name"], product["price"], quantity, line_total),
                            )
                            cursor.execute("UPDATE products SET stock_qty=stock_qty-%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s", (quantity, product["id"]))
                    connection.commit()
                else:
                    cursor = connection.execute(
                        """
                        INSERT INTO orders (
                          order_code, formula_id, customer_name, customer_email,
                          customer_phone, shipping_address, subtotal, total, note
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                        (order_code, formula_id, customer_name, customer_email.lower(), customer_phone, shipping_address, subtotal, total, note),
                    )
                    order_id = cursor.lastrowid
                    for product, quantity, line_total in order_items:
                        connection.execute(
                            """
                            INSERT INTO order_items (order_id, product_id, sku, name, price, quantity, line_total)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                            """,
                            (order_id, product["id"], product["sku"], product["name"], product["price"], quantity, line_total),
                        )
                        connection.execute("UPDATE products SET stock_qty=stock_qty-? WHERE id=?", (quantity, product["id"]))
                    connection.commit()
        except ValueError as error:
            json_response(self, 400, {"ok": False, "error": str(error)})
            return
        except Exception:
            traceback.print_exc()
            json_response(self, 500, {"ok": False, "error": "Unable to create order"})
            return

        json_response(
            self,
            201,
            {
                "ok": True,
                "order": {
                    "id": order_id,
                    "order_code": order_code,
                    "formula_code": formula_code,
                    "subtotal": subtotal,
                    "total": total,
                },
            },
        )

    def list_orders(self) -> None:
        order_query = """
        SELECT id, order_code, formula_id, customer_name, customer_email, customer_phone,
               shipping_address, status, subtotal, total, note, created_at, updated_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 200
        """
        item_query = """
        SELECT order_id, product_id, sku, name, price, quantity, line_total
        FROM order_items
        WHERE order_id = {placeholder}
        ORDER BY id ASC
        """.format(placeholder=db_param())
        with connect_db() as connection:
            if DATABASE_URL:
                with connection.cursor() as cursor:
                    cursor.execute(order_query)
                    orders = rows_to_dicts(cursor.fetchall())
                    for order in orders:
                        cursor.execute(item_query, (order["id"],))
                        order["items"] = rows_to_dicts(cursor.fetchall())
            else:
                orders = rows_to_dicts(connection.execute(order_query).fetchall())
                for order in orders:
                    order["items"] = rows_to_dicts(connection.execute(item_query, (order["id"],)).fetchall())
        json_response(self, 200, {"ok": True, "orders": orders})

    def list_members(self) -> None:
        with connect_db() as connection:
            query = """
            SELECT id, member_code, full_name, email, phone, preferred_language,
                   company, job_title, wellness_goal, marketing_consent,
                   privacy_consent, status, created_at, updated_at
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
        marketing_consent = bool(payload.get("marketing_consent"))
        privacy_consent = bool(payload.get("privacy_consent", True))

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
            if is_unique_error(error):
                json_response(self, 409, {"ok": False, "error": "This email is already registered"})
                return
            traceback.print_exc()
            json_response(self, 500, {"ok": False, "error": "Unable to save data"})
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
