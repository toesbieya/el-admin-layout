<script type="text/jsx">
//TODO 移除aside-two-part导航模式，由外部自行实现
//TODO 移除内置的菜单搜索，由外部自行实现
import DefaultSidebar from './component/DefaultSidebar'
import {asideGetters} from "el-admin-layout"
import cssVar from "el-admin-layout/src/style/var.scss"

export default {
    name: 'Aside',

    props: {
        inlineIndent: {type: Number, default: parseFloat(cssVar.menuPadding)},
        switchTransition: {type: Boolean, default: true},
        switchTransitionName: {type: String, default: 'sidebar'}
    },

    render() {
        const {default: slot} = this.$scopedSlots

        return (
            <aside class={`aside ${asideGetters.theme}`}>
                {slot ? slot(this.$props) : <DefaultSidebar {...{attrs: this.$props}}/>}
            </aside>
        )
    }
}
</script>
