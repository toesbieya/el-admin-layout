<script type="text/jsx">
import Aside from './component/Aside'
import Navbar from './component/Navbar'
import Page from './component/Page'
import {appGetters, pageGetters, tagsViewGetters} from "./store"

export default {
    name: 'ElAdminLayout',

    provide() {
        return {
            elAdminLayout: this
        }
    },

    props: {
        //传递给nav-bar的props
        navbarProps: Object,
        //传递给aside的props
        asideProps: Object,
        //传递给page的props
        pageProps: Object,

        //菜单图标的渲染方法（(h, {menu, depth}) => VNode），由子组件根据inject去取
        menuIconRenderer: {
            type: Function,
            default: (h, {menu}) => {
                const icon = menu.meta.icon
                return icon
                    ? h('i', {class: `menu-icon ${icon}`})
                    : undefined
            }
        },
        //自定义菜单内容的渲染方法（(h, {menu, highlight, context}) => VNode），由子组件根据inject去取
        menuItemContentRenderer: Function
    },

    computed: {
        isLeftRight() {
            return pageGetters.position === 'left-right'
        },
        renderAside() {
            return appGetters.isMobile || ['aside', 'aside-two-part', 'mix'].includes(appGetters.navMode)
        }
    },

    render() {
        const aside = this.renderAside && <Aside {...{props: this.asideProps}}/>
        const navbar = <Navbar {...{props: this.navbarProps}}/>

        return (
            <div class={{
                'el-admin-layout': true,
                'flex-column': !this.isLeftRight
            }}>
                {this.isLeftRight ? aside : navbar}

                <div class={{
                    'el-admin-layout': true,
                    'has-nav': true,
                    'flex-column': this.isLeftRight,
                    'has-tags-view': tagsViewGetters.enabled
                }}>
                    {this.isLeftRight ? navbar : aside}
                    <Page {...{props: this.pageProps}}/>
                </div>

                {this.$scopedSlots.default && this.$scopedSlots.default()}
            </div>
        )
    }
}
</script>
