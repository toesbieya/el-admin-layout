<script type="text/jsx">
import {appGetters} from "el-admin-layout"

export default {
    name: 'Logo',

    inject: {
        elAdminLayout: {
            default: {
                $scopedSlots: {}
            }
        }
    },

    props: {showTitle: Boolean},

    methods: {
        onClick() {
            const to = appGetters.logoRoute
            const method = typeof to === 'object' && to.replace ? 'replace' : 'push'

            this.$router[method](to, () => undefined)
        }
    },

    render() {
        const img = <img src={appGetters.logo}/>
        const title = this.showTitle && <h1>{appGetters.title}</h1>
        const {$scopedSlots: {logo}, onLogoClick} = this.elAdminLayout

        return (
            <div class="logo-container" on-click={onLogoClick ? onLogoClick : this.onClick}>
                {logo ? logo({img, title, context: this}) : [img, title]}
            </div>
        )
    }
}
</script>
