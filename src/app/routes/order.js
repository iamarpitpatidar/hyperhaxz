import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { order } from '../controllers/shop'

const router = Router()

router.post('/new',
  body({
    _id: { type: String, length: 24, required: true },
    variant: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    email: { type: String, required: true },
    gateway: { type: String, required: true, enum: ['FREE', 'PAYPAL', 'BITCOIN', 'ETHEREUM', 'LITECOIN', 'PERFECT_MONEY', 'BITCOIN_CASH', 'SKRILL', 'STRIPE', 'CASH_APP'] }
  }),
  order)

export default router
