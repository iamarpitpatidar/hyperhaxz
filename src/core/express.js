import path from 'path'
import express from 'express'
import config from '../config'
import routes from '../app/routes'

const serverFolder = path.join(config.rootPath, 'src', 'app')

export default async function (database) {
  const app = express()

  // initMiddleware(app)
  app.set('views', path.join(serverFolder, 'views'))
  app.set('view engine', 'ejs')
  // initHelmetHeaders(app)
  // initSession(app, db)
  // initAuth(app)
  app.use(routes)

  return app
}
