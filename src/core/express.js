import path from 'path'
import express from 'express'
import helmet from 'helmet'
import session from 'express-session'
import config from '../config'
import routes from '../app/routes'

const serverFolder = path.join(config.rootPath, 'src', 'app')

export default async function (database) {
  const app = express()

  // initMiddleware(app)
  app.set('views', path.join(serverFolder, 'views'))
  app.set('view engine', 'ejs')

  app.use(helmet())
  app.use(session({
    saveUninitialized: true,
    resave: false,
    name: config.session.name,
    cookie: config.session.cookie,
    secret: config.session.secret
  }))
  // initAuth(app)
  app.use(routes)

  return app
}
