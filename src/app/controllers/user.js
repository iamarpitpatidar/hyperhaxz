import User from '../models/user'
import Invite from '../models/invite'
import Subscription from '../models/subscription'
import { parseQuery } from '../helper'
import { success, error, notFound } from '../services/response'
import logger from '../../core/logger'

export const index = ({ querymen: { query, select, cursor }, originalUrl, user }, res, next) => {
  if (user.role === 'seller') query.invitedBy = user._id
  if (cursor.sort.username) cursor.sort = { username: 1 }
  else if (cursor.sort.status) cursor.sort = { status: 1 }
  else if (cursor.sort.createdAt && cursor.sort.createdAt === 1) cursor.sort = { createdAt: 1 }
  else cursor.sort = { status: 1, createdAt: 1 }

  User.countDocuments(query)
    .then(count => User.find(query, select, cursor)
      .then(users => users.map(each => each.view(user.role)))
      .then(users => {
        res.locals.users = users
        res.locals.count = count
        res.locals.cursor = cursor
        res.locals.query = parseQuery(originalUrl, cursor)
      })
      .then(next)
    )
}

export const create = ({ bodymen: { body } }, res) => {
  Invite.findOne({ code: body.activationKey }).then(key => {
    if (!key) { error(res, 'Code is invalid', 422); return }
    if (key.used) { error(res, 'Code has already been used!', 422); return }

    User.create({ username: body.username, password: body.password, invitedBy: key.createdBy })
      .then(async user => {
        logger.info(`User created with uid: ${user._id}`)
        await Subscription.create({
          activationKeyId: key._id,
          role: key.role,
          expiry: Date.now() + (1000 * 60 * 60 * 24 * Number(key.length)),
          createdBy: user._id
        }).then(subscription => logger.info(`Subscription created by ${body.username} with id: ${subscription._id}`))

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
      .catch(err => {
        if (err.name === 'MongoError' && err.code === 11000) error(res, 'username already registered', 409)
        else error(res, 500)
      })
  })
}

export const updatePassword = (req, res, next) => {
  if (!req.user || !req.user._id || req.user._id.length < 12) return res.status(500).json({ message: 'User not logged In' })

  User.findById(req.user._id)
    .then(notFound(res))
    .then(async user => {
      if (!await user.authenticate(req.body.currentPassword)) return res.status(401).json({ message: 'Incorrect Password' })
      req.logout()
      return user.set({ password: req.body.newPassword }).save()
    })
    .then(user => user ? res.json({ status: 'ok', message: 'Your password has been successfully updated' }) : res.status(500))
    .catch(next)
}
