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

export const allowRoles = (roles) => (req, res, next) => {
  if (!Array.isArray(roles)) return res.sendStatus(404)
  if (roles.includes(req.user.role)) next()
  else res.sendStatus(404)
}
