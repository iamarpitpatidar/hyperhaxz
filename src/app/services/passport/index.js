import passport from 'passport'
import passwordStrategy from './password'

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

passport.use('password', passwordStrategy)

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))
