<script type="text/jsx">
import OnePart from './component/OnePart'
import TwoPartRoot from './component/TwoPart/root'
import TwoPartSub from './component/TwoPart/sub'
import {appGetters, asideGetters} from "el-admin-layout"

export default {
    name: 'Aside',

    inject: ['elAdminLayout'],

    render() {
        const defaultProps = {switchTransition: true, switchTransitionName: 'sidebar'}
        const attrs = Object.assign(defaultProps, this.elAdminLayout.asideProps)

        let children

        //移动端只能使用抽屉模式的单层侧边栏
        if (appGetters.isMobile) {
            children = <OnePart {...{attrs}}/>
        }
        else {
            switch (appGetters.navMode) {
                case 'mix':
                case 'aside':
                    children = <OnePart {...{attrs}}/>
                    break
                case 'aside-two-part':
                    children = [<TwoPartRoot/>, <TwoPartSub {...{attrs}}/>]
            }
        }

        return <aside class={`aside ${asideGetters.theme}`}>{children}</aside>
    }
}
</script>
