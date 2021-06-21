import { Router } from 'express'
import { middleware as query, Schema } from 'querymen'
import { index } from '../../controllers/invites'

const router = Router()
const schema = new Schema({
  limit: {
    type: Number,
    min: 30,
    max: 50,
    default: 50
  },
  sort: {
    type: String,
    default: 'used'
  }
})

router.get('/', query(schema), index, (req, res) => {
  res.render('dashboard/activationKey', {
    title: 'Activation Keys',
    sort: {
      Default: '',
      Role: 'role',
      Status: 'used',
      Validity: 'length',
      'Purchase Date': 'createdAt'
    },
    search: 'search...'
  })
})

export default router
