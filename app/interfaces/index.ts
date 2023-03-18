import type { Model } from 'model-one'

export interface UserDataI {
  id?: string
  discord_user_id?: string
  access_token?: string
  refresh_token?: string
  expires_at?: string
}

export interface UserI extends Model {
  data: UserDataI
}