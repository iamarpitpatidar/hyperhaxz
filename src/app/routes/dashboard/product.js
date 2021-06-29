import { Router } from 'express'
import { parseQuery } from '../../helper'

const router = Router()

router.get('/', ({ originalUrl }, res) => {
  res.render('dashboard/products', {
    title: 'Products',
    plugins: {
      search: 'search Products...',
      query: parseQuery(originalUrl)
    }
  })
})

export default router
