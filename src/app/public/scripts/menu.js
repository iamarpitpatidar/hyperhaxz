function menu () {
  return {
    isMenuOpen: false,
    closeMenu: function () {
      this.isMenuOpen = false
    },
    openMenu: function () {
      this.isMenuOpen = true
    },
    handleClick: function () {
      if (this.isMenuOpen) this.closeMenu()
      else this.openMenu()
    },
    init () {
      window.addEventListener('mousedown', event => {
        const target = event.target
        const active = document.activeElement

        if (active.contains(target)) return
        if (this.isMenuOpen && document.getElementById('main').contains(target)) this.handleClick()
      })
    }
  }
}
