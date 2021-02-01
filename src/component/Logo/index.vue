<script type="text/jsx">
import {appGetters} from "el-admin-layout"

export default {
    name: 'Logo',

    props: {showTitle: Boolean},

    render() {
        return (
            <div class="logo-container">
                <router-link class="logo-link" tag="div" to={appGetters.logoRoute}>
                    <img src={appGetters.logo}/>
                    {this.showTitle && <h1>{appGetters.title}</h1>}
                </router-link>
            </div>
        )
    }
}
</script>
