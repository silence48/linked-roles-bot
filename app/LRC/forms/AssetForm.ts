import { Form } from 'model-one'
import { type AssetI } from '../interfaces/types'
import Joi from 'joi'

const schema = Joi.object({
  id: Joi.string(),
  issuer_id: Joi.string(),
  code: Joi.string(),
  query: Joi.string(),
})

export class AssetForm extends Form {
  constructor(data: AssetI) {
    super(schema, data)
  }
}