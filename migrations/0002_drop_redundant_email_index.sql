-- Drop redundant index: the UNIQUE constraint on the email column
-- already creates an implicit unique index in SQLite/D1.
DROP INDEX IF EXISTS idx_subscribers_email;
