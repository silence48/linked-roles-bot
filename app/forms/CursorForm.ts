import { Form } from '../models/model-one'
import { CursorI } from '../interfaces'
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