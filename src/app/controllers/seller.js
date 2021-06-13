import User from '../models/user'

export const index = ({ querymen: { query, select, cursor }, user }, res, next) => {
  // query.role = 'seller'
  User.find(query, select, cursor)
    .then((sellers = []) => sellers.map(each => each.view(user.role)))
    .then(sellers => {
      res.locals.sellers = sellers
      console.log(res.locals.sellers)
    })
    .catch(res.status(500))

  next()
}
