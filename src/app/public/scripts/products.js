function purge () {
  const token = document.querySelector('meta[name="session-identifier"]').getAttribute('content')
  window.location.assign(`products/purge?t=${token}`)
}

function product () {
  return {
    data: {
      action: null,
      product: {
        _id: null,
        name: null,
        file: null,
        isSeller: false,
        version: 0,
        status: null,
        sellix: []
      }
    },
    init () {
      const filenames = JSON.parse(document.getElementById('files').innerHTML)
      let options = ''
      filenames.forEach(each => {
        options += `<option value="${each._id}">${each.name}</option>`
      })
      document.getElementById('filename').innerHTML = options
    },
    add () {
      this.data.action = 'Add Product'
      document.getElementById('product_modal').setAttribute('action', 'products/new')
      document.getElementById('filename').value = this.data.product.file
      document.getElementById('isSeller').value = this.data.product.isSeller
      document.getElementById('modal').classList.remove('hidden')
    },
    edit: function (_id) {
      this.data.action = 'Edit Product'
      const dataset = document.getElementById(_id).dataset
      const model = JSON.parse(dataset.modal)

      for (const prop in model) {
        this.data.product[prop] = model[prop]
      }
      document.getElementById('product_modal').setAttribute('action', 'products/edit')
      document.getElementById('filename').value = this.data.product.file
      document.getElementById('isSeller').value = this.data.product.isSeller
      document.getElementById('status').value = this.data.product.status
      document.getElementById('modal').classList.remove('hidden')
    },
    close () {
      // setting default values
      this.data.product = { _id: null, name: null, file: null, isSeller: false, version: 0, status: null, sellix: [] }
      document.getElementById('modal').classList.add('hidden')
    }
  }
}
