<script type="text/jsx">
import {Const} from "el-admin-layout"
import KeepViewAlive from "./KeepViewAlive"

export default {
    name: "PageView",

    components: {KeepViewAlive},

    props: {
        //过渡动画的名称
        transitionName: String,

        //同keep-alive
        include: Array,

        //是否使用keep-alive
        cacheable: Boolean
    },

    render() {
        const {include, transitionName, cacheable} = this

        let view = (
            <transition name={transitionName} mode="out-in">
                <router-view key={Const.routerKeyGenerator(this.$route)}/>
            </transition>
        )

        if (cacheable) {
            view = <keep-view-alive include={include}>{view}</keep-view-alive>
        }

        return <div class="page-view">{view}</div>
    }
}
</script>
