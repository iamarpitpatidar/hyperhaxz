import { Router } from 'express'
import { middleware as query, Schema } from 'querymen'
import { index } from '../../controllers/user'

const router = Router()
const schema = new Schema({
  limit: {
    type: Number,
    min: 30,
    max: 50,
    default: 50
  }
})

router.get('/', query(schema), index(true), (req, res) => {
  res.render('dashboard/sellers', {
    title: 'Sellers',
    sort: {
      Default: '',
      Status: 'status',
      Username: 'username',
      'Invite Date': 'createdAt'
    },
    search: 'search sellers...',
    csrfToken: req.csrfToken()
  })
})

export default router
