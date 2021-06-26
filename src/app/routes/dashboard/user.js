import { Router } from 'express'
import { middleware as query, Schema } from 'querymen'
import { index, action, purge } from '../../controllers/user'

const router = Router()
const schema = new Schema({
  limit: {
    type: Number,
    min: 30,
    max: 50,
    default: 50
  }
})

router.get('/', query(schema), index(), (req, res) => {
  res.render('dashboard/users', {
    title: 'Users',
    sort: {
      title: 'Sort Users',
      props: {
        Default: '',
        Status: 'status',
        Username: 'username',
        'Invite Date': 'createdAt'
      }
    },
    message: req.flash('message'),
    search: 'search username...',
    csrfToken: req.csrfToken()
  })
})

router.get('/purge',
  query({
    limit: {
      type: Number,
      enum: [30, 60, 90],
      default: 30
    }
  }),
  purge)

router.post('/:_id/action', action)

export default router
