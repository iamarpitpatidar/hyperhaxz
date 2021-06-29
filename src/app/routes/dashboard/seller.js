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
      search: 'search Products...',
      query: parseQuery(req.originalUrl)
    },
    sort: {
      title: 'Sort Sellers',
      props: {
        Default: '',
        Status: 'status',
        Username: 'username',
        'Invite Date': 'createdAt'
      }
    },
    message: req.flash('message'),
    search: 'search sellers...',
    csrfToken: req.csrfToken(),
    purge: {
      tooltip: 'Sellers',
      isSeller: true
    }
  })
})

export default router
