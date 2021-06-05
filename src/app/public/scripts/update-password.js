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
              this.user[_].$error = value.length < this.user[_].minLength ? this.user[_].errors.minLength : ''
              this.user[_].$error = value === this.user.currentPassword.$val ? this.user[_].errors.isEqual : ''
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

function updatePassword (data) {
  axios({
    method: 'put',
    url: '/user/update-password',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'XSRF-Token': document.querySelector('meta[name="session-identifier"]').getAttribute('content'),
      'Content-Type': 'application/json'
    },
    data: data
  }).then(res => res.data)
    .then(res => {
      if (res.status === 'ok' && res.message) {
        notify('success', { title: 'Success', message: res.message, redirect: '/auth/login' })
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
