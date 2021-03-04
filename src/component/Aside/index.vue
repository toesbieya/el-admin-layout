<script>
import {appGetters, asideGetters} from "el-admin-layout"
import DefaultSidebar from './DefaultSidebar'

export default {
    name: 'Aside',

    computed: {
        //移动端下不能设置z-index，否则会被el-drawer的遮罩遮住
        style() {
            return appGetters.isMobile ? 'z-index: unset !important' : undefined
        }
    },

    render() {
        const {default: slot} = this.$scopedSlots

        return (
            <aside class={`aside ${asideGetters.theme}`} style={this.style}>
                {slot ? slot() : <DefaultSidebar ref="default-sidebar"/>}
            </aside>
        )
    }
}
</script>
