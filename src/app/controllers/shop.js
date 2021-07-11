import Product from '../models/product'

export const index = (seller) => ({ querymen: { query, select, cursor } }, res, next) => {
  query.isSeller = seller
  query['sellix.1'] = { $exists: true }
  Product.countDocuments(query)
    .then(count => Product.find(query, select, cursor)
      .then(products => {
        res.locals.products = products
        res.locals.count = count
        res.locals.cursor = cursor
      })
      .then(next))
}
