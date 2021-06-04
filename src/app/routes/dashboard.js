import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard'
  })
})
router.get('/profile', (req, res) => {
  res.render('dashboard/profile', {
    title: 'Profile'
  })
})
router.get('/subscriptions', (req, res) => {
  res.render('dashboard/subscriptions', {
    title: 'Subscriptions'
  })
})

export default router
