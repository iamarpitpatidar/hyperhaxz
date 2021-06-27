import path from 'path'
import csrf from 'csurf'
import express from 'express'
import engine from 'ejs-locals'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { errorHandler as queryErrorHandler } from 'querymen'
import config from '../../config'
import appRoutes from '../../app/routes'
import apiRoutes from '../../app/routes/api'
import plugin from './plugin'

const serverFolder = path.join(config.rootPath, 'src', 'app')

export default function () {
  const app = express()

  app.engine('ejs', engine)
  app.set('views', path.join(serverFolder, 'views'))
  app.set('view engine', 'ejs')
  app.set('trust proxy', 1)
  app.set('etag', config.isProductionMode)

  if (config.isDevMode) plugin.dev(app)
  app.use('/public', express.static(path.join(__dirname, '../..', 'app', 'public')))

  plugin.init(app)
  app.use('/api', apiRoutes)
  app.use(csrf({ cookie: true }))
  app.use(appRoutes)
  app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    res.status(403).send('Forbidden')
  })
  app.use(bodyErrorHandler())
  app.use(queryErrorHandler())

  return app
}
