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
      search: 'search Products...',
      query: parseQuery(req.originalUrl)
    },
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
    csrfToken: req.csrfToken(),
    purge: {
      tooltip: 'Users',
      isSeller: false
    }
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
