import path from 'path'

export default {
  logging: {
    console: {
      level: 'debug'
    },
    file: {
      enabled: true,
      // path: path.join(global.rootPath, 'logs'),
      path: path.join('logs'),
      level: 'info',
      json: false,
      exceptionFile: true
    }
  }
}
