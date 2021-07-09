import { Router } from 'express'
import { getActivePage } from '../../helper'

const router = Router()

router.get('/', (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    plugins: {
      sidebar: {
        active: getActivePage(req.originalUrl)
      }
    }
  })
})

export default router
