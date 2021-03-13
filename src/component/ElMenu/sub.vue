<script>
/**
 * 改写el-submenu
 *
 * 移除了所有背景色、hover颜色，由样式控制
 * props中popperAppendToBody默认为true
 */

import MenuMixin from './mixin'
import {Submenu} from 'element-ui'

export default {
    name: Submenu.name,

    componentName: Submenu.componentName,

    mixins: [MenuMixin, ...Submenu.mixins.slice(1)],

    props: {
        ...Submenu.props,
        popperAppendToBody: {type: Boolean, default: true}
    },

    data: Submenu.data,

    computed: {
        appendToBody: Submenu.computed.appendToBody,
        menuTransitionName: Submenu.computed.menuTransitionName,
        opened: Submenu.computed.opened,
        active: Submenu.computed.active,
        mode: Submenu.computed.mode,
        isMenuPopup: Submenu.computed.isMenuPopup,
        isFirstLevel: Submenu.computed.isFirstLevel,
        className() {
            return {
                'el-submenu': true,
                'is-active': this.active,
                'is-opened': this.opened,
                'is-disabled': this.disabled
            }
        },
        submenuArrowClass() {
            const icon =
                this.rootMenu.mode === 'horizontal' && this.isFirstLevel
                || this.rootMenu.mode === 'vertical' && !this.rootMenu.collapse
                    ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
            return 'el-submenu__icon-arrow ' + icon
        },
        popupMenuClass() {
            return `el-menu el-menu--popup el-menu--popup-${this.currentPlacement}`
        }
    },

    watch: Submenu.watch,

    methods: Submenu.methods,

    created: Submenu.created,

    mounted: Submenu.mounted,

    beforeDestroy: Submenu.beforeDestroy,

    render() {
        return (
            <li
                class={this.className}
                on-mouseenter={this.handleMouseenter}
                on-mouseleave={() => this.handleMouseleave(false)}
                on-focus={this.handleMouseenter}
            >
                <div
                    ref="submenu-title"
                    class="el-submenu__title"
                    style={this.paddingStyle}
                    on-click={this.handleClick}
                >
                    {this.$slots.title}
                    <i class={this.submenuArrowClass}/>
                </div>
                {this.isMenuPopup
                    ? (
                        <transition name={this.menuTransitionName}>
                            <div
                                ref="menu"
                                v-show={this.opened}
                                class={[`el-menu--${this.mode}`, this.popperClass]}
                                on-mouseenter={e => this.handleMouseenter(e, 100)}
                                on-mouseleave={() => this.handleMouseleave(true)}
                                on-focus={e => this.handleMouseenter(e, 100)}
                            >
                                <ul class={this.popupMenuClass}>
                                    {this.$slots.default}
                                </ul>
                            </div>
                        </transition>
                    )
                    : (
                        <el-collapse-transition>
                            <ul v-show={this.opened} class="el-menu el-menu--inline">
                                {this.$slots.default}
                            </ul>
                        </el-collapse-transition>
                    )}
            </li>
        )
    }
}
</script>
