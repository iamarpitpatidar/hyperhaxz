function loginData () {
  return {
    user: {
      username: {
        hasVal: false,
        $val: '',
        $error: false
      },
      password: {
        hasVal: false,
        $val: '',
        $error: false
      },
      isValid: false
    },
    isLoading: false,
    submit: async function () {
      for (const _ in this.user) {
        if (_ === 'isValid') continue
        this.user[_].hasVal = true
      }
      this.validate()

      if (this.user.isValid === true) {
        this.isLoading = true
        await loginUser(`${this.user.username.$val}:${this.user.password.$val}`)
        this.isLoading = false
      }
    },
    validate: function () {
      if (this.user.username.hasVal) {
        const username = String(this.user.username.$val)
        this.user.username.$error = !username ? 'Please enter your username' : ''
      }
      if (this.user.password.hasVal) {
        const password = String(this.user.password.$val)
        this.user.password.$error = !password ? 'Please enter your password' : ''
      }
      this.user.isValid = !this.user.username.$error && !this.user.password.$error
    },
    input: function (name) {
      if (['username', 'password'].includes(name)) this.user[name].hasVal = true
      this.validate()
    }
  }
}

function loginUser (data) {
  axios({
    method: 'post',
    url: '/auth/login',
    credentials: 'same-origin',
    headers: {
      Authorization: `Basic ${btoa(data)}`,
      Accept: 'application/json',
      'XSRF-Token': document.querySelector('meta[name="session-identifier"]').getAttribute('content'),
      'Content-Type': 'application/json'
    }
  }).then(res => res.data)
    .then(res => {
      if (res.status === 'ok' && res.message === 'Logged In Successfully') {
        window.location.replace('/dashboard')
      } else notify('error', { title: 'Error', message: 'Something\'s wrong. Please try again later' })
    })
    .catch(function (error) {
      if (error.response && error.response.data) {
        notify('error', {
          title: 'Error',
          message: error.response.data.message
        })
      } else {
        notify('error', {
          title: 'Error',
          message: 'Something\'s wrong. Please try again later'
        })
      }
    })
}
