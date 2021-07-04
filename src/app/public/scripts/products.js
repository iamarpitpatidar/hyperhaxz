function purge () {
  const token = document.querySelector('meta[name="session-identifier"]').getAttribute('content')
  window.location.assign(`products/purge?t=${token}`)
}
