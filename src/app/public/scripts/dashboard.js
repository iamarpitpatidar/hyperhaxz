function sidebar () {
  return {
    active: null,
    init: function () {
      const pathArray = window.location.pathname.split('/')
      this.active = pathArray[pathArray.length - 1]
    }
  }
}

window.onload = function () {
  const tooltipButton = document.querySelectorAll('.has-tooltip')
  let hasTooltip = !1
  tooltipButton.forEach(each => {
    each.addEventListener('mouseover', elem => {
      if (!hasTooltip) {
        const tooltip = `<div class="relative"><div class="absolute top-0 z-10 py-2 px-4 -mt-1 text-sm text-gray-400 transform -translate-x-1/2 -translate-y-full bg-gray-900 rounded-lg shadow-lg width-max-content">${each.dataset.tooltip}</div></div>`
        each.insertAdjacentHTML('beforebegin', tooltip)
        hasTooltip = !0
      }
    })
    each.addEventListener('mouseleave', () => {
      if (hasTooltip) {
        each.previousElementSibling.remove()
        hasTooltip = !1
      }
    })
  })
}
