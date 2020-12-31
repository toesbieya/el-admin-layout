/**
 * 多页签持久化混入
 * 初始化时读取本地存储中的数据
 * 页签变化时写入本地存储
 */

import {tagsViewGetters, tagsViewMutations} from "el-admin-layout/src/store"
import {debounce} from "@example/util"
import {getTagsView, setTagsView} from "@example/util/storage"

export default {
    computed: {
        visitedViews: () => tagsViewGetters.visitedViews
    },

    watch: {
        'setting.tagsView.persistent': {
            immediate: true,
            handler(v) {
                //尝试清除之前的watch
                if (this.watchVisitedViewsCallback) {
                    this.watchVisitedViewsCallback()
                    this.watchVisitedViewsCallback = null
                }

                //停用持久化时清空本地存储的页签数据
                if (!v) return setTagsView()

                //启用时先存储一次（仅在mounted后，否则此时页签数据不完整）
                this._isMounted && this.persistentTagsView(tagsViewGetters.visitedViews)

                this.watchVisitedViewsCallback = this.$watch('visitedViews', this.persistentTagsView)
            }
        }
    },

    beforeCreate() {
        this.persistentTagsView = debounce(setTagsView)
    },

    mounted() {
        if (!this.setting.tagsView.persistent) return

        const tags = getTagsView()
        Array.isArray(tags) && tags.forEach(tagsViewMutations.addTagOnly)
    }
}
