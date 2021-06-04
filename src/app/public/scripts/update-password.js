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
      this.isLoading = true
      for (const _ in this.user) {
        if (_ === 'isValid') continue
        this.user[_].hasVal = true
      }
      this.validate()

      if (this.user.isValid === true) {
        await updatePassword(this.user.newPassword.$val)
        this.isLoading = false
      }
    },
    validate: function () {
      for (const _ in this.user) {
        if (_ === 'isValid' || !this.user[_].hasVal) continue
        const value = String(this.user[_].$val)

        if (value) {
          if (_ !== 'currentPassword') {
            if (_ === 'newPassword') this.user[_].$error = value.length < this.user[_].minLength ? this.user[_].errors.minLength : ''
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

function updatePassword (password) {
  console.log(password)
}
