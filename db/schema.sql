DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id text PRIMARY KEY,
  discord_user_id text,
  discord_access_token text,
  discord_refresh_token text,
  discord_expires_at text,
  deleted_at datetime,
  created_at datetime,
  updated_at datetime
);

DROP TABLE IF EXISTS stellar_accounts;

CREATE TABLE stellar_accounts (
  id text PRIMARY KEY,
  discord_user_id text,
  public_key text,
  access_token text,
  refresh_token text,
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
);

DROP TABLE IF EXISTS balances;

CREATE TABLE balances (  
  id text PRIMARY KEY,
  tx_id text,
  issuer_id text,
  asset_id text,
  account_id text,
  balance text,
  date_acquired text,
  verified_ownership text,
  deleted_at datetime,
  created_at datetime,
  updated_at datetime
);

DROP TABLE IF EXISTS cursor;

CREATE TABLE cursor(
  id text PRIMARY KEY,
  url text,
  cursor text,
  query text,
  deleted_at datetime,
  created_at datetime,
  updated_at datetime
);

DROP TABLE IF EXISTS asset;

CREATE TABLE asset(
  id text PRIMARY KEY,
  issuer_id text,
  code text,
  query text,
  deleted_at datetime,
  created_at datetime,
  updated_at datetime
);

DROP TABLE IF EXISTS claimable;

CREATE TABLE claimable(
  id text PRIMARY KEY,
  claimable_id text,
  date_granted text,
  date_claimed text,
  deleted_at datetime,
  created_at datetime,
  updated_at datetime
);
