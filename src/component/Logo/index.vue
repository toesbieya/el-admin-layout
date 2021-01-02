<script type="text/jsx">
import {appGetters} from "el-admin-layout"

export default {
    name: 'Logo',

    functional: true,

    props: {showTitle: Boolean},

    render(h, context) {
        const {showTitle} = context.props

        const logoClass = {'logo-container': true, 'no-title': !showTitle}

        return (
            <div class={logoClass}>
                <router-link class="logo-link" to="/">
                    <img src={appGetters.logo}/>
                    {showTitle && <h1>{appGetters.title}</h1>}
                </router-link>
            </div>
        )
    }
}
</script>
