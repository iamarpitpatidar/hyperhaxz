function menu () {
  return {
    isMenuOpen: false,
    toggleMenu: function () {
      this.isMenuOpen = !this.isMenuOpen
    }
  }
}
