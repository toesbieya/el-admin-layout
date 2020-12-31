<script type="text/jsx">
import OnePart from './component/OnePart'
import TwoPartRoot from './component/TwoPart/root'
import TwoPartSub from './component/TwoPart/sub'
import {appGetters, asideGetters} from "el-admin-layout/src/store"

export default {
    functional: true,

    render() {
        let children

        //移动端只能使用抽屉模式的单层侧边栏
        if (appGetters.isMobile) {
            children = <OnePart/>
        }
        else {
            switch (appGetters.navMode) {
                case 'mix':
                case 'aside':
                    children = <OnePart/>
                    break
                case 'aside-two-part':
                    children = [<TwoPartRoot/>, <TwoPartSub/>]
            }
        }

        return <aside class={`aside ${asideGetters.theme}`}>{children}</aside>
    }
}
</script>
