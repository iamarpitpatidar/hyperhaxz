import dayjs from 'dayjs'
import chalk from 'chalk'
import express from 'express'
import initServer from './core/init'
import logger from './core/logger'
import config from './config'
import systemInfo from './lib/systemInfo'

logger.info(chalk.bold('---------------------[ Server starting at %s ]---------------------------'), dayjs().format('YYYY-MM-DD HH:mm:ss'))
logger.info(chalk.bold('Application root path: %s'), global.rootPath)

const app = express()
initServer(app)

app.listen(config.port, () => {
  logger.info('')

  logger.info('%s v%s application started!', config.app.title, config.app.version)
  logger.info('----------------------------------------------')
  logger.info('Environment:\t %s', chalk.underline.bold(process.env.NODE_ENV))
  logger.info('Port:\t\t %s', config.port)
  logger.info('Mongo:\t\t %s', config.database.mongo.uri)
  logger.info('Redis:\t\t %s', (config.database.redis.enabled ? config.database.redis.uri : 'Disabled'))
  logger.info('')

  systemInfo()
  logger.info('----------------------------------------------')
})
