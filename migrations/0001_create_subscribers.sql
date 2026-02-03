-- Migration: Create subscribers table
-- This table stores email subscriptions for the "Notify Me" feature

CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    source TEXT NOT NULL DEFAULT 'landing_page',
    ip_hash TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    verified_at TEXT,
    unsubscribed_at TEXT
);

-- Index for email lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at);

-- Index for source filtering
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON subscribers(source);
