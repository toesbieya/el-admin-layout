<script type="text/jsx">
import {appGetters} from "el-admin-layout"

export default {
    name: 'Logo',

    props: {showTitle: Boolean},

    render() {
        const {showTitle} = this

        const logoClass = {'logo-container': true, 'no-title': !showTitle}

        return (
            <div class={logoClass}>
                <router-link class="logo-link" tag="div" to={appGetters.logoRoute}>
                    <img src={appGetters.logo}/>
                    {showTitle && <h1>{appGetters.title}</h1>}
                </router-link>
            </div>
        )
    }
}
</script>
