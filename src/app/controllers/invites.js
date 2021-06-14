import Invite from '../models/invite'

export const index = ({ querymen: { query, select, cursor }, user }, res, next) => {
  query.createdBy = user._id

  Invite.countDocuments(query)
    .then(count => Invite.find(query, select, cursor)
      .then(keys => keys.map(each => each.view(user.role)))
      .then(keys => {
        res.locals.keys = keys
        res.locals.count = count
        res.locals.cursor = cursor
      })
      .then(next)
    )
}
