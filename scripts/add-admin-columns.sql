-- Add role and must_change_password columns to users table
-- Run against Railway Postgres

ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Promote the first admin (update email as needed)
-- UPDATE users SET role = 'admin' WHERE email = 'alex@chargesmartev.com';
