import passport from 'passport'
import passwordStrategy from './password'
import tokenStrategy from './token'
import User from '../../models/user'
import { error as sendError } from '../response'

export const password = (isApi = false) => (req, res, next) =>
  passport.authenticate('password', { session: false }, (err, user) => {
    if (err) {
      if (err === 'INCORRECT_PASSWORD' || err === 'INCORRECT_USERNAME') return res.status(401).json({ message: 'username or password incorrect' })
      else if (err.param) return res.status(400).json(err)
    } else if (!user) return res.status(401).end()

    if (user.status === 'banned') return res.status(403).json({ message: 'User is banned' })
    req.logIn(user, { session: !isApi }, (err) => {
      if (err) return res.status(500).end()

      if (isApi) return next()
      else return res.send({ status: 'ok', message: 'Logged In Successfully' })
    })
  })(req, res, next)

export const token = ({ required, roles = User.roles } = {}) => (req, res, next) => {
  passport.authenticate('token', { session: false }, (error, user) => {
    if (error === 'TOKEN_EXPIRED') return sendError(res, 'Access Token is expired', '401')
    if (error === 'INVALID_TOKEN') return sendError(res, 'Access Token is invalid', '401')
    if (user && required && !~roles.indexOf(user.role)) return sendError(res, 'Access Denied', '403')
    if (error || !user) return res.status(403).json({ message: 'Access Denied' })

    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).end()
      return next()
    })
  })(req, res, next)
}

passport.use('password', passwordStrategy)
passport.use('token', tokenStrategy)

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))
