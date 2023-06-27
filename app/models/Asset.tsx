import { Model, Schema } from './model-one'
import type { SchemaConfigI } from './model-one';
import { AssetI, AssetDataI } from '../interfaces/'


const assetSchema: SchemaConfigI = new Schema({
    table_name: 'assets',
    columns: [
    { name: 'id', type: 'string' },
    { name: 'issuer_id', type: 'string' },
    { name: 'code', type: 'string' },
    { name: 'query', type: 'string' },
    ]
  })
  
  
  export class Asset extends Model implements AssetI {
    data: AssetDataI
  
    constructor(props: AssetI) {
      super(assetSchema, props)
      this.data = props
    }
  }