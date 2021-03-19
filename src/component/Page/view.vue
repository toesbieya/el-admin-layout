<script>
import {pageGetters, tagsViewGetters} from "../../store"
import {getRouterKey} from "../../config/logic"
import KeepViewAlive from "../../component/KeepViewAlive"

export default {
    name: "PageView",

    render() {
        let view = (
            <transition name={pageGetters.transition.curr} mode="out-in">
                <router-view key={getRouterKey(this.$route)}/>
            </transition>
        )

        if (tagsViewGetters.enabled && tagsViewGetters.enableCache) {
            view = <KeepViewAlive include={tagsViewGetters.cachedViews}>{view}</KeepViewAlive>
        }

        return <div class="page-view">{view}</div>
    }
}
</script>
