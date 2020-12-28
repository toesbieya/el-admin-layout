//layout中渲染icon的方法，可替换
let ICON_RENDERER = (h, data) => h('i', data)

export function getIconRenderer() {
    return ICON_RENDERER
}

export function setIconRenderer(method) {
    ICON_RENDERER = method
}
