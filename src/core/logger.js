'use strict'

import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import { transports, format, createLogger } from 'winston'
import { logging } from '../config'

const winstonTransports = []

winstonTransports.push(new transports.Console({
  level: logging.console.level,
  colorize: true,
  prettyPrint: true,
  handleExceptions: process.env.NODE_ENV === 'production',
  format: format.combine(
    format(info => {
      info.level = info.level.charAt(0).toUpperCase() + info.level.slice(1)
      return info
    })(),
    format.colorize(),
    format.splat(),
    format.simple()
  )
}))

if (logging.file.enabled) {
  // Create logs directory
  const logDir = logging.file.path
  if (!fs.existsSync(logDir)) {
    mkdirp(logDir).then(() => console.log('Log Directory created successfully!'))
  }

  winstonTransports.push(new (require('winston-daily-rotate-file'))({
    filename: path.join(logDir, 'server-log'),
    level: logging.file.level || 'info',
    timestamp: true,
    json: logging.file.json || false,
    handleExceptions: true
  }))

  if (logging.file.exceptionFile) {
    winstonTransports.push(new transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      level: 'error',
      timestamp: true,
      json: logging.file.json || false,
      prettyPrint: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    }))
  }
}

const logger = createLogger({
  level: 'debug',
  transports: winstonTransports,
  exitOnError: false
})

export default logger
