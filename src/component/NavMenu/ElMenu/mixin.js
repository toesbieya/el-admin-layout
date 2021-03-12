/**
 * 在原基础上增加了 inlineIndent 属性，用于确定每级节点的单位缩进距离
 */
import {MenuItem} from 'element-ui'

export default {
    ...MenuItem.mixins[0],

    props: {
        inlineIndent: {
            type: Number, default: 20
        }
    },

    computed: {
        ...MenuItem.mixins[0].computed,

        paddingStyle() {
            if (this.rootMenu.mode !== 'vertical') return undefined

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
    }
}
