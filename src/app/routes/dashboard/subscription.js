import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('dashboard/subscriptions', {
    title: 'Subscriptions'
  })
})

export default router
