<script type="text/jsx">
import {appGetters, asideGetters} from "el-admin-layout"
import sidebarMixin from "../../mixin/sidebar"

export default {
    name: "SubSidebar",

    mixins: [sidebarMixin],

    computed: {
        //父级菜单
        rootMenu() {
            const active = appGetters.activeRootMenu
            return appGetters.menus.find(i => i.fullPath === active)
        },

        //侧边栏的折叠状态，true折叠、false展开
        collapse() {
            return asideGetters.collapse
        },

        className() {
            return {'sub-sidebar': true, 'collapse': this.collapse}
        }
    },

    render() {
        if (this.menus.length <= 0) return

        return (
            <div class={this.className}>
                {!this.collapse && (
                    <div class="sub-sidebar-title">
                        {this.rootMenu && this.rootMenu.meta.title}
                    </div>
                )}

                {asideGetters.search && <menu-search on-search={this.handlerSearch}/>}

                <nav-menu
                    ref="nav-menu"
                    menus={this.menus}
                    theme={asideGetters.theme}
                    collapse={this.collapse}
                    default-active={this.activeMenu}
                    unique-opened={asideGetters.uniqueOpen}
                    show-parent-on-collapse={asideGetters.showParentOnCollapse}
                    {...{props: this.$attrs}}
                    on-select={this.onSelect}
                />

                {this.renderHamburger && (
                    <div class="aside-action">
                        <hamburger/>
                    </div>
                )}
            </div>
        )
    }
}
</script>
