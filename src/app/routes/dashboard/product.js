import { Router } from 'express'
import { parseQuery } from '../../helper'
import { index } from '../../controllers/product'

const router = Router()

router.get('/', index, ({ originalUrl, csrfToken }, res) => {
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
      },
      purge: {
        tooltip: 'Products',
        dropdown: false
      }
    },
    csrfToken: csrfToken()
  })
})

export default router
