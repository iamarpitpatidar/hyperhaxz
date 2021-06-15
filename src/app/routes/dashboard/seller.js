import { Router } from 'express'
import { middleware as query, Schema } from 'querymen'
import { index } from '../../controllers/seller'

const router = Router()
const schema = new Schema({
  limit: {
    type: Number,
    min: 10,
    max: 30,
    default: 20
  }
})

router.get('/', query(schema), index, (req, res) => {
  res.render('dashboard/sellers', {
    title: 'Sellers',
    url: req.originalUrl
  })
})

export default router
