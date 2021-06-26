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
        let view = (
            <transition name={pageGetters.transition.curr} mode="out-in">
                <router-view key={this.routerViewKey}/>
            </transition>
        )

        if (tagsViewGetters.enabled && tagsViewGetters.enableCache) {
            view = <KeepViewAlive include={tagsViewGetters.cachedViews}>{view}</KeepViewAlive>
        }

        return <div class="page-view">{view}</div>
    }
}
</script>
