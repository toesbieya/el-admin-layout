<script type="text/jsx">
//TODO 移除内置的菜单搜索，由外部自行实现
import {asideGetters} from "el-admin-layout"
import DefaultSidebar from './component/DefaultSidebar'
import props from './props'

export default {
    name: 'Aside',

    props: props(),

    render() {
        const {default: slot} = this.$scopedSlots

        return (
            <aside class={`aside ${asideGetters.theme}`}>
                {slot ? slot(this.$props) : <DefaultSidebar {...{props: this.$props}}/>}
            </aside>
        )
    }
}
</script>
