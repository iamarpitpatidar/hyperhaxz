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
      document.getElementById('payment_gateways').innerHTML = '' // clear gateways before opening a new product
      document.getElementById('modal').classList.remove('hidden')
    },
    update () {
      const length = document.getElementById('length').value
      const currentProduct = this.data.product.sellix.filter(each => Number(each.length) === Number(length))[0]
      const quantity = document.getElementById('quantity').value
      let gateways = ''
      const gatewayData = {
        FREE: {
          name: 'Free',
          icon: ''
        },
        PAYPAL: {
          name: 'Paypal',
          icon: ''
        },
        BITCOIN: {
          name: 'Bitcoin',
          icon: ''
        },
        ETHEREUM: {
          name: 'Ethereum',
          icon: ''
        },
        LITECOIN: {
          name: 'Litecoin',
          icon: ''
        },
        PERFECT_MONEY: {
          name: 'Perfect Money',
          icon: ''
        },
        BITCOIN_CASH: {
          name: 'Bitcoin Cash',
          icon: ''
        },
        SKRILL: {
          name: 'Skrill',
          icon: ''
        },
        STRIPE: {
          name: 'Stripe',
          icon: ''
        },
        CASH_APP: {
          name: 'Cash App',
          icon: ''
        }
      }

      currentProduct.gateways.forEach(each => {
        gateways += `<label class="cursor-pointer">
                      <input type="radio" class="hidden" name="gateway">
                      <div class="label w-full border-blueGray-700 bg-blueGray-700 appearance-none rounded-md px-3 py-2 border-2 text-gray-300 focus:outline-none sm:text-sm">${gatewayData[each].name}</div>
                  </label>`
      })
      document.getElementById('payment_gateways').innerHTML = gateways
      document.getElementById('_id').value = currentProduct ? currentProduct._id : ''
      document.getElementById('total').innerText = currentProduct ? `$ ${currentProduct.price * quantity}` : '$ 0.0'
    },
    close () {
      document.getElementById('modal').classList.add('hidden')
    }
  }
}
