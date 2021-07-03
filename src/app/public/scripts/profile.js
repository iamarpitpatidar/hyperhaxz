function update () {
  return {
    user: {
      currentPassword: {
        hasVal: false,
        $val: '',
        $error: false,
        errors: {
          required: 'Please enter your current password'
        }
      },
      newPassword: {
        hasVal: false,
        $val: '',
        $error: false,
        minLength: 6,
        errors: {
          isEqual: 'New password must not match the current one',
          required: 'Please enter your new password',
          minLength: 'Password must be a minimum of 6 characters'
        }
      },
      confirmPassword: {
        hasVal: false,
        $val: '',
        $error: false,
        errors: {
          required: 'Please enter your new Password',
          notEqual: 'Confirm password must match your new password'
        }
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
        await updatePassword({
          currentPassword: this.user.currentPassword.$val,
          newPassword: this.user.newPassword.$val
        })
        this.isLoading = false
      }
    },
    validate: function () {
      for (const _ in this.user) {
        if (_ === 'isValid' || !this.user[_].hasVal) continue
        const value = String(this.user[_].$val)

        if (value) {
          if (_ !== 'currentPassword') {
            if (_ === 'newPassword') {
              if (value.length < this.user[_].minLength) this.user[_].$error = this.user[_].errors.minLength
              else if (value === this.user.currentPassword.$val) this.user[_].$error = this.user[_].errors.isEqual
              else this.user[_].$error = ''
            }
            if (_ === 'confirmPassword') this.user[_].$error = value !== this.user.newPassword.$val ? this.user[_].errors.notEqual : ''
          } else this.user[_].$error = ''
        } else this.user[_].$error = this.user[_].errors.required
      }

      this.user.isValid = !this.user.currentPassword.$error && !this.user.newPassword.$error && !this.user.confirmPassword.$error
    },
    input: function (name) {
      if (['currentPassword', 'newPassword', 'confirmPassword'].includes(name)) this.user[name].hasVal = true
      this.validate()
    }
  }
}
function add () {
  return {
    activationKey: {
      hasVal: false,
      $val: '',
      $error: false,
      minLength: 36,
      errors: {
        minLength: 'Activation Key must contain 36 characters'
      },
      isValid: false
    },
    isLoading: false,
    submit: async function () {
      this.activationKey.hasVal = true
      this.validate()

      if (this.activationKey.isValid) {
        this.isLoading = true
        await createSub({ activationKey: this.activationKey.$val }).finally(() => this.isLoading = false)
      }
    },
    validate: function () {
      if (!this.activationKey.hasVal) return
      this.activationKey.$error = this.activationKey.$val.length < this.activationKey.minLength ? this.activationKey.errors.minLength : ''

      this.activationKey.isValid = !this.activationKey.$error
    },
    input: function (name) {
      if (['activationKey'].includes(name)) this.activationKey.hasVal = true
      this.validate()
    }
  }
}

function updatePassword (data) {
  request({
    method: 'put',
    url: 'user/profile/update-password',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'XSRF-Token': document.querySelector('meta[name="session-identifier"]').getAttribute('content'),
      'Content-Type': 'application/json'
    },
    data: data
  }).then(res => {
    if (res.status === 'ok' && res.message) {
      notify('success', { title: 'Success', message: res.message, redirect: '/auth/login' })
    } else notify('error', { title: 'Error', message: 'Something\'s wrong. Please try again later' })
  })
}
function createSub (data) {
  return request({
    method: 'post',
    url: 'user/subscriptions/create',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'XSRF-Token': document.querySelector('meta[name="session-identifier"]').getAttribute('content'),
      'Content-Type': 'application/json'
    },
    data: data
  }).then(res => {
    if (res.status === 'ok' && res.message) {
      notify('success', { title: 'Success', message: res.message })
    } else notify('error', { title: 'Error', message: 'Something\'s wrong. Please try again later' })
  })
}
