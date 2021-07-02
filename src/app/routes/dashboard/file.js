import { Router } from 'express'
import { middleware as query } from 'querymen'
import { index } from '../../controllers/file'
import { parseQuery } from '../../helper'

const router = Router()

router.get('/', query(), index, ({ originalUrl }, res) => {
  res.render('dashboard/files', {
    title: 'Files',
    plugins: {
      search: 'Search Files...',
      query: parseQuery(originalUrl),
      sort: {
        title: 'Sort Files',
        options: {
          Default: '',
          Name: 'name',
          createdBy: 'createdBy',
          status: 'status',
          'Upload Date': 'createdAt'
        }
      }
    }
  })
})

export default router
