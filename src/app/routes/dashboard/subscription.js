import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { index, create } from '../../controllers/subscription'
import { validate } from '../../middlewares/subscription'

const router = Router()

router.get('/',
  index,
  (req, res) => {
    res.render('dashboard/subscriptions', {
      title: 'Subscriptions'
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
