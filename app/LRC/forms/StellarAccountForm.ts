import { Form } from 'model-one'
import { type StellarAccountsI } from '../interfaces/types'
import Joi from 'joi'

const schema = Joi.object({
  id: Joi.string(),
  discord_user_id: Joi.string(),
  public_key: Joi.string(),
  access_token: Joi.string(),
  refresh_token: Joi.string(),
})

export class StellarAccountForm extends Form {
  constructor(data: StellarAccountsI) {
    super(schema, data)
  }
}