function shop () {
  return {
    data: {
      product: {
        _id: null
      }
    },
    open (_id) {
      const dataset = JSON.parse(document.getElementById(_id).dataset.modal)
      this.data.product.sellix = dataset
      let options = '<option value="" disabled selected></option>'
      dataset.forEach(each => {
        options += `<option value="${each.length}">${each.length}</option>`
      })
      document.getElementById('length').innerHTML = options
      document.getElementById('modal').classList.remove('hidden')
    },
    update () {
      const length = document.getElementById('length').value
      const currentProject = this.data.product.sellix.filter(each => Number(each.length) === Number(length))[0]
      const quantity = document.getElementById('quantity').value

      document.getElementById('_id').value = currentProject ? currentProject._id : ''
      document.getElementById('total').innerText = currentProject ? `$ ${currentProject.price * quantity}` : '$ 0.0'
    },
    close () {
      document.getElementById('modal').classList.add('hidden')
    }
  }
}
