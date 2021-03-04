<template>
    <el-admin-layout/>
</template>

<script>
import ElAdminLayout, {appMutations, tagsViewGetters, tagsViewMutations} from 'el-admin-layout'
import menus from "@example/common/menu"
import {debounce} from "@example/common/util"

appMutations.title('持久化页签')
appMutations.menus(menus)

const STORAGE = window.sessionStorage
const KEY = 'eal-test-persist-tags'

export default {
    name: "Layout",

    components: {ElAdminLayout},

    methods: {
        getTags() {
            const data = STORAGE.getItem(KEY)
            return data ? JSON.parse(data) : []
        },
        setTags(data) {
            data ? STORAGE.setItem(KEY, JSON.stringify(data)) : STORAGE.removeItem(KEY)
        },
        //只需要关心fullPath和meta属性
        persist(data) {
            this.setTags(data.map(v => ({fullPath: v.fullPath, meta: v.meta})))
        }
    },

    beforeCreate() {
        //防抖处理
        this.persist = debounce(this.persist)
    },

    mounted() {
        //从本地存储中取数据，放到tagsViewStore中
        this.getTags().forEach(({fullPath, meta}) => {
            const {route} = this.$router.resolve(fullPath)
            //需要合并路由meta，优先使用持久化的meta的属性
            route && tagsViewMutations.addTagOnly({...route, meta: {...route.meta, ...meta}})
        })

        //页签变化时，将页签数据保存到本地存储
        //上面页签数据可能已经发生了变化，所以立即执行一次持久化
        this.$watch(() => tagsViewGetters.visitedViews, this.persist, {immediate: true})
    }
}
</script>
