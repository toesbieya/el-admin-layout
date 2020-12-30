import cssVar from './style/var.scss'

//移动端的最大宽度，默认为scss中的$max-mobile-width变量，该值的变动并不能影响样式
let MAX_MOBILE_WIDTH = cssVar.maxMobileWidth

//layout中渲染icon的方法，可替换
let ICON_RENDERER = (h, icon) => h('i', {class: `icon ${icon}`})

export function getMaxMobileWidth() {
    return MAX_MOBILE_WIDTH
}

export function setMaxMobileWidth(val) {
    MAX_MOBILE_WIDTH = val
}

export function getIconRenderer() {
    return ICON_RENDERER
}

export function setIconRenderer(val) {
    ICON_RENDERER = val
}
