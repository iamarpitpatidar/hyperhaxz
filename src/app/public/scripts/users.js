function action (type, _id) {
  if (!['resetHWID', 'ban', 'unban'].includes(type) || _id.length !== 24) return

  const button = document.getElementById(`${type}-${_id}`)
  button.disabled = true
  request({
    method: 'post',
    url: `/dashboard/users/${_id}/action`,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'XSRF-Token': document.querySelector('meta[name="session-identifier"]').getAttribute('content'),
      'Content-Type': 'application/json'
    },
    data: { type: type }
  }).then(res => {
    if (!res.message) return
    notify('success', {
      title: 'Success',
      message: res.message,
      redirect: '/dashboard/users',
      timeout: 3000
    })
  }).finally(() => button.removeAttribute('disabled'))
}
