import Invite from '../models/invite'
import Subscription from '../models/subscription'
import { error } from '../services/response'
import logger from '../../core/logger'

export const index = async ({ user }, res, next) => {
  await Subscription.find({ createdBy: user._id, expiry: { $gt: Date.now() } }).sort({ expiry: 1 })
    .then((subscriptions = []) => subscriptions.map(each => each.view()))
    .then(subscriptions => {
      res.locals.subscriptions = subscriptions
    })

  next()
}

export const create = ({ bodymen: { body }, user }, res, next) => {
  Invite.findOne({ code: body.activationKey.toLowerCase() })
    .then(async key => {
      if (!key) return error(res, 'Activation Key is invalid', 422)
      if (key.used) return error(res, 'Activation Key has already been used!', 422)

      await Subscription.findOne({ createdBy: user._id, role: key.role, expiry: { $gt: Date.now() } })
        .then(subscription => {
          if (!!subscription) {
            subscription.expiry = Date.now()
            subscription.save().then(sub => logger.info(`Subscription with id: ${sub._id} manually set to expired.`))
          }
        })
      return key
    }).then(key => {
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
        return key.save().then(() => logger.info(`ActivationKey used by ${user.username} with id: ${key._id}`))
      }).catch(err => {
        if (err.name === 'MongoError' && err.code === 11000) error(res, 'Oops! Subscription already exists', 409)
        else error(res, 500)
      })
    })
}
