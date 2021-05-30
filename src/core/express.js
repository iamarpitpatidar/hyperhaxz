import path from 'path'
import express from 'express'
import helmet from 'helmet'
import compress from 'compression'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import config from '../config'
import logger from '../core/logger'
import routes from '../app/routes'

const serverFolder = path.join(config.rootPath, 'src', 'app')

export default function () {
  const app = express()

  app.set('views', path.join(serverFolder, 'views'))
  app.set('view engine', 'ejs')
  app.set('etag', true)

  if (config.isDevMode) {
    const morgan = require('morgan')
    const stream = require('stream')
    const lmStream = new stream.Stream()

    lmStream.writable = true
    lmStream.write = data => logger.debug(data)
    app.use(morgan('dev', {
      stream: lmStream
    }))
  }
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
    },
    level: 3,
    threshold: 512
  }))
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
