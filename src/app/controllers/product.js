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
  Product.deleteMany({})
    .then(() => sellix.getAllProducts())
    .then(products => {
      products.forEach(async product => {
        await Product.create({
          name: product.title,
          description: product.description,
          image: product.image ? product.image : 'default',
          price: product.price,
          stock: product.stock !== -1 ? product.stock : 99999,
          sellixID: product.uniqid,
          length: Number(product.custom_fields.filter(each => each.name === 'length').default) || 1,
          isSeller: product.custom_fields.filter(each => each.name === 'seller')[0].default === 'true',
          gateways: product.gateways.filter(each => each).length ? product.gateways : ['FREE']
        })
      })
      req.flash('message', 'Products cache have been purged')
      res.redirect('/dashboard/products')
    })
}
