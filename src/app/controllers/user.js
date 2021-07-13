import User from '../models/user'
import Invite from '../models/invite'
import Subscription from '../models/subscription'
import { parseQuery } from '../helper'
import { success, error, notFound } from '../services/response'
import logger from '../../core/logger'

export const resetHWID = (req, res) => {
  if (req.params._id.length !== 24) return res.sendStatus(422)
  const route = req.query.type === 'seller' ? 'sellers' : 'users'

  User.findById(req.params._id)
    .then(user => {
      if (!user) return req.flash('message', 'Oops! User not found') && res.redirect(`/dashboard/${route}`)
      if (user.status !== 'active') return req.flash('message', 'Oops! User is banned') && res.redirect(`/dashboard/${route}`)
      if (!user.hardwareID) return req.flash('message', 'HardwareID not set') && res.redirect(`/dashboard/${route}`)

      return user.set({ hardwareID: null }).save()
    }).then(user => {
      if (user) req.flash('message', `HardwareID for ${user.username} has been successfully reset`) && res.redirect(`/dashboard/${route}`)
      else req.flash('message', 'Internal Server Error') && res.redirect(`/dashboard/${route}`)
    })
}
export const ban = (req, res) => {
  if (req.params._id.length !== 24) return res.sendStatus(422)
  const route = req.query.type === 'seller' ? 'sellers' : 'users'

  User.findById(req.params._id)
    .then(user => {
      if (!user) return req.flash('message', 'Oops! User not found') && res.redirect(`/dashboard/${route}`)
      if (user.status === 'banned') return req.flash('message', 'User is already banned') && res.redirect(`/dashboard/${route}`)

      return user.set({ status: 'banned' }).save()
    }).then(user => {
      if (user) req.flash('message', `${user.username} has been banned!`) && res.redirect(`/dashboard/${route}`)
      else req.flash('message', 'Internal Server Error') && res.redirect(`/dashboard/${route}`)
    })
}
export const unban = (req, res) => {
  if (req.params._id.length !== 24) return res.sendStatus(422)
  const route = req.query.type === 'seller' ? 'sellers' : 'users'

  User.findById(req.params._id)
    .then(user => {
      if (!user) return req.flash('message', 'Oops! User not found') && res.redirect(`/dashboard/${route}`)
      if (user.status === 'active') return req.flash('message', 'User is already active') && res.redirect(`/dashboard/${route}`)

      return user.set({ status: 'active' }).save()
    }).then(user => {
      if (user) req.flash('message', `${user.username} has been unbanned!`) && res.redirect(`/dashboard/${route}`)
      else req.flash('message', 'Internal Server Error') && res.redirect(`/dashboard/${route}`)
    })
}
export const seller = (req, res) => {
  if (req.params._id.length !== 24) return res.sendStatus(422)
  const route = req.query.type === 'seller' ? 'sellers' : 'users'
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

  User.findById(req.params._id)
    .then(user => {
      if (!user) return req.flash('message', 'Oops! User not found') && res.redirect(`/dashboard/${route}`)
      if (props[req.query.data].value === user.isSeller) return req.flash('message', props[req.query.data].message(user.username, false))

      return user.set({ isSeller: props[req.query.data].value }).save()
    }).then(user => {
      if (user) req.flash('message', props[req.query.data].message(user.username, user)) && res.redirect(`/dashboard/${route}`)
      else req.flash('message', 'Internal Server Error') && res.redirect(`/dashboard/${route}`)
    })
}
export const role = (req, res) => {
  if (req.params._id.length !== 24) return res.sendStatus(422)
  const route = req.query.type === 'seller' ? 'sellers' : 'users'

  User.findById(req.params._id)
    .then(user => {
      if (!user) return req.flash('message', 'Oops! User not found') && res.redirect(`/dashboard/${route}`)
      if (user.role === req.query.new) return req.flash('message', `${user.username} is already a ${user.role}`) && res.redirect(`/dashboard/${route}`)

      return user.set({ role: req.query.new }).save()
    }).then(user => {
      if (user) req.flash(`${user.username} role has been updated to ${user.role}`) && res.redirect(`/dashboard/${route}`)
      else req.flash('message', 'Internal Server Error') && res.redirect(`/dashboard/${route}`)
    })
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
    .then(users => {
      const query = { _id: { $in: users } }
      const role = req.querymen.query.role
      if (role === 'seller') query.isSeller = true

      const bulk = User.collection.initializeUnorderedBulkOp()
      bulk.find(query).delete()
      return bulk.execute()
    })
    .then(result => {
      req.flash('message', result.ok ? `${result.nRemoved} ${req.querymen.query.role}s have been purged` : 'Internal Server Error')
      res.redirect(`/dashboard/${req.querymen.query.role}s`)
    })
}
export const showMe = ({ user }, res) => {
  Subscription.find({ createdBy: user._id, expiry: { $gt: Date.now() } }, { role: true, expiry: true })
    .then(subscriptions => {
      const response = user.view('api')
      response.subscriptions = subscriptions || null
      res.json(response)
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
    .then(user => user ? res.json({ status: 'ok', message: 'Your password has been successfully updated' }) : res.sendStatus(500))
    .catch(next)
}
