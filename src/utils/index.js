export function register (component) {
  return {
    weexComponent: component,
    install: function (Vue) {
      Vue.component(component.name, component)
    }
  }
}
