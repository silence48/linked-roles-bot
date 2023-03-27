import { Model, Schema } from 'model-one'
import type { SchemaConfigI } from 'model-one';
import { UserI, UserDataI } from '../interfaces/'

const userSchema: SchemaConfigI = new Schema({
  table_name: 'users',
  columns: [
    { name: 'id', type: 'string' },
    { name: 'discord_user_id', type: 'string' },
    { name: 'discord_access_token', type: 'string' },
    { name: 'discord_refresh_token', type: 'string' },
    { name: 'stellar_access_token', type: 'string' },
    { name: 'stellar_refresh_token', type: 'string' },
    { name: 'discord_expires_at', type: 'string' },
    { name: 'stellar_expires_at', type: 'string' },
    { name: 'public_key', type: 'string'}
  ],
})

export class User extends Model implements UserI {
  data: UserDataI

  constructor(props: UserDataI) {
    super(userSchema, props)
    this.data = props
  }
}