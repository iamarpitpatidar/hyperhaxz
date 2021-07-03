import { defaultsDeep } from 'lodash'
import baseConfig from './base'

const config = {
  isDevMode: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
  isProductionMode: process.env.NODE_ENV === 'production',
  isTestMode: false,
  ignoreCSRF: [
    /^\/$/m,
    '/auth/login'
  ],
  csrfOptions: {
    cookie: true,
    ignoreMethods: ['HEAD', 'OPTIONS']
  }
}

module.exports = defaultsDeep(config, baseConfig)
