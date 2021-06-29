import { sign } from '../services/jwt'
import { success } from '../services/response'

export const token = ({ user }, res, next) => {
  sign({
    _id: user.id,
    token: `${user.secret}:${Date.now() + (1000 * 60 * 60)}`
  })
    .then(token => ({ token, user: user.view('api') }))
    .then(success(res, 201))
    .catch(next)
}

export const purge = ({ user }, res) => {
  user.set({ secret: Math.random().toString(32).substring(2) }).save()
  return res.status(200).json({ message: 'access token has been purged' })
}
