import { Form } from 'model-one'
import { type CursorI } from '../interfaces/types'
import Joi from 'joi'

const schema = Joi.object({
  id: Joi.string(),
  url: Joi.string(),
  cursor: Joi.string(),
  query: Joi.string(),
})

export class CursorForm extends Form {
  constructor(data: CursorI) {
    super(schema, data)
  }
}