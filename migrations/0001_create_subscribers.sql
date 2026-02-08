-- Create subscribers table for the Notify Me feature
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  source TEXT DEFAULT 'landing_page',
  ip_hash TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  verified_at TEXT,
  unsubscribed_at TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers (created_at);
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON subscribers (source);
