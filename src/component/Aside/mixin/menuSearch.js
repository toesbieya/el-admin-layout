/**
 * 侧边栏搜索框混入
 */
import MenuSearch from '../component/MenuSearch'
import {isEmpty} from "el-admin-layout/src/util"

export default {
    components: {MenuSearch},

    methods: {
        $_getNavMenuInstance() {
            return this.$refs['nav-menu']
        },

        handlerSearch(v) {
            this.$_getNavMenuInstance().searchWord = isEmpty(v) ? v : v.trim()
        }
    }
}
