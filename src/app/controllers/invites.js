import Invite from '../models/invite'

export const index = ({ user }, res, next) => {
  Invite.find({ createdBy: user._id }).sort({ used: 1 })
    .then(keys => {
      res.locals.keys = keys || []
      ;['_id', 'createdBy', 'soldTo', 'keywords', 'orderID', '__v'].forEach(each => delete res.locals.keys[each])
    })
    .then(next)
}
