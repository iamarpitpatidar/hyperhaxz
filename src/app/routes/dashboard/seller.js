import { Router } from 'express'
import { middleware as query, Schema } from 'querymen'
import { index } from '../../controllers/user'
import { getActivePage, parseQuery } from '../../helper'

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
  const info = req.flash('message')
  res.render('dashboard/sellers', {
    title: 'Sellers',
    metaData: {
      message: info.length ? info : null
    },
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
      },
      sidebar: {
        active: getActivePage(req.originalUrl)
      }
    },
    message: req.flash('message'),
    csrfToken: req.csrfToken()
  })
})

export default router
