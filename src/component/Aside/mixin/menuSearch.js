/**
 * 侧边栏搜索框混入
 */
import MenuSearch from '../component/MenuSearch'
import {isEmpty} from "el-admin-layout/src/util"

export default {
    components: {MenuSearch},

    methods: {
        handlerSearch(v) {
            const navMenuInstance = this.$refs['nav-menu']
            if (!navMenuInstance) return

            navMenuInstance.searchWord = isEmpty(v) ? v : v.trim()
        }
    }
}
