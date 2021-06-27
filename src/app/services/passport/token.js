import mongoose from 'mongoose'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { jwtSecret } from '../../../config'

export default new Strategy({
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderWithScheme('Bearer')
  ])
}, (data, next) => {
  // if (!mongoose.Types.ObjectId.isValid(id)) return next('INVALID_TOKEN')
  // if (Date.now() > expiry) return next('TOKEN_EXPIRED')
  //
  // User.findById(id).then(user => {
  //   if (secret !== user.secret) return next('INVALID_TOKEN')
  //   return next(null, user)
  // }).catch(next)
})
