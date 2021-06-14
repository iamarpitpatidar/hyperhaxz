import { Router } from 'express'
import { middleware as query } from 'querymen'
import key from './key'
import user from './user'
import subscription from './subscription'
import { index } from '../../controllers/seller'
import { allowRoles } from '../../helper'

const router = Router()

router.get('/', (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard'
  })
})
router.get('/profile', (req, res) => {
  res.render('dashboard/profile', {
    title: 'Profile',
    csrfToken: req.csrfToken()
  })
})
router.get('/sellers',
  allowRoles(['support', 'admin']),
  query(),
  index,
  (req, res) => {
    res.render('dashboard/sellers', {
      title: 'Sellers'
    })
  })
router.use('/activationKeys', allowRoles(['seller', 'admin']), key)
router.use('/users', allowRoles(['seller', 'support', 'admin']), user)
router.use('/subscriptions', subscription)

export default router
