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
    userCreated: false,
    isLoading: false,
    submit: async function () {
      this.isLoading = true
      for (const _ in this.user) {
        if (_ === 'isValid') continue
        this.user[_].hasVal = true
      }
      this.validate()

      if (this.user.isValid === true) {
        await registerUser({
          username: this.user.username.$val,
          password: this.user.password.$val,
          activationKey: this.user.activationKey.$val
        })
        this.isLoading = false
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
  }).then(res => res.data)
    .then(res => {
      if (res.status === 'ok' && res.message === 'User successfully registered') {
        document.getElementById('signupForm').innerHTML = '<div class="text-blue-500 text-center">' +
          '<div class="mb-2">Your account has been created successfully.</div>' +
          '<div>You can now login to dashboard</div></div>'
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
