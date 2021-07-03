import { Router } from 'express'
import { middleware as query, Schema } from 'querymen'
import { index, action, purge } from '../../controllers/user'
import { parseQuery } from '../../helper'

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
    plugins: {
      search: 'search Users...',
      query: parseQuery(req.originalUrl),
      sort: {
        title: 'Sort Users',
        options: {
          Default: '',
          Status: 'status',
          Username: 'username',
          'Invite Date': 'createdAt'
        }
      },
      purge: {
        tooltip: 'Users',
        dropdown: true,
        options: {
          role: 'user',
          limit: [30, 60, 90]
        }
      }
    },
    message: req.flash('message'),
    csrfToken: req.csrfToken()
  })
})

router.get('/purge',
  query({
    role: {
      enum: ['seller', 'user'],
      required: true
    },
    limit: {
      type: Number,
      enum: [30, 60, 90],
      default: 30
    }
  }),
  purge)

router.post('/:_id/action', action)

export default router
