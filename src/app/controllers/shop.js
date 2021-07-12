import Product from '../models/product'
import { sellix } from '../helper'

export const index = (seller) => ({ querymen: { query, select, cursor } }, res, next) => {
  query.isSeller = seller
  query['sellix.0'] = { $exists: true }
  Product.countDocuments(query)
    .then(count => Product.find(query, select, cursor)
      .then(products => {
        res.locals.products = products
        res.locals.count = count
        res.locals.cursor = cursor
      })
      .then(next))
}
export const order = (req, res) => {
  // sellix.createOrder()
  console.log(req.body)
}
