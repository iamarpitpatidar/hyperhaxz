import path from 'path'
import dotenv from 'dotenv-safe'
import { requireProcessEnv } from '../utils'
import pkg from '../../package.json'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: path.join(__dirname, '../../.env'),
    example: path.join(__dirname, '../../.env.example')
  })
}

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
  port: requireProcessEnv('PORT'),
  database: {
    mongo: {
      uri: requireProcessEnv('MONGO_URI'),
      options: {
        keepAlive: 1,
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
