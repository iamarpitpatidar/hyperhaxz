import path from 'path'
import { requireProcessEnv } from '../utils'
import pkg from '../../package.json'

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
