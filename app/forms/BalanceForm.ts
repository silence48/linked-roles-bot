import { Form } from 'model-one'
import { BalanceI } from '../interfaces'
import Joi from 'joi'

const schema = Joi.object({
  id: Joi.string(),
  asset_id: Joi.string(),
  account_id: Joi.string(),
  balance: Joi.string(),
  date_acquired: Joi.string(),
  verified_ownership: Joi.string(),
})

export class BalanceForm extends Form {
  constructor(data: BalanceI) {
    super(schema, data)
  }
}