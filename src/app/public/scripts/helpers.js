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
