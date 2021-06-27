import jwt from 'jsonwebtoken'
import Promise from 'bluebird'
import { jwtSecret } from '../../config'

const jwtSign = Promise.promisify(jwt.sign)

export const sign = (payload, options, method = jwtSign) => method(payload, jwtSecret, options)
export const signSync = (payload, options) => sign(payload, options, jwt.sign)
