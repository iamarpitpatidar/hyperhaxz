import Invite from '../models/invite'
import { parseQuery } from '../helper'

export const index = ({ querymen: { query, select, cursor }, originalUrl, user }, res, next) => {
  query.createdBy = user._id

  Invite.countDocuments(query)
    .then(count => Invite.find(query, select, cursor)
      .then(keys => keys.map(each => each.view(user.role)))
      .then(keys => {
        res.locals.keys = keys
        res.locals.count = count
        res.locals.cursor = cursor
        res.locals.query = parseQuery(originalUrl, cursor)
      })
      .then(next)
    )
}
