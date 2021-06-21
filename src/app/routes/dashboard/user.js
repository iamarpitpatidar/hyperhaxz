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

router.get('/', query(schema), index, (req, res) => {
  res.render('dashboard/users', {
    title: 'Users',
    sort: {
      Default: '',
      Status: 'status',
      Username: 'username',
      'Invite Date': 'createdAt'
    },
    search: 'search username...',
    csrfToken: req.csrfToken()
  })
})

router.post('/:id/action', (req, res, next) => {
  console.log(req.body)
  setTimeout(() => {
    next()
  }, 5000)
})

export default router
