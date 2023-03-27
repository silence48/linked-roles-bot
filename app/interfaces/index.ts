import type { Model } from 'model-one'

export interface UserDataI {
  id?: string
  discord_user_id?: string
  discord_access_token?: string
  discord_refresh_token?: string
  stellar_access_token?: string
  stellar_refresh_token?: string
  discord_expires_at?: string
  stellar_expires_at?: string
  public_key?: string
}

export interface UserI extends Model {
  data: UserDataI
}