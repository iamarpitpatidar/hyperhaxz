export * from './crypto'
export * from './sellix'

export const checkUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    ;['secret', 'keywords', 'password', '__v'].forEach(each => delete res.locals.user[each])
  }
  return next()
}

export const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  else res.redirect('/auth/login')
}

export const allowRoles = (roles, isSeller = false) => (req, res, next) => {
  if (isSeller && req.user.isSeller) return next()

  if (!Array.isArray(roles)) return res.sendStatus(404)
  if (roles.includes(req.user.role)) next()
  else res.sendStatus(404)
}

export const parseQuery = (url) => {
  const query = url.split('?')
  const params = {}
  if (query[1]) {
    query[1].split('&').forEach(each => {
      const split = each.split('=')
      if (split[0] && split[1]) params[split[0]] = split[1]
    })
  }
  return {
    page: query[0],
    params: params
  }
}

export const getActivePage = (url) => {
  const pathArray = url.split('/')
  return pathArray[pathArray.length - 1]
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
