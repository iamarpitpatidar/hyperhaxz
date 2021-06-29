import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('dashboard/products', {
    title: 'Products'
  })
})

export default router
