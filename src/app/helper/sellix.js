import axios from 'axios'
import mongoose from 'mongoose'
import { sellixApiKey } from '../../config'

class Client {
  constructor (apiKey) {
    this.apiKey = apiKey
    this.headers = { Authorization: `Bearer ${this.apiKey}` }

    /**
     * Validating API Key
     */
    axios.get('https://dev.sellix.io/v1/products', {
      headers: this.headers
    }).then(response => response.data)
      .then(response => {
        if (response.status === 401) return console.error('Invalid API Key')
      })
  }

  createOrder (object) {
    this.query({ route: 'payments', type: 'post', data: object }, 'post')
  }

  getAllProducts () {
    return this.query({ route: 'products', type: 'get' }, body => body.data.products)
  }

  getAllSortedProducts () {
    const sort = body => {
      const filtered = {}
      body.data.products.forEach(product => {
        if (!this.validateCustomFields(product.custom_fields)) return
        const length = product.custom_fields.filter(each => each.name === 'length')[0].default
        const productId = product.custom_fields.filter(each => each.name === 'productId')[0].default
        const productData = {
          _id: product.id,
          price: product.price,
          length: length,
          gateways: product.gateways.filter(each => each).length ? product.gateways : ['FREE']
        }
        if (filtered[productId]) filtered[productId].push(productData)
        else filtered[productId] = [productData]
      })
      return filtered
    }
    return this.query({ route: 'products', type: 'get' }, sort)
  }

  validateCustomFields (fields) {
    const length = fields.filter(each => each.name === 'length')[0]
    const productId = fields.filter(each => each.name === 'productId')[0]

    return length && !!length.default && productId && !!productId.default && mongoose.Types.ObjectId.isValid(productId.default)
  }

  query ({ route, type, data }, callback) {
    return new Promise((resolve, reject) => {
      axios[type](`https://dev.sellix.io/v1/${route}`, {
        headers: this.headers
      }).then(response => response.data)
        .then(data => resolve(callback(data)))
        .catch(error => reject(error))
    })
  }
}

export const sellix = new Client(sellixApiKey)
