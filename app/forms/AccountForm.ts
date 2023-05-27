import { Form } from '../models/model-one'
import { StellarAccountsI } from '../interfaces'
import Joi from 'joi'

const schema = Joi.object({
  id: Joi.string(),
  discord_user_id: Joi.string(),
  public_key: Joi.string(),
  access_token: Joi.string(),
  refresh_token: Joi.string(),
})

export class AccountForm extends Form {
  constructor(data: StellarAccountsI) {
    super(schema, data)
  }
}