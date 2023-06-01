import { Model, Schema } from './model-one'
import type { SchemaConfigI } from './model-one';
import { ClaimableI, ClaimableDataI } from '../interfaces/'


const claimableSchema: SchemaConfigI = new Schema({
    table_name: 'claimable',
    columns: [
    { name: 'id', type: 'string' },
    { name: 'claimable_id', type: 'string' },
    { name: 'date_granted', type: 'string' },
    { name: 'date_claimed', type: 'string' },
    ]
  })
  
  
  export class Claimable extends Model implements ClaimableI {
    data: ClaimableDataI
  
    constructor(props: ClaimableDataI) {
      super(claimableSchema, props)
      this.data = props
    }
  }