import mongoose from 'mongoose'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { decrypt } from '../../helper'
import { jwtSecret } from '../../../config'
import User from '../../models/user'

const strategy = new Strategy({
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  issuer: 'https://arpitpatidar.com<Arpit Patidar>',
  audience: 'hyperhaxz.com'
}, ({ message, expiry }, next) => {
  const token = decrypt(Buffer.from(message, 'hex')).split(':')
  const _id = token[0]
  const secret = token[1]

  if (_id && secret) {
    if (!mongoose.Types.ObjectId.isValid(_id)) return next('INVALID_TOKEN')
    if (Date.now() > expiry) return next('TOKEN_EXPIRED')

    User.findById(_id).then(user => {
      if (secret !== user.secret) return next('INVALID_TOKEN')
      return next(null, user)
    }).catch(next)
  } else return next('INVALID_TOKEN')
})

export default strategy
