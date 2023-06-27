import { Model, Schema } from './model-one'
import type { SchemaConfigI } from './model-one';
import { CursorI, CursorDataI } from '../interfaces/'


const cursorSchema: SchemaConfigI = new Schema({
    table_name: 'cursor',
    columns: [
    { name: 'id', type: 'string' },
    { name: 'url', type: 'string' },
    { name: 'cursor', type: 'string' },
    { name: 'query', type: 'string' },
    ]
  })
  
  export class Cursor extends Model implements CursorI {
    data: CursorDataI
  
    constructor(props: CursorDataI) {
      super(cursorSchema, props)
      this.data = props
    }
  }