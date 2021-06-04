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
