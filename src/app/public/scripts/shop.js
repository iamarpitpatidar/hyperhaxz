function shop () {
  return {
    data: {
      product: {
        _id: null,
        variant: null
      }
    },
    open (_id) {
      const dataset = JSON.parse(document.getElementById(_id).dataset.modal)
      this.data.product._id = _id
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
      const currentProduct = this.data.product.sellix.filter(each => Number(each.length) === Number(length))[0]
      const quantity = document.getElementById('quantity').value
      this.data.product.variant = currentProduct._id
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
                      <input type="radio" class="hidden" name="gateway" value="${each}">
                      <div class="label w-full border-blueGray-700 bg-blueGray-700 appearance-none rounded-md px-3 py-2 border-2 text-gray-300 focus:outline-none sm:text-sm">${gatewayData[each].name}</div>
                  </label>`
      })
      document.getElementById('payment_gateways').innerHTML = gateways
      document.getElementById('variant').value = currentProduct ? currentProduct._id : ''
      document.getElementById('total').innerText = currentProduct ? `$ ${currentProduct.price * quantity}` : '$ 0.0'
    },
    close () {
      document.getElementById('email').innerHTML = '' // clear email
      document.getElementById('quantity').value = 1 // set default
      document.getElementById('payment_gateways').innerHTML = '' // clear gateways
      document.getElementById('modal').classList.add('hidden')
    }
  }
}
