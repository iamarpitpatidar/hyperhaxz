import { Router } from 'express'
import { middleware as query } from 'querymen'
import { getActivePage, parseQuery } from '../../helper'
import { index, purge } from '../../controllers/product'

const router = Router()

router.get('/', query(), index, (req, res) => {
  const info = req.flash('message')
  res.render('dashboard/products', {
    title: 'Products',
    metaData: {
      message: info.length ? info : null
    },
    plugins: {
      search: 'Search Products...',
      query: parseQuery(req.originalUrl),
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
      },
      sidebar: {
        active: getActivePage(req.originalUrl)
      }
    },
    csrfToken: req.csrfToken()
  })
})

router.get('/purge', purge)

export default router
