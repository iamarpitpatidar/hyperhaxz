import passport from 'passport'
import passwordStrategy from './password'

export const password = (req, res, next) =>
  passport.authenticate('password', { session: false }, (err, user) => {
    if (err && err.param) return res.status(400).json(err)
    else if (err || !user) return res.status(401).end()

    if (user.status === 'banned') return res.status(403).json({ message: 'User is banned' })
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(500).end()
      return next()
    })
  })(req, res, next)

passport.use('password', passwordStrategy)
