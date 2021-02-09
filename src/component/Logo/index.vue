<script type="text/jsx">
//TODO 增加logoRenderer属性和logo插槽
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

    computed: {
        //Layout中的logo插槽
        logoSlot() {
            return this.elAdminLayout.$scopedSlots.logo
        },
        //Layout中的logoRenderer属性
        logoRenderer() {
            return this.elAdminLayout.logoRenderer
        },
    },

    methods: {
        onClick(e) {
            if (this.elAdminLayout.onLogoClick) {
                return this.elAdminLayout.onLogoClick(e)
            }

            const to = appGetters.logoRoute
            const method = typeof to === 'object' && to.replace ? 'replace' : 'push'

            this.$router[method](to, () => undefined)
        }
    },

    render(h) {
        let children

        //优先使用插槽
        if (this.logoSlot) {
            children = this.logoSlot({context: this})
        }
        else {
            const img = <img src={appGetters.logo}/>
            const title = this.showTitle && <h1>{appGetters.title}</h1>

            if (this.logoRenderer) {
                children = this.logoRenderer(h, {img, title, context: this})
            }
            else children = [img, title]
        }

        return (
            <div class="logo-container" on-click={this.onClick}>
                {children}
            </div>
        )
    }
}
</script>
