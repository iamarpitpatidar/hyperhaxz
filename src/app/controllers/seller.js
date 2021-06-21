import User from '../models/user'
import { parseQuery } from '../helper'

export const index = ({ querymen: { query, select, cursor }, originalUrl, user }, res, next) => {
  query.isSeller = true
  if (cursor.sort.username) cursor.sort = { username: 1 }
  else if (cursor.sort.status) cursor.sort = { status: 1 }
  else if (cursor.sort.createdAt && cursor.sort.createdAt === 1) cursor.sort = { createdAt: 1 }
  else cursor.sort = { status: 1, createdAt: 1 }

  User.countDocuments(query)
    .then(count => User.find(query, select, cursor)
      .then(sellers => sellers.map(each => each.view(user.role)))
      .then(sellers => {
        res.locals.sellers = sellers
        res.locals.count = count
        res.locals.cursor = cursor
        res.locals.query = parseQuery(originalUrl)
      })
      .then(next)
    )
}
