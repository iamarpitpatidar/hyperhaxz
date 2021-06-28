import { sign } from '../services/jwt'
import { success } from '../services/response'

export const token = ({ user }, res, next) => {
  sign({
    id: user.id,
    token: `${user.secret}:${Date.now() + (1000 * 60 * 60)}`
  })
    .then(token => ({ token, user: user.view('api') }))
    .then(success(res, 201))
    .catch(next)
}
