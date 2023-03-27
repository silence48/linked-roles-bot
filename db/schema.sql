DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id text PRIMARY KEY,
  discord_user_id text,
  discord_access_token text,
  discord_refresh_token text,
  stellar_access_token text,
  stellar_refresh_token text,
  public_key text,
  discord_expires_at text,
  stellar_expires_at text,
  deleted_at datetime,
  created_at datetime,
  updated_at datetime
);

DROP TABLE IF EXISTS metadata;

CREATE TABLE metadata (
  key text PRIMARY KEY,
  name text,
  description text,
  type number
)