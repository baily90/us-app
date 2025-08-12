const throttleClickFunc = (el, binding) => {
  el.addEventListener('click', () => {
    if (!el.disabled) {
      el.disabled = true
      setTimeout(() => {
        el.disabled = false
      }, binding.value || 1000)
    }
  })
}
export default {
  install(app) {
    app.directive('throttle', throttleClickFunc)
  },
}
