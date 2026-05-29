from pathlib import Path
import sqlite3


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "members.sqlite"
SCHEMA_PATH = BASE_DIR / "schema.sql"


def init_db() -> Path:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    schema = SCHEMA_PATH.read_text(encoding="utf-8")
    with sqlite3.connect(DB_PATH) as connection:
        connection.executescript(schema)
        connection.commit()
    return DB_PATH


if __name__ == "__main__":
    path = init_db()
    print(f"Member database ready: {path.name}")
