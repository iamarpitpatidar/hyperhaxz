import path from 'path'
import csrf from 'csurf'
import helmet from 'helmet'
import express from 'express'
import engine from 'ejs-locals'
import passport from 'passport'
import Store from 'connect-mongo'
import compress from 'compression'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { errorHandler as queryErrorHandler } from 'querymen'
import config from '../config'
import logger from '../core/logger'
import routes from '../app/routes'

const serverFolder = path.join(config.rootPath, 'src', 'app')

export default function () {
  const app = express()

  app.engine('ejs', engine)
  app.set('views', path.join(serverFolder, 'views'))
  app.set('view engine', 'ejs')
  app.set('trust proxy', 1)
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
  app.use('/public', express.static(path.join(__dirname, '..', 'app', 'public')))
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(csrf({ cookie: true }))
  app.use(compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
    },
    level: 3,
    threshold: 512
  }))
  app.use(helmet({ contentSecurityPolicy: false }))
  app.use(session({
    saveUninitialized: false,
    resave: false,
    name: config.session.name,
    cookie: config.session.cookie,
    secret: config.session.secret,
    store: Store.create({
      mongoUrl: config.database.mongo.uri,
      mongoOptions: config.database.mongo.options,
      crypto: {
        secret: config.session.secret
      }
    })
  }))
  // passport session cleanup
  app.use((req, res, next) => {
    const _end = res.end
    let ended = false

    res.end = function end(chunk, encoding) {
        if (ended) return
        ended = true

        if (req.session && req.session.passport && Object.keys(req.session.passport).length === 0) {
          delete req.session.passport;
        }
        _end.call(res, chunk, encoding);
      }
    next()
  })
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(routes)
  app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    res.status(403).send('Forbidden')
  })
  app.use(bodyErrorHandler())
  app.use(queryErrorHandler())

  return app
}
