import { Form } from 'model-one'
import { type ClaimableI } from '../interfaces/types'
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