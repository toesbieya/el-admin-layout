import cssVar from "el-admin-layout/src/style/var.scss"

export default () => ({
    menus: Array,
    inlineIndent: {type: Number, default: parseFloat(cssVar.menuPadding)},
    switchTransition: {type: Boolean, default: true},
    switchTransitionName: {type: String, default: 'sidebar'}
})
