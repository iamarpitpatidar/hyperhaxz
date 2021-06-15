import { Router } from 'express'
import key from './key'
import user from './user'
import seller from './seller'
import subscription from './subscription'
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
router.use('/sellers', allowRoles(['support', 'admin']), seller)
router.use('/activationKeys', allowRoles(['seller', 'admin']), key)
router.use('/users', allowRoles(['seller', 'support', 'admin']), user)
router.use('/subscriptions', subscription)

export default router
