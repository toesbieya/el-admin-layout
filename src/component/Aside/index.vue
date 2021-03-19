<script>
/**
 * 侧边栏
 * 拆成Aside和DefaultSidebar是为了能让用户自定义侧边栏内容
 */

import {appGetters, asideGetters} from "../../store"
import DefaultSidebar from './DefaultSidebar'

export default {
    name: 'Aside',

    computed: {
        //移动端下不能设置z-index，否则会被el-drawer的遮罩遮住
        style() {
            return appGetters.isMobile ? 'z-index: unset !important' : undefined
        }
    },

    render(h) {
        const {defaultSlot} = asideGetters

        return (
            <aside class={`aside ${asideGetters.theme}`} style={this.style}>
                {defaultSlot ? defaultSlot(h) : <DefaultSidebar ref="default-sidebar"/>}
            </aside>
        )
    }
}
</script>
