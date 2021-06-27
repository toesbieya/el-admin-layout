<script>
import {pageGetters, tagsViewGetters} from '../../store'
import {getRouterKey} from '../../config/logic'
import KeepViewAlive from '../../component/KeepViewAlive'

export default {
    name: 'PageView',

    computed: {
        routerViewKey() {
            return getRouterKey(this.$route)
        }
    },

    render() {
        let view = <router-view key={this.routerViewKey}/>

        //TODO 如果在开启缓存时关闭了过渡动画，那么KeepViewAlive组件会出问题
        if (pageGetters.enableTransition) {
            view = <transition name={pageGetters.transition.curr} mode="out-in">{view}</transition>
        }


        if (tagsViewGetters.enabled && tagsViewGetters.enableCache) {
            view = <KeepViewAlive include={tagsViewGetters.cachedViews}>{view}</KeepViewAlive>
        }

        return <div class="page-view">{view}</div>
    }
}
</script>
