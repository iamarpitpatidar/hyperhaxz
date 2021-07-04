import Product from '../models/product'
import { sellix } from '../helper'

export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  Product.countDocuments(query)
    .then(count => Product.find(query, select, cursor).lean()
      .then(products => {
        res.locals.products = products
        res.locals.count = count
        res.locals.cursor = cursor
      })
      .then(next))
}

export const purge = (req, res) => {
  // sellix.getAllProducts()
  req.flash('message', 'Products cache have been purged')
  res.redirect('/dashboard/products')
}
