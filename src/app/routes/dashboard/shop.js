import { Router } from 'express'
import { getActivePage } from '../../helper'

const router = Router()

router.get('/', (req, res) => {
  res.render('dashboard/shop', {
    title: 'Shop',
    sidebar: {
      active: getActivePage(req.originalUrl)
    }
  })
})

export default router
