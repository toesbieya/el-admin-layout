/**
 * 在原基础上增加了 inlineIndent 属性，用于确定每级节点的单位缩进距离
 */
import original from 'element-ui/packages/menu/src/menu-mixin'

original.props = {inlineIndent: {type: Number, default: 20}}

original.computed.paddingStyle = function () {
    if (this.rootMenu.mode !== 'vertical') return {}

    let padding = this.inlineIndent

    if (!this.rootMenu.collapse) {
        let parent = this.$parent
        while (parent && parent.$options.componentName !== 'ElMenu') {
            if (parent.$options.componentName === 'ElSubmenu') {
                padding += this.inlineIndent
            }
            parent = parent.$parent
        }
    }

    return {'padding-left': `${padding}px`}
}

export default original
