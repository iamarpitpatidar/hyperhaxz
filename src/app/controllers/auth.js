import { validate as uuidValidate, version as uuidVersion } from 'uuid'
import Invite from '../models/invite'
import User from '../models/user'
import { success, error } from '../services/response'

export const create = ({ bodymen: { body } }, res, next) => {
  if (!body.activationKey) { error(res, 'InviteCode Required', 401); return }
  if (!uuidValidate(body.activationKey) || uuidVersion(body.activationKey) !== 5) { error(res, 'Invalid InviteCode', 422); return }

  Invite.findOne({ code: body.activationKey }).then(code => {
    if (!code) { error(res, 'Code is invalid', 422); return }
    if (code.used) { error(res, 'Code has already been used!', 422); return }

    User.create({ username: body.username, password: body.password })
      .then(() => {
        return {
          status: 'ok',
          message: 'User successfully registered'
        }
      })
      .then(success(res, 201))
      .then(() => {
        code.used = true
        code.save()
      })
      .catch(err => {
        if (err.name === 'MongoError' && err.code === 11000) error(res, 'username already registered', 409)
        else error(res, 500)
      })
  })
}
