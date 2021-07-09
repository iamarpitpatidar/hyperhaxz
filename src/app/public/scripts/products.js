function purge () {
  const token = document.querySelector('meta[name="session-identifier"]').getAttribute('content')
  window.location.assign(`products/purge?t=${token}`)
}

function product () {
  return {
    data: {
      _id: null,
      name: null,
      price: null,
      file: null,
      isSeller: false,
      length: 0,
      version: 0,
      status: null,
      sellixID: null
    },
    edit: function (_id) {
      const dataset = document.getElementById(_id).dataset
      const model = JSON.parse(dataset.modal)
      const filenames = JSON.parse(document.getElementById('files').innerHTML)

      for (const prop in model) {
        this.data[prop] = model[prop]
      }
      let options = ''
      filenames.forEach(each => {
        options += `<option value="${each._id}">${each.name}</option>`
      })
      document.getElementById('filename').insertAdjacentHTML('afterbegin', options)
      document.getElementById('isSeller').value = this.data.isSeller
      document.getElementById('status').value = this.data.status
      document.getElementById('modal').classList.remove('hidden')
    },
    close () {
      document.getElementById('modal').classList.add('hidden')
    }
  }
}
