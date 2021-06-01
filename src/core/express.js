import path from 'path'
import express from 'express'
import helmet from 'helmet'
import engine from 'ejs-locals'
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

  app.engine('ejs', engine)
  app.set('views', path.join(serverFolder, 'views'))
  app.set('view engine', 'ejs')
  app.set('etag', config.isProductionMode)

  if (config.isDevMode) {
    const morgan = require('morgan')
    const stream = require('stream')
    const lmStream = new stream.Stream()

    lmStream.writable = true
    lmStream.write = data => logger.debug(data)
    app.use(morgan('dev', {
      stream: lmStream
    }))
    app.get('/*', (req, res, next) => {
      res.setHeader('Last-Modified', (new Date()).toUTCString())
      next()
    })
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
  app.use('/public', express.static(path.join(__dirname, '..', 'app', 'public')))

  return app
}
