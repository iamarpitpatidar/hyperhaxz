import User from '../models/user'
import Invite from '../models/invite'
import Subscription from '../models/subscription'
import { parseQuery } from '../helper'
import { success, error, notFound } from '../services/response'
import logger from '../../core/logger'

export const action = ({ body, params }, res) => {
  if (!body.type || params._id.length !== 24 || !['resetHWID', 'ban', 'unban', 'seller', 'role'].includes(body.type)) return res.sendStatus(422)
  switch (body.type) {
    case 'resetHWID':
      resetHWID(params._id, res)
      break

    case 'ban':
      ban(params._id, res)
      break

    case 'unban':
      unban(params._id, res)
      break

    case 'seller':
      seller(params._id, body, res)
      break

    case 'role':
      role(params._id, body, res)
      break
  }
}
const resetHWID = (_id, res) => {
  User.findById(_id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'Oops! User not found' })
      if (user.status !== 'active') return res.status(400).json({ message: 'User is banned' })
      if (!user.hardwareID) return res.status(400).json({ message: 'HardwareID not set' })

      return user.set({ hardwareID: null }).save()
    }).then(user => user ? res.json({ status: 'ok', message: `HardwareID for ${user.username} has been successfully reset` }) : res.status(500))
}
const ban = (_id, res) => {
  User.findById(_id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'Oops! User not found' })
      if (user.status === 'banned') return res.status(400).json({ message: 'User is already banned' })

      return user.set({ status: 'banned' }).save()
    }).then(user => user ? res.json({ status: 'ok', message: `${user.username} has been banned!` }) : res.status(500))
}
const unban = (_id, res) => {
  User.findById(_id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'Oops! User not found' })
      if (user.status === 'active') return res.status(400).json({ message: 'User is already active' })

      return user.set({ status: 'active' }).save()
    }).then(user => user ? res.json({ status: 'ok', message: `${user.username} has been unbanned!` }) : res.status(500))
}
const seller = (_id, body, res) => {
  if (!body.data || !['remove', 'approve'].includes(body.data)) return res.status(400).json({ message: 'Bad Request' })

  const props = {
    approve: {
      value: true,
      message: (username, success = true) => success ? `Seller role has been added to ${username}` : `${username} is already a seller`
    },
    remove: {
      value: false,
      message: (username, success = true) => success ? `Seller role has been removed from ${username}` : `${username} doesn't have seller role to remove`
    }
  }

  User.findById(_id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'Oops! User not found' })
      if (props[body.data].value === user.isSeller) return res.status(422).json({ message: props[body.data].message(user.username, false) })

      return user.set({ isSeller: props[body.data].value }).save()
    }).then(user => user ? res.json({ status: 'ok', message: props[body.data].message(user.username, user) }) : res.status(500))
}
const role = (_id, body, res) => {
  if (!body.data || !['user', 'support', 'admin'].includes(body.data)) return res.status(400).json({ message: 'Bad Request' })

  User.findById(_id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'Oops! User not found' })
      if (user.role === body.data) return res.status(400).json({ message: `${user.username} is already a ${user.role}` })

      return user.set({ role: body.data }).save()
    }).then(user => user ? res.json({ status: 'ok', message: `${user.username} role has been updated to ${user.role}` }) : res.status(500))
}

export const create = ({ bodymen: { body } }, res) => {
  Invite.findOne({ code: body.activationKey.toLowerCase() }).then(key => {
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
export const index = filterSellers => ({ querymen: { query, select, cursor }, originalUrl, user }, res, next) => {
  if (user.isSeller) query.invitedBy = user._id
  if (filterSellers && typeof filterSellers === 'boolean') query.isSeller = filterSellers
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
        res.locals.query = parseQuery(originalUrl)
      })
      .then(next)
    )
}
export const purge = (req, res) => {
  const date = new Date()
  date.setDate(date.getDate() - req.querymen.cursor.limit)

  Subscription.find({ expiry: { $lt: date } })
    .then(subscriptions => subscriptions.map(each => each.createdBy))
    .then(users => User.deleteMany({ _id: { $in: users } }))
    .then(result => {
      req.flash('message', result.ok ? `${result.deletedCount} users have been purged` : 'Internal Server Error')
      res.redirect('/dashboard/users')
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
