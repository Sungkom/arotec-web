PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'th' CHECK (preferred_language IN ('th', 'zh-Hant', 'ja', 'en')),
  company TEXT,
  job_title TEXT,
  country TEXT,
  birth_date TEXT,
  gender TEXT CHECK (gender IS NULL OR gender IN ('female', 'male', 'non_binary', 'prefer_not_to_say')),
  wellness_goal TEXT,
  marketing_consent INTEGER NOT NULL DEFAULT 0 CHECK (marketing_consent IN (0, 1)),
  privacy_consent INTEGER NOT NULL DEFAULT 1 CHECK (privacy_consent IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON members(created_at);

CREATE TABLE IF NOT EXISTS member_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  event_data TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_member_events_member_id ON member_events(member_id);

CREATE TRIGGER IF NOT EXISTS trg_members_updated_at
AFTER UPDATE ON members
FOR EACH ROW
BEGIN
  UPDATE members SET updated_at = datetime('now') WHERE id = OLD.id;
END;
