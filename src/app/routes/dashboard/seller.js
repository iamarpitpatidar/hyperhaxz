import { Router } from 'express'
import { middleware as query, Schema } from 'querymen'
import { index } from '../../controllers/user'
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

router.get('/', query(schema), index(true), (req, res) => {
  res.render('dashboard/sellers', {
    title: 'Sellers',
    plugins: {
      search: 'search Sellers...',
      query: parseQuery(req.originalUrl),
      sort: {
        title: 'Sort Sellers',
        options: {
          Default: '',
          Status: 'status',
          Username: 'username',
          'Invite Date': 'createdAt'
        }
      },
      purge: {
        tooltip: 'Sellers',
        dropdown: true,
        options: {
          role: 'seller',
          limit: [30, 60, 90]
        }
      }
    },
    message: req.flash('message'),
    csrfToken: req.csrfToken()
  })
})

export default router
