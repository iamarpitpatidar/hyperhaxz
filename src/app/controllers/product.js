import mongoose from 'mongoose'
import Product from '../models/product'
import File from '../models/file'
import { sellix } from '../helper'

export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  Product.countDocuments(query)
    .then(count => Product.find(query, select, cursor)
      .then(products => products.map(each => each.view(false)))
      .then(products => {
        res.locals.products = products
        res.locals.count = count
        res.locals.cursor = cursor
      })
      .then(async () => {
        await File.find({})
          .then(files => {
            res.locals.files = files.map(each => each.view(false))
          })
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
export const edit = async (req, res) => {
  const { _id, isSeller, file, status, length, version } = req.body
  if (!mongoose.Types.ObjectId.isValid(_id) ||
    !mongoose.Types.ObjectId.isValid(file)) return res.status(400)

  const fileExists = await File.exists({ _id: file })
  if (fileExists) {
    Product.findById(_id)
      .then(async product => {
        product.markModified('isSeller')
        const update = {
          isSeller: isSeller,
          file: file,
          status: status,
          length: length,
          version: version
        }
        return product.set(update).save()
      })
      .then(product => product ? (req.flash('message', 'Product has been edited') && res.redirect('/dashboard/products')) : res.status(500))
  }
}
export const add = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.file) || !['live', 'maintenance', 'offline'].includes(req.body.status)) res.sendStatus(400)

  const fileExists = File.exists({ _id: req.body.file })
  if (fileExists) {
    Product.create({
      name: req.body.name,
      file: req.body.file,
      isSeller: req.body.isSeller,
      version: req.body.version,
      status: req.body.status
    }).then(product => product ? (req.flash('message', 'Product has been created') && res.redirect('/dashboard/products')) : res.sendStatus(500))
  }
}
