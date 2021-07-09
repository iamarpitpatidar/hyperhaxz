import { Router } from 'express'
import { middleware as query, Schema } from 'querymen'
import { index } from '../../controllers/invites'
import { getActivePage, parseQuery } from '../../helper'

const router = Router()
const schema = new Schema({
  limit: {
    type: Number,
    min: 30,
    max: 50,
    default: 50
  },
  sort: {
    type: String,
    default: 'used'
  }
})

router.get('/', query(schema), index, (req, res) => {
  res.render('dashboard/activationKey', {
    title: 'Activation Keys',
    plugins: {
      search: 'search...',
      query: parseQuery(req.originalUrl),
      sort: {
        title: 'Sort Keys',
        options: {
          Default: '',
          Role: 'role',
          Status: 'used',
          Validity: 'length',
          'Purchase Date': 'createdAt'
        }
      },
      sidebar: {
        active: getActivePage(req.originalUrl)
      }
    },
    csrfToken: req.csrfToken()
  })
})

export default router
