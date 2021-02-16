<script type="text/jsx">
import Aside from './component/Aside'
import Header from './component/Header'
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
        //传递给header的props
        headerProps: Object,
        //传递给aside的props
        asideProps: Object,
        //传递给page的props
        pageProps: Object,

        //菜单图标的渲染方法(h, {menu, depth}) => VNode
        menuIconRenderer: {
            type: Function,
            default: (h, {menu}) => {
                const icon = menu.meta.icon
                return icon
                    ? h('i', {class: `menu-icon ${icon}`})
                    : undefined
            }
        },
        //自定义菜单内容的渲染方法(h, {menu, highlight, context}) => VNode
        menuItemContentRenderer: Function,

        //自定义logo内容的渲染方法(h, {img:VNode, title:VNode, context}) => VNode
        logoRenderer:Function,
        //点击logo容器时触发，会替换原有的逻辑
        onLogoClick: Function
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
        const aside = this.renderAside && <Aside/>
        const header = <Header/>

        return (
            <div class={{
                'el-admin-layout': true,
                'flex-column': !this.isLeftRight
            }}>
                {this.isLeftRight ? aside : header}

                <div class={{
                    'el-admin-layout': true,
                    'has-header': true,
                    'flex-column': this.isLeftRight,
                    'has-tags-view': tagsViewGetters.enabled
                }}>
                    {this.isLeftRight ? header : aside}
                    <Page/>
                </div>

                {this.$scopedSlots.default && this.$scopedSlots.default()}
            </div>
        )
    }
}
</script>
