import { validate as uuidValidate, version as uuidVersion } from 'uuid'
import User from '../models/user'
import Invite from '../models/invite'
import Subscription from '../models/subscription'
import { success, error, notFound } from '../services/response'
import logger from '../../core/logger'

export const create = ({ bodymen: { body } }, res) => {
  if (!body.activationKey) { error(res, 'InviteCode Required', 401); return }
  if (!uuidValidate(body.activationKey) || uuidVersion(body.activationKey) !== 5) { error(res, 'Invalid InviteCode', 422); return }

  Invite.findOne({ code: body.activationKey }).then(key => {
    if (!key) { error(res, 'Code is invalid', 422); return }
    if (key.used) { error(res, 'Code has already been used!', 422); return }

    User.create({ username: body.username, password: body.password })
      .then(user => {
        logger.info(`User created with uid: ${user._id}`)
        return {
          status: 'ok',
          message: 'User successfully registered'
        }
      })
      .then(success(res, 201))
      .then(() => {
        key.used = true
        return key.save().then(() => logger.info(`ActivationKey used by ${body.username} with id: ${key._id}`))
      })
      .then(() => {
        return Subscription.create({
          activationKeyId: key._id,
          role: key.role,
          expiry: Date.now() + (1000 * 60 * 60 * 24 * Number(key.length)),
          createdBy: body.username
        }).then(subscription => logger.info(`Subscription created by ${body.username} with id: ${subscription._id}`))
      })
      .catch(err => {
        if (err.name === 'MongoError' && err.code === 11000) error(res, 'username already registered', 409)
        else error(res, 500)
      })
  })
}

export const updatePassword = ({ bodymen: { body }, user, logout }, res, next) => {
  User.findById(user._id)
    .then(notFound(res))
    .then(user => user ? (user.set({ password: body.password }).save() && logout()) : null)
    .then(user => user ? res.json({ message: 'Your password has been updated successfully' }) : res.status(500))
    .catch(next)
}
