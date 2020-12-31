<script type="text/jsx">
import OnePart from './component/OnePart'
import TwoPartRoot from './component/TwoPart/root'
import TwoPartSub from './component/TwoPart/sub'
import {appGetters, asideGetters} from "el-admin-layout/src/store"

export default {
    functional: true,

    render(h, context) {
        let children

        //移动端只能使用抽屉模式的单层侧边栏
        if (appGetters.isMobile) {
            children = <OnePart {...{attrs: context.props}}/>
        }
        else {
            switch (appGetters.navMode) {
                case 'mix':
                case 'aside':
                    children = <OnePart {...{attrs: context.props}}/>
                    break
                case 'aside-two-part':
                    children = [<TwoPartRoot/>, <TwoPartSub {...{attrs: context.props}}/>]
            }
        }

        return <aside class={`aside ${asideGetters.theme}`}>{children}</aside>
    }
}
</script>
