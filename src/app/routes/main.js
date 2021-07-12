import { Router } from 'express'
import { index } from '../controllers/shop'
import { middleware as query } from 'querymen'
import { parseQuery } from '../helper'

const router = Router()

router.get('/',
  query(),
  index(false),
  (req, res) => {
    const info = req.flash('message')
    res.render('index', {
      title: 'Home',
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
        }
      },
      csrfToken: req.csrfToken()
    })
  })

export default router
