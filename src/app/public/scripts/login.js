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
    submit: function () {
      this.input('username')
      this.input('password')
      this.validate()

      if (this.user.isValid === true) {
        loginUser(`${this.user.username.$val}:${this.user.password.$val}`)
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
  })
}
