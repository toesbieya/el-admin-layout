<script type="text/jsx">
import {asideGetters} from "el-admin-layout"
import DefaultSidebar from './DefaultSidebar'

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
