import { Router } from 'express'
import { parseQuery } from '../../helper'

const router = Router()

router.get('/', ({ originalUrl }, res) => {
  res.render('dashboard/products', {
    title: 'Products',
    plugins: {
      search: 'Search Products...',
      query: parseQuery(originalUrl),
      sort: {
        title: 'sort products',
        options: {
          Default: '',
          Price: 'price'
        }
      }
    }
  })
})

export default router
