<script>
import Aside from '../Aside'
import Header from '../Header'
import TagsView from '../TagsView'
import Page from '../Page'
import {appGetters, appMutations, tagsViewGetters} from "el-admin-layout"
import {isMobile} from "../../helper"
import {debounce} from "../../util"

export default {
    name: 'ElAdminLayout',

    provide() {
        return {
            elAdminLayout: this
        }
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

            const slots = this.$scopedSlots

            if (!slots) return result

            Object.entries(slots).forEach(([k, v]) => {
                const childName = childNames.find(i => k.startsWith(i))
                if (childName) {
                    //aside -> aside:{default:...}
                    if (childName.length === k.length) {
                        return result[childName].default = v
                    }

                    //aside-header -> aside:{header:...}
                    const childSlotName = [...k.slice(childName.length + 1)].join('')
                    result[childName][childSlotName] = v
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
