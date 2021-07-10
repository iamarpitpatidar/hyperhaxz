import multer from 'multer'
import { Router } from 'express'
import { middleware as query } from 'querymen'
import { purge, index, save } from '../../controllers/file'
import { getActivePage, parseQuery } from '../../helper'

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
      },
      sidebar: {
        active: getActivePage(originalUrl)
      }
    },
    csrfToken: csrfToken()
  })
})

router.get('/delete',
  query({
    id: { type: String, required: true },
    t: { type: String, required: true }
  }),
  purge)
router.post('/upload', upload.single('loader'), save)

export default router
