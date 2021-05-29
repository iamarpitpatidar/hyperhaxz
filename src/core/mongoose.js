import chalk from 'chalk'
import Promise from 'bluebird'
import mongoose from 'mongoose'
import logger from './logger'
import { database, isDevMode } from '../config'

export default function () {
  mongoose.Promise = Promise

  if (mongoose.connection.readyState !== 1) {
    logger.info('Connecting to MongoDB...')

    mongoose.connect(database.mongo.uri, database.mongo.options, (err) => {
      if (err) {
        logger.error('Could not connect to MongoDB!')
        return logger.error(err)
      }

      mongoose.set('debug', isDevMode)
    })

    mongoose.connection.on('error', function mongoConnectionError (err) {
      if (err.message.code === 'ETIMEDOUT') {
        logger.warn('Mongo connection timeout!', err)
        setTimeout(() => {
          mongoose.createConnection(database.mongo.uri, database.mongo.options)
        }, 1000)
        return
      }

      logger.error('Could not connect to MongoDB!')
      return logger.error(err)
    })

    mongoose.connection.once('open', function mongoAfterOpen () {
      logger.info(chalk.blue.bold('Mongo DB connected.'))
    })
  } else logger.info('Mongo already connected.')

  return mongoose.connection
}
