import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { middleware as query } from 'querymen'
import { getActivePage, parseQuery } from '../../helper'
import { index, purge, edit, add } from '../../controllers/product'

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
router.post('/edit',
  body({
    _id: { type: String, required: true },
    isSeller: { type: Boolean, required: true },
    file: { type: String, required: true },
    status: { type: String, required: true },
    length: { type: Number, min: 1, required: true },
    version: { type: Number, min: 0, required: true }
  }),
  edit)
router.post('/new',
  body({
    name: { type: String, required: true },
    isSeller: { type: Boolean, required: true },
    file: { type: String, required: true },
    status: { type: String, required: true },
    version: { type: Number, required: true }
  }),
  add)

export default router
