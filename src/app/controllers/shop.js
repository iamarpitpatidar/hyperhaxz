import Product from '../models/product'
import { sellix, isValidEmail } from '../helper'

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
  if (!isValidEmail(req.body.email)) return req.flash('message', 'Invalid email') && res.redirect('/')

  Product.findById(req.body._id)
    .then(product => {
      if (product) {
        if (product.sellix.filter(each => each._id === req.body.variant).length) {
          const orderObject = {
            product_id: req.body.variant,
            quantity: req.body.quantity,
            gateway: req.body.gateway,
            email: req.body.email,
            white_label: true
          }

          // creating a sellix order
          sellix.createOrder(orderObject)
            .then(res => {
              console.log(res)
            })
        } else return req.flash('message', 'Invalid product length') && res.redirect('/')
      } else return req.flash('message', 'Invalid product') && res.redirect('/')
    })
}
