import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('dashboard/shop', {
    title: 'Shop'
  })
})

export default router
