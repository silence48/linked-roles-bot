import { Form } from 'model-one'
import { UserI } from '../interfaces'
import Joi from 'joi'

const schema = Joi.object({
  id: Joi.string(),
  discord_user_id: Joi.string(),
  access_token: Joi.string(),
  refresh_token: Joi.string(),
  expires_at: Joi.string(),
})

export class UserForm extends Form {
  constructor(data: UserI) {
    super(schema, data)
  }
}