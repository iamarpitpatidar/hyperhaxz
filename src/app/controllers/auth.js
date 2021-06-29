import { sign } from '../services/jwt'
import { success } from '../services/response'
import { encrypt } from '../helper'

export const token = ({ user }, res, next) => {
  sign({
    message: encrypt(`${user._id}:${user.secret}`),
    expiry: Date.now() + (1000 * 60 * 60)
  })
    .then(token => ({ token, user: user.view('api') }))
    .then(success(res, 201))
    .catch(next)
}

export const purge = ({ user }, res) => {
  user.set({ secret: Math.random().toString(32).substring(2) }).save()
    .then(user => user ? res.status(200).json({ message: 'access token has been purged' }) : res.status(500))
}
