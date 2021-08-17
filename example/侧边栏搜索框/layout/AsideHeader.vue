<script>
import {appGetters, asideGetters} from 'el-admin-layout'
import MenuSearch from './MenuSearch'

export default {
    name: 'AsideHeader',

    functional: true,

    props: {default: Object},

    render(h, context) {
        return [
            context.props.default,
            !appGetters.isMobile && (
                <MenuSearch
                    v-show={!asideGetters.collapse}
                    on-search={context.parent.searchWordMutation}
                />
            )
        ]
    }
}
</script>
