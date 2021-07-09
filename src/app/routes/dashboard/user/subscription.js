import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { index, create } from '../../../controllers/subscription'
import { validate } from '../../../middlewares/subscription'
import { getActivePage } from '../../../helper'

const router = Router()

router.get('/',
  index,
  (req, res) => {
    res.render('dashboard/subscriptions', {
      title: 'Subscriptions',
      plugins: {
        sidebar: {
          active: getActivePage(req.originalUrl)
        }
      }
    })
  })

router.post('/create',
  body({
    activationKey: {
      type: String,
      minLength: 36,
      required: true
    }
  }),
  validate,
  create)

export default router
