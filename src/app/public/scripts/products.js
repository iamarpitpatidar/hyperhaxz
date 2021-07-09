function purge () {
  const token = document.querySelector('meta[name="session-identifier"]').getAttribute('content')
  window.location.assign(`products/purge?t=${token}`)
}

function product () {
  return {
    data: {
      name: null,
      price: null,
      filename: null,
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
      filenames.forEach(each => options += `<option value="${each._id}">${each.name}</option>`)
      document.getElementById('filename').insertAdjacentHTML('afterbegin', options)
      document.getElementById('isSeller').value = this.data.isSeller
      document.getElementById('modal').classList.remove('hidden')
    },
    submit: function () {

    },
    close () {
      document.getElementById('modal').classList.add('hidden')
    }
  }
}
