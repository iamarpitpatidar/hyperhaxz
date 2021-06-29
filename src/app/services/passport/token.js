import mongoose from 'mongoose'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { jwtSecret } from '../../../config'
import User from '../../models/user'

const strategy = new Strategy({
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderWithScheme('Bearer')
  ])
}, ({ _id, token }, next) => {
  const expiry = token.split(':')[1]
  const secret = token.split(':')[0]
  if (!mongoose.Types.ObjectId.isValid(_id)) return next('INVALID_TOKEN')
  if (Date.now() > expiry) return next('TOKEN_EXPIRED')

  User.findById(_id).then(user => {
    if (secret !== user.secret) return next('INVALID_TOKEN')
    return next(null, user)
  }).catch(next)
})

export default strategy
