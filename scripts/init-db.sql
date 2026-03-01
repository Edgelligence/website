-- Initialize subscribers table for Edgelligence newsletter
-- This script should be run once when setting up the database

CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'landing_page',
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP
);

-- Create index on email for faster lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_subscribers_email_lower ON subscribers (LOWER(email));

-- Create index on created_at for analytics queries
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers (created_at DESC);

-- Create index on source for filtering by source
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON subscribers (source);
