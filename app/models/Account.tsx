import { Model, Schema } from 'model-one'
import type { SchemaConfigI } from 'model-one';
import { StellarAccountsI, StellarAccountsDataI } from '../interfaces/'


const stellar_accountsSchema: SchemaConfigI = new Schema({
    table_name: 'stellar_accounts',
    columns: [
    { name: 'id', type: 'string' },
    { name: 'discord_user_id', type: 'string' },
    { name: 'public_key', type: 'string' },
    { name: 'access_token', type: 'string' },
    { name: 'refresh_token', type: 'string' },
    ]
  })
  
  
  export class StellarAccount extends Model implements StellarAccountsI {
    data: StellarAccountsDataI
  
    constructor(props: StellarAccountsDataI) {
      super(stellar_accountsSchema, props)
      this.data = props
    }
  }