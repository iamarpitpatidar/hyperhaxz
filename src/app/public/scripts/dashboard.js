function sidebar () {
  return {
    active: null,
    init: function () {
      const pathArray = window.location.pathname.split('/')
      this.active = pathArray[pathArray.length - 1]
    }
  }
}
