import { Router } from 'express'
import user from './user'
import subscription from './subscription'
import { index } from '../../controllers/invites'
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
  index,
  (req, res) => {
    res.render('dashboard/activationKey', {
      title: 'Activation Keys'
    })
  })
router.use('/users', user)
router.use('/subscriptions',
  allowRoles(['seller', 'support', 'admin']),
  subscription)

export default router
