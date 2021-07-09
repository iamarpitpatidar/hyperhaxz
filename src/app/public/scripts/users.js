function action (type, _id, data = '') {
  if (!['resetHWID', 'ban', 'unban', 'seller', 'role'].includes(type) || _id.length !== 24) return

  const button = document.getElementById(`${type}-${_id}`)
  button.disabled = true
  window.isXHRinProgress = true
  request({
    method: 'post',
    url: `/dashboard/users/${_id}/action`,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      t: document.querySelector('meta[name="session-identifier"]').getAttribute('content'),
      'Content-Type': 'application/json'
    },
    data: { type: type, data: data }
  }).then(res => {
    if (!res.message) return
    notify('success', {
      title: 'Success',
      message: res.message,
      redirect: '/dashboard/users',
      timeout: 2000
    })
  }).finally(() => {
    button.removeAttribute('disabled')
    window.isXHRinProgress = true
  })
}
