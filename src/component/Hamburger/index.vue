<script>
/**
 * 汉堡包，控制侧边栏的展开折叠状态（如果侧边栏是抽屉形式，则是显示和隐藏），用于侧边栏底部和顶栏左侧
 */

import {appGetters, asideGetters, asideMutations} from '../../store'

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
