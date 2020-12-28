<script type="text/jsx">
import VAside from './component/Aside'
import VNavbar from './component/Navbar'
import VPage from './component/Page'
import {appGetters, pageGetters, tagsViewGetters} from "./store"

export default {
    name: 'ElAdminLayout',

    components: {VAside, VNavbar, VPage},

    props: {
        //传递给nav-bar的props
        navbarProps: Object,

        //传递给page的props
        pageProps: Object
    },

    computed: {
        isLeftRight() {
            return pageGetters.position === 'left-right'
        },
        renderAside() {
            return appGetters.isMobile || ['aside', 'aside-two-part', 'mix'].includes(appGetters.navMode)
        },
        wrapperClass() {
            return {
                'app-wrapper': true,
                'flex-column': !this.isLeftRight
            }
        },
        containerClass() {
            return [
                'main-container',
                'has-nav',
                `nav-mode-${appGetters.navMode}`,
                this.isLeftRight && 'flex-column',
                tagsViewGetters.enabled && 'has-tags-view'
            ]
        }
    },

    render() {
        const aside = this.renderAside && <v-aside/>
        const navbar = <v-navbar {...{props: this.navbarProps}}/>

        return (
            <section class={this.wrapperClass}>
                {this.isLeftRight ? aside : navbar}

                <section class={this.containerClass}>
                    {this.isLeftRight ? navbar : aside}
                    <v-page {...{props: this.pageProps}}/>
                </section>
            </section>
        )
    }
}
</script>
