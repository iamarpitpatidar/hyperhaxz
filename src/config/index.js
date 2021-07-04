import { defaultsDeep } from 'lodash'
import baseConfig from './base'

const config = {
  isDevMode: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
  isProductionMode: process.env.NODE_ENV === 'production',
  isTestMode: false,
  ignoreCSRF: [
    /^\/$/m,
    /^\/auth\/(?:login|register|logout)$/gm,
    /^\/dashboard\/?(?:files|shop|products|sellers|activationKeys)?$/gm,
    /^\/dashboard\/users(?:\/purge)?$/gm,
    /^\/dashboard\/user\/(?:profile|subscriptions)$/gm
  ],
  csrfOptions: {
    cookie: true,
    ignoreMethods: ['HEAD', 'OPTIONS'],
    value: req => {
      return (req.body && req.body.t) || (req.query && req.query.t) ||
        (req.headers.t)
    }
  }
}

module.exports = defaultsDeep(config, baseConfig)
