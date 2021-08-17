<script>
import {Const} from '../../config'
import Aside from '../Aside'
import Header from '../Header'
import TagsView from '../TagsView'
import Page from '../Page'
import {
    appGetters,
    appMutations,
    asideMutations,
    headerMutations,
    tagsViewGetters,
    tagsViewMutations,
    pageMutations
} from '../../store'
import {isMobile} from '../../helper'
import {debounce} from '../../util'

export default {
    name: 'ElAdminLayout',

    computed: {
        isLeftRight() {
            return appGetters.struct === 'left-right'
        },
        renderAside() {
            return appGetters.isMobile || ['aside', 'mix'].includes(appGetters.navMode)
        }
    },

    methods: {
        //render时调用，根据插槽的变化修改store数据
        mutateStoreSlot() {
            const cache = this.$_cachedScopedSlots
            const curr = this.$scopedSlots

            //减少的
            Object.keys(cache).forEach(k => {
                //缓存中有，本次没有
                if (!curr[k]) {
                    const f = this.getMutationBySlot(k)
                    f(undefined)
                }
            })

            //新增的
            Object.keys(curr).forEach(k => {
                //本次有，缓存中没有
                if (!cache[k]) {
                    const f = this.getMutationBySlot(k)
                    //scopedSlots: (props) => VNode
                    //render: (h, props) => VNode
                    f((h, props) => curr[k](props))
                }
            })

            this.$_cachedScopedSlots = curr
        },
        getMutations(prefix) {
            switch (prefix) {
                case 'aside':
                    return asideMutations
                case 'header':
                    return headerMutations
                case 'page':
                    return pageMutations
            }
        },
        getMutationBySlot(slot) {
            const cache = this.$_slotMutationsMap

            if (cache[slot]) return cache[slot]

            //不规则的
            if (slot === 'logo') {
                cache[slot] = appMutations.logoSlot
                return cache[slot]
            }
            if (slot === 'tags-view-item') {
                cache[slot] = tagsViewMutations.itemSlot
                return cache[slot]
            }

            //aside -> asideMutations.defaultSlot
            //aside-header -> asideMutations.headerSlot
            //aside-menu-icon -> asideMutations.menuIconSlot
            const arr = slot.split('-')
            const mutations = this.getMutations(arr[0])

            if (arr.length === 1) {
                cache[slot] = mutations.defaultSlot
            }
            else {
                let method = arr[1]

                for (let i = 2, len = arr.length; i < len; i++) {
                    method += arr[i][0].toUpperCase() + [...arr[i].slice(1)].join('')
                }

                cache[slot] = mutations[method += 'Slot']
            }

            return cache[slot]
        }
    },

    beforeCreate() {
        //缓存当前的插槽
        this.$_cachedScopedSlots = Object.create(null)

        //用于加速根据插槽名查找store mutation的缓存map
        this.$_slotMutationsMap = Object.create(null)
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

        delete this.$_cachedScopedSlots
        delete this.$_slotMutationsMap
    },

    render() {
        Const.enableLayoutSlot && this.mutateStoreSlot()

        return (
            <div class={{
                'el-admin-layout': true,
                'has-header': true,
                'has-tags-view': tagsViewGetters.enabled,
                'left-right': this.isLeftRight
            }}>
                <Header ref="header"/>

                {tagsViewGetters.enabled && <TagsView ref="tags-view"/>}

                {this.renderAside && <Aside ref="aside"/>}

                <Page ref="page"/>
            </div>
        )
    }
}
</script>
