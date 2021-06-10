import { Router } from 'express'
import { middleware as query } from 'querymen'
import user from './user'
import subscription from './subscription'
import { index as indexInvites } from '../../controllers/invites'
import { index as indexSellers } from '../../controllers/seller'
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
router.get('/activationKeys',
  allowRoles(['seller', 'admin']),
  indexInvites,
  (req, res) => {
    res.render('dashboard/activationKey', {
      title: 'Activation Keys'
    })
  })
router.get('/sellers',
  allowRoles(['support', 'admin']),
  query(),
  indexSellers,
  (req, res) => {
    res.render('dashboard/sellers', {
      title: 'Sellers'
    })
  })
router.use('/users', allowRoles(['seller', 'support', 'admin']), user)
router.use('/subscriptions', subscription)

export default router
