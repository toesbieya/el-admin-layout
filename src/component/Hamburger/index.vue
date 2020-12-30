<script type="text/jsx">
import {appGetters, asideGetters, asideMutations} from "el-admin-layout/store"

export default {
    name: 'Hamburger',

    render() {
        //考虑侧边栏可能是抽屉的情况
        const collapsed = appGetters.isMobile ? asideGetters.show : !asideGetters.collapse
        const className = `hamburger${collapsed ? ' collapsed' : ''}`

        return (
            <div
                class={className}
                title={`${collapsed ? '折叠' : '展开'}侧边栏`}
                on-click={asideMutations.switch}
            >
                <i class="el-icon-s-unfold"/>
            </div>
        )
    }
}
</script>
