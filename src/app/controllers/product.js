import mongoose from 'mongoose'
import Product from '../models/product'
import File from '../models/file'
import { sellix } from '../helper'

export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  if (cursor.sort.createdAt === -1) cursor.sort = { status: 1, createdAt: -1 }
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
  sellix.getAllSortedProducts()
    .then(async products => {
      let errors = 0

      for (const each in products) {
        try {
          Product.findById(each)
            .then(product => {
              return product.set({ sellix: products[each] }).save()
            }).then(product => product ? (`Product updated: ${product._id}`) : console.log('Error while updating product'))
        } catch (e) {
          console.error(`Error while updating product: ${e.code}`)
          errors++
        }
      }
      req.flash('message', `Products cache have been purged with ${errors} errors`)
      res.redirect('/dashboard/products')
    })
}
export const edit = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body._id) || !mongoose.Types.ObjectId.isValid(req.body.file)) return res.sendStatus(400)

  const fileExists = await File.exists({ _id: req.body.file })
  if (fileExists) {
    Product.findById(req.body._id)
      .then(async product => {
        product.markModified('isSeller')
        const update = {
          name: req.body.name,
          isSeller: req.body.isSeller,
          file: req.body.file,
          status: req.body.status,
          version: req.body.version
        }
        return product.set(update).save()
      })
      .then(product => product ? (req.flash('message', 'Product has been edited') && res.redirect('/dashboard/products')) : res.status(500))
  } else res.sendStatus(400)
}
export const add = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.file) || !['live', 'maintenance', 'offline'].includes(req.body.status)) res.sendStatus(400)

  const fileExists = File.exists({ _id: req.body.file })
  if (fileExists) {
    Product.create({
      name: req.body.name,
      role: req.body.role,
      file: req.body.file,
      isSeller: req.body.isSeller,
      version: req.body.version,
      status: req.body.status
    }).then(product => product ? (req.flash('message', 'Product has been created') && res.redirect('/dashboard/products')) : res.sendStatus(500))
      .catch(error => {
        if (error.name === 'MongoError' && error.code === 11000) return req.flash('message', `Product with role ${req.body.role} already exists`) && res.redirect('/dashboard/products')
        else res.sendStatus(500)
      })
  }
}

export const destroy = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params._id)) return res.sendStatus(400)

  Product.findOneAndRemove({ _id: req.params._id })
    .exec(function (err, product) {
      if (err) req.flash('message', 'Cannot remove Product')
      else if (!product) req.flash('message', 'Product not found')
      else req.flash('message', 'Product has been successfully deleted!')

      res.redirect('/dashboard/products')
    })
}
