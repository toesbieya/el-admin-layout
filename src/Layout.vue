<script type="text/jsx">
import VAside from './component/Aside'
import VNavbar from './component/Navbar'
import VPage from './component/Page'
import {appGetters, pageGetters, tagsViewGetters} from "./store"

export default {
    name: 'ElAdminLayout',

    functional: true,

    props: {
        //传递给nav-bar的props
        navbarProps: Object,

        //传递给aside的props
        asideProps: Object,

        //传递给page的props
        pageProps: Object
    },

    render(h, context) {
        const {navbarProps, asideProps, pageProps} = context.props
        const isLeftRight = pageGetters.position === 'left-right'
        const renderAside = appGetters.isMobile || ['aside', 'aside-two-part', 'mix'].includes(appGetters.navMode)

        const aside = renderAside && <VAside {...{props: asideProps}}/>
        const navbar = <VNavbar {...{props: navbarProps}}/>

        return (
            <section class={{
                'app-wrapper': true,
                'flex-column': !isLeftRight
            }}>
                {isLeftRight ? aside : navbar}

                <section class={{
                    'main-container': true,
                    'has-nav': true,
                    [`nav-mode-${appGetters.navMode}`]: true,
                    'flex-column': isLeftRight,
                    'has-tags-view': tagsViewGetters.enabled
                }}>
                    {isLeftRight ? navbar : aside}
                    <VPage {...{props: pageProps}}/>
                </section>
            </section>
        )
    }
}
</script>
