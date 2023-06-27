import type { SchemaConfigI } from 'model-one';
import { Schema } from 'model-one'

export const accountSchema: SchemaConfigI = new Schema({
    table_name: 'accounts',
    columns: [
      { name: 'id', type: 'string'},
      { name: 'accepted_tos', type: 'boolean'}
    ],
  })