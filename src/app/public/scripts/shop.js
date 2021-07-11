function shop () {
  return {
    data: {
      product: {
        _id: null,
        sellix: null
      }
    },
    open (_id) {
      const dataset = JSON.parse(document.getElementById(_id).dataset.modal)
      this.data.product.sellix = dataset
      let options = ''
      dataset.forEach(each => {
        options += `<option value="${each.length}">${each.length}</option>`
      })
      document.getElementById('length').innerHTML = options
      document.getElementById('modal').classList.remove('hidden')
    },
    close () {
      document.getElementById('modal').classList.add('hidden')
    }
  }
}
