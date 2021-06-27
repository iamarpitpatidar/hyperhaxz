import morgan from 'morgan'
import stream from 'stream'
import helmet from 'helmet'
import passport from 'passport'
import flash from 'connect-flash'
import Store from 'connect-mongo'
import compress from 'compression'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import config from '../../config'
import logger from '../../core/logger'

const init = (app) => {
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
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

    res.end = function end (chunk, encoding) {
      if (ended) return
      ended = true

      if (req.session && req.session.passport && Object.keys(req.session.passport).length === 0) {
        delete req.session.passport
      }
      _end.call(res, chunk, encoding)
    }
    next()
  })
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())
}

const dev = (app) => {
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

export default {
	init: init,
	dev: dev
}