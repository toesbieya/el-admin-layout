<script type="text/jsx">
//TODO 移除内置的菜单搜索，由外部自行实现
import {asideGetters} from "el-admin-layout"
import DefaultSidebar from './component/DefaultSidebar'
import cssVar from "el-admin-layout/src/style/var.scss"

export default {
    name: 'Aside',

    props: {
        menus: Array,
        inlineIndent: {type: Number, default: parseFloat(cssVar.menuPadding)},
        switchTransition: {type: Boolean, default: true},
        switchTransitionName: {type: String, default: 'sidebar'}
    },

    render() {
        const {default: slot} = this.$scopedSlots

        return (
            <aside class={`aside ${asideGetters.theme}`}>
                {slot ? slot(this.$props) : <DefaultSidebar/>}
            </aside>
        )
    }
}
</script>
