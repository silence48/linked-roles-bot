import { Model, Schema } from 'model-one'
import type { SchemaConfigI } from 'model-one';
import type { UserI, UserDataI } from '../interfaces/types'

const userSchema: SchemaConfigI = new Schema({
  table_name: 'users',
  columns: [
    { name: 'id', type: 'string' },
    { name: 'discord_user_id', type: 'string' },
    { name: 'discord_access_token', type: 'string' },
    { name: 'discord_refresh_token', type: 'string' },
    { name: 'discord_expires_at', type: 'string' },
  ],
})

export class User extends Model implements UserI {
  data: UserDataI

  constructor(props: UserDataI) {
    super(userSchema, props)
    this.data = props
  }
}
