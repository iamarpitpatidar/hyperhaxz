import multer from 'multer'
import { Router } from 'express'
import { middleware as query } from 'querymen'
import { index, save } from '../../controllers/file'
import { parseQuery } from '../../helper'

const router = Router()
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
  })
})

router.get('/', query(), index, ({ originalUrl, csrfToken }, res) => {
  res.render('dashboard/files', {
    title: 'Files',
    plugins: {
      insert: {
        dropdown: true
      },
      query: parseQuery(originalUrl),
      search: 'Search Files...',
      sort: {
        title: 'Sort Files',
        options: {
          Default: '',
          Name: 'name',
          status: 'status',
          createdBy: 'user',
          'Upload Date': 'date'
        }
      }
    },
    csrfToken: csrfToken()
  })
})

router.post('/upload', upload.single('loader'), save)

export default router
