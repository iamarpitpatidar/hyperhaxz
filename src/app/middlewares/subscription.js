import { validate as uuidValidate, version as uuidVersion } from 'uuid'
import { error } from '../services/response'

export const validate = ({ bodymen: { body } }, res, next) => {
  if (uuidValidate(body.activationKey) && uuidVersion(body.activationKey) === 5) next()
  else error(res, 'Invalid Activation Key', 422)
}
