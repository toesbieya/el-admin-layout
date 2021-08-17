<script>
import {appGetters} from 'el-admin-layout'
import Hamburger from 'el-admin-layout/src/component/Hamburger'

export default {
    name: 'HeaderLeft',

    //只有函数式组件可以返回多个节点
    functional: true,

    props: {default: Array},

    render(h, context) {
        return [
            ...context.props.default,
            //移动端时，顶栏已有默认的汉堡包
            !appGetters.isMobile && h(Hamburger, {class: 'header-item header-icon'})
        ]
    }
}
</script>
