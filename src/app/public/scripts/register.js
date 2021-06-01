function signupData () {
  return {
    user: {
      username: {
        hasVal: false,
        $val: '',
        $error: false,
        minLength: 3
      },
      password: {
        hasVal: false,
        $val: '',
        $error: false,
        minLength: 6
      },
      activationKey: {
        hasVal: false,
        $val: '',
        $error: false,
        minLength: 36
      },
      isValid: false
    },
    submit: function () {
      for (const _ in this.user) {
        if (_ === 'isValid') continue
        this.user[_].hasVal = true
      }
      this.validate()

      if (this.user.isValid === true) {
        registerUser({
          username: this.user.username.$val,
          password: this.user.password.$val,
          activationKey: this.user.activationKey.$val
        })
      }
    },
    validate: function () {
      for (const _ in this.user) {
        if (_ === 'isValid' || !this.user[_].hasVal) continue
        const value = String(this.user[_].$val)

        if (value) {
          this.user[_].$error = value.length < this.user[_].minLength ? `${_} should be a minimum of ${this.user[_].minLength} characters` : ''
        } else this.user[_].$error = `Please enter your ${_}`
      }

      this.user.isValid = !this.user.username.$error && !this.user.password.$error && !this.user.activationKey.$error
    },
    input: function (name) {
      if (['username', 'password', 'activationKey'].includes(name)) this.user[name].hasVal = true
      this.validate()
    }
  }
}

function registerUser (user) {
  console.log(user)
  axios({
    method: 'post',
    url: '/auth/register',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'XSRF-Token': document.querySelector('meta[name="session-identifier"]').getAttribute('content'),
      'Content-Type': 'application/json'
    },
    data: user
  })
}
