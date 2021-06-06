import Invite from '../models/invite'
import Subscription from '../models/subscription'
import { validate as uuidValidate, version as uuidVersion } from 'uuid'
import { error } from '../services/response'
import logger from '../../core/logger'

export const index = async ({ user }, res, next) => {
  await Subscription.find({ createdBy: user._id }).sort({ expiry: -1 })
    .then(subscriptions => {
      res.locals.subscriptions = subscriptions || []
      ;['_id', 'activationKeyId', 'createdBy', 'updatedAt', '__v'].forEach(each => delete res.locals.subscriptions[each])
    })

  next()
}

export const create = ({ bodymen: { body }, user }, res) => {
  if (!uuidValidate(body.activationKey) || uuidVersion(body.activationKey) !== 5) { error(res, 'Invalid Activation Key', 422); return }

  Invite.findOne({ code: body.activationKey }).then(key => {
    if (!key) { error(res, 'Activation Key is invalid', 422); return }
    if (key.used) { error(res, 'Activation Key has already been used!', 422); return }

    Subscription.create({
      activationKeyId: key._id,
      role: key.role,
      expiry: Date.now() + (1000 * 60 * 60 * 24 * Number(key.length)),
      createdBy: user._id
    }).then(subscription => {
      logger.info(`Subscription created by ${body.username} with id: ${subscription._id}`)
      res.status(201).json({ status: 'ok', message: 'Subscription has been added successfully created' })
    }).then(() => {
      key.used = true
      return key.save().then(() => logger.info(`ActivationKey used by ${body.username} with id: ${key._id}`))
    }).catch(err => {
      if (err.name === 'MongoError' && err.code === 11000) error(res, 'Oops! Subscription already exists', 409)
      else error(res, 500)
    })
  })
}
