<script type="text/jsx">
//TODO 移除内置的菜单搜索，由外部自行实现
import {asideGetters} from "el-admin-layout"
import DefaultSidebar from './component/DefaultSidebar'

export default {
    name: 'Aside',

    render() {
        const {default: slot} = this.$scopedSlots

        return (
            <aside class={`aside ${asideGetters.theme}`}>
                {slot ? slot() : <DefaultSidebar ref="default-sidebar"/>}
            </aside>
        )
    }
}
</script>
