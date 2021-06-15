import User from '../models/user'

export const index = ({ querymen: { query, select, cursor }, user }, res, next) => {
  query.role = 'seller'

  User.countDocuments(query)
    .then(count => User.find(query, select, cursor)
      .then(sellers => sellers.map(each => each.view(user.role)))
      .then(sellers => {
        res.locals.sellers = sellers
        res.locals.count = count
        res.locals.cursor = cursor
      })
      .then(next)
    )
}
