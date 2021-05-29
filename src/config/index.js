import { defaultsDeep } from 'lodash'
import baseConfig from './base'

const config = {
  isTestMode: false
}

module.exports = defaultsDeep(config, baseConfig)
export default module.exports
