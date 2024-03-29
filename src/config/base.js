import path from 'path'
import dotenv from 'dotenv-safe'
import { requireProcessEnv } from '../utils'
import pkg from '../../package.json'

dotenv.config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example')
})

global.rootPath = path.normalize(path.join(__dirname, '..', '..'))

export default {
  app: {
    title: pkg.title,
    version: pkg.version,
    googleAnalytics: {
      enabled: false,
      userID: 'UA-xxxxx-x'
    },
    contactEmail: 'support@hyperhaxz.com'
  },
  jwtSecret: requireProcessEnv('JWT_SECRET'),
  cryptoSecret: requireProcessEnv('CRYPTO_SECRET'),
  sellixApiKey: requireProcessEnv('SELLIX_API_KEY'),
  port: requireProcessEnv('PORT'),
  rootPath: global.rootPath,
  database: {
    mongo: {
      uri: requireProcessEnv('MONGO_URI'),
      options: {
        keepAlive: 1,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    redis: {
      enabled: false,
      uri: requireProcessEnv('REDIS_URI'),
      options: null
    }
  },
  session: {
    name: 'sessionIdentifier',
    cookie: {
      secure: 'auto',
      httpOnly: true,
      domain: requireProcessEnv('DOMAIN'),
      maxAge: 7 * 24 * (60 * 60 * 1000),
      sameSite: true
    },
    collection: 'sessions',
    secret: 'WFQbmD59BIIm8esVS0y7mWDL2JM8h9eg'
  },
  logging: {
    console: {
      level: 'debug'
    },
    file: {
      enabled: true,
      path: path.join(global.rootPath, 'logs'),
      level: 'info',
      json: false,
      exceptionFile: true
    }
  }
}
