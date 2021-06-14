import { Router } from 'express'
import { middleware as query, Schema } from 'querymen'
import { index } from '../../controllers/user'

const router = Router()
const schema = new Schema({
  limit: {
    type: Number,
    min: 10,
    max: 30,
    default: 20
  },
  sort: {
    type: String,
    default: 'createdAt'
  }
})

router.get('/', query(schema), index, (req, res) => {
  res.render('dashboard/users', {
    title: 'Users',
    url: req.originalUrl
  })
})

export default router
