function notify (type, options) {
  if (!['info', 'success', 'warning', 'error', 'show'].includes(type)) return
  iziToast[type]({
    title: options.title || type,
    message: options.message,
    closeOnEscape: true,
    closeOnClick: true,
    position: 'topRight',
    displayMode: 2,
    onClosed: function () {
      if (options.redirect) {
        window.location.replace(options.redirect)
      }
    }
  })
}

function request (options) {
  return new Promise((resolve, reject) => {
    axios(options)
      .then(res => res.data)
      .then(res => resolve(res))
      .catch(function (error) {
        reject(error.response.data.message)
        notify('error', {
          title: 'Error',
          message: error.response.data.message || 'Something\'s wrong. Please try again later'
        })
      })
  })
}
