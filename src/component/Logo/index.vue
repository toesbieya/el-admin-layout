<script>
import {appGetters} from "el-admin-layout"
import {isEmpty} from "el-admin-layout/src/util"

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
        const src = appGetters.logo, txt = appGetters.title

        const img = src && <img src={src}/>
        const title = !isEmpty(txt) && this.showTitle && <h1>{txt}</h1>

        const {logo} = this.elAdminLayout.$scopedSlots
        const children = logo ? logo({img, title, context: this}) : [img, title]

        if (!children || Array.isArray(children) && children.filter(Boolean).length === 0) {
            return
        }

        const {onLogoClick} = this.elAdminLayout

        return (
            <div
                class="logo-container"
                on-click={onLogoClick ? onLogoClick : this.onClick}
            >
                {children}
            </div>
        )
    }
}
</script>
