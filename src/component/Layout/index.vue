<script>
import Aside from '../Aside'
import Header from '../Header'
import TagsView from '../TagsView'
import Page from '../Page'
import {appGetters, appMutations, tagsViewGetters} from "el-admin-layout"
import {isMobile} from "el-admin-layout/src/helper"
import {debounce} from "el-admin-layout/src/util"

export default {
    name: 'ElAdminLayout',

    provide() {
        return {
            elAdminLayout: this
        }
    },

    props: {
        //点击logo容器时触发，会替换原有的逻辑
        onLogoClick: Function
    },

    computed: {
        isLeftRight() {
            return appGetters.struct === 'left-right'
        },
        renderAside() {
            return appGetters.isMobile || ['aside', 'mix'].includes(appGetters.navMode)
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

    mounted() {
        this.$_resize = debounce(() => {
            !document.hidden && appMutations.isMobile(isMobile())
        })
        window.addEventListener('resize', this.$_resize)
    },

    beforeDestroy() {
        if (this.$_resize) {
            window.removeEventListener('resize', this.$_resize)
            delete this.$_resize
        }
    },

    render() {
        //TODO 此处需要优化，否则在自身render时，子组件也会强制render，见 https://codepen.io/toesbieya/pen/dyOJZZZ
        const {header, aside, page} = this.getSlotsForChild('header', 'aside', 'page')

        return (
            <div class={{
                'el-admin-layout': true,
                'has-header': true,
                'has-tags-view': tagsViewGetters.enabled,
                'left-right': this.isLeftRight
            }}>
                <Header ref="header" {...{scopedSlots: header}}/>

                {tagsViewGetters.enabled && <TagsView ref="tags-view"/>}

                {this.renderAside && <Aside ref="aside" {...{scopedSlots: aside}}/>}

                <Page ref="page" {...{scopedSlots: page}}/>
            </div>
        )
    }
}
</script>
