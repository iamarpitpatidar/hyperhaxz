import { BasicStrategy } from 'passport-http'
import { Schema } from 'bodymen'
import User, { schema } from '../../models/user'

const strategy = new BasicStrategy((username, password, done) => {
  const userSchema = new Schema({ username: schema.tree.username, password: schema.tree.password })
  userSchema.validate({ username, password }, (err) => {
    if (err) done(err)
  })

  User.findOne({ username }, function (err, user) {
    if (err) { return done(err) }
    if (!user) { return done('INCORRECT_USERNAME', false) }
    if (!user.authenticate(password)) { return done('INCORRECT_PASSWORD', false) }
    return done(null, user)
  })
})

export default strategy
