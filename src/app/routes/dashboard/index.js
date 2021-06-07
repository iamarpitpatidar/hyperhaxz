import { Router } from 'express'
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
router.get('/activationKeys',
  allowRoles(['seller', 'admin']),
  (req, res) => {
    res.render('dashboard/activationKey', {
      title: 'Activation Keys'
    })
  })
router.use('/subscriptions', subscription)

export default router
