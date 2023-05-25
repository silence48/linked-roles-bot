import { Model, Schema } from 'model-one'
import type { SchemaConfigI } from 'model-one';
import { BalanceI, BalanceDataI } from '../interfaces/'


const balancesSchema: SchemaConfigI = new Schema({
    table_name: 'balances',
    columns: [
    { name: 'id', type: 'string' },
    { name: 'asset_id', type: 'string' },
    { name: 'account_id', type: 'string' },
    { name: 'balance', type: 'string' },
    { name: 'date_acquired', type: 'string' },
    { name: 'verified_ownership', type: 'string' },
    ]
  })
  
  
  export class Balance extends Model implements BalanceI {
    data: BalanceDataI
  
    constructor(props: BalanceDataI) {
      super(balancesSchema, props)
      this.data = props
    }
  }