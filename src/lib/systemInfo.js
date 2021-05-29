import os from 'os'
import clui from 'clui'
import pretty from 'pretty-bytes'
import logger from '../core/logger'

module.exports = function () {
  const Gauge = clui.Gauge
  const totalMemory = os.totalmem()
  const freeMemory = os.freemem()
  const usedMemory = totalMemory - freeMemory
  const human = pretty(freeMemory)

  logger.info('CPU:\t\tArch: ' + (os.arch()) + ', Cores: ' + (os.cpus().length))
  logger.info('Memory:\t\t' + Gauge(usedMemory, totalMemory, 20, totalMemory * 0.8, human + ' free'))
  logger.info('OS:\t\t' + (os.platform()) + ' (' + (os.type()) + ')')
}
