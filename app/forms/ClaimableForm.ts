import { Form } from '../models/model-one'
import { ClaimableI } from '../interfaces'
import Joi from 'joi'

const schema = Joi.object({
  id: Joi.string(),
  claimable_id: Joi.string(),
  date_granted: Joi.string(),
  claimed_date: Joi.string(),
})

export class ClaimableForm extends Form {
  constructor(data: ClaimableI) {
    super(schema, data)
  }
}