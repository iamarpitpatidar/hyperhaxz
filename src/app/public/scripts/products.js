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
        sellixID: null
      }
    },
    edit: function (_id) {
      this.data.action = 'Edit Product'
      const dataset = document.getElementById(_id).dataset
      const model = JSON.parse(dataset.modal)
      const filenames = JSON.parse(document.getElementById('files').innerHTML)

      for (const prop in model) {
        this.data.product[prop] = model[prop]
      }
      let options = ''
      filenames.forEach(each => {
        options += `<option value="${each._id}">${each.name}</option>`
      })
      document.getElementById('filename').innerHTML = options
      document.getElementById('filename').value = this.data.product.file
      document.getElementById('isSeller').value = this.data.product.isSeller
      document.getElementById('status').value = this.data.product.status
      document.getElementById('modal').classList.remove('hidden')
    },
    close () {
      document.getElementById('modal').classList.add('hidden')
    }
  }
}
