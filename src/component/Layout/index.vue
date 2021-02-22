<script type="text/jsx">
import Aside from '../Aside'
import Header from '../Header'
import TagsView from '../TagsView'
import Page from '../Page'
import {appGetters, tagsViewGetters} from "../../store"

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
        logoRenderer: Function,
        //点击logo容器时触发，会替换原有的逻辑
        onLogoClick: Function
    },

    computed: {
        isLeftRight() {
            return appGetters.struct === 'left-right'
        },
        renderAside() {
            return appGetters.isMobile || ['aside', 'aside-two-part', 'mix'].includes(appGetters.navMode)
        }
    },

    methods: {
        //从自身的$scopedSlots中获取以childName开头的slot
        getSlotsForChild(...childNames) {
            const result = childNames.reduce((obj, name) => {
                obj[name] = Object.create(null)
                return obj
            }, Object.create(null))

            if (!this.$scopedSlots) return result

            Object.entries(this.$scopedSlots).forEach(([k, v]) => {
                const childName = childNames.find(i => k.startsWith(i))
                if (childName) {
                    const lowerCase = k.charAt(childName.length).toLowerCase() + k.slice(childName.length + 1)
                    result[childName][lowerCase] = v
                }
            })

            return result
        }
    },

    render() {
        const {header, aside, page} = this.getSlotsForChild('header', 'aside', 'page')

        return (
            <div class={{
                'el-admin-layout': true,
                'has-header': true,
                'has-tags-view': tagsViewGetters.enabled,
                'left-right': this.isLeftRight
            }}>
                <Header {...{props: this.headerProps, scopedSlots: header}}/>

                {tagsViewGetters.enabled && <TagsView/>}

                {this.renderAside && <Aside {...{props: this.asideProps, scopedSlots: aside}}/>}

                <Page {...{props: this.pageProps, scopedSlots: page}}/>

                {this.$scopedSlots.default && this.$scopedSlots.default()}
            </div>
        )
    }
}
</script>
