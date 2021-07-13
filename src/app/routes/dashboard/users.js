import { Router } from 'express'
import { middleware as query, Schema } from 'querymen'
import { index, ban, unban, seller, role, resetHWID, purge } from '../../controllers/user'
import { parseQuery, getActivePage } from '../../helper'

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
  const info = req.flash('message')
  res.render('dashboard/users', {
    title: 'Users',
    metaData: {
      message: info.length ? info : null
    },
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
      },
      sidebar: {
        active: getActivePage(req.originalUrl)
      }
    },
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

router.get('/:_id/ban', ban)
router.get('/:_id/role',
  query({
    new: {
      type: String,
      required: true,
      enum: ['user', 'support', 'admin']
    },
    type: {
      type: String,
      required: true,
      enum: ['user', 'seller']
    }
  }),
  role)

router.get('/:_id/unban', unban)
router.get('/:_id/seller',
  query({
    data: {
      type: String,
      required: true,
      enum: ['remove', 'approve']
    },
    type: {
      type: String,
      required: true,
      enum: ['user', 'seller']
    }
  }),
  seller)

router.get('/:_id/resetHWID', resetHWID)

export default router
