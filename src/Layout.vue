<script type="text/jsx">
import Aside from './component/Aside'
import Navbar from './component/Navbar'
import Page from './component/Page'
import {appGetters, pageGetters, tagsViewGetters} from "./store"

function getSlotsForChild(scopedSlots, childNames) {
    const result = childNames.reduce((obj, name) => {
        obj[name] = Object.create(null)
        return obj
    }, Object.create(null))

    if (!scopedSlots) return result

    Object.entries(scopedSlots).forEach(([k, v]) => {
        const childName = childNames.find(i => k.startsWith(i))
        if (childName) {
            const lowerCase = k.charAt(childName.length).toLowerCase() + k.slice(childName.length + 1)
            result[childName][lowerCase] = v
        }
    })

    return result
}

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
        const childSlots = getSlotsForChild(context.scopedSlots, ['navbar', 'aside', 'page'])

        const isLeftRight = pageGetters.position === 'left-right'
        const renderAside = appGetters.isMobile || ['aside', 'aside-two-part', 'mix'].includes(appGetters.navMode)

        const aside = renderAside && <Aside {...{props: asideProps, scopedSlots: childSlots.aside}}/>
        const navbar = <Navbar {...{props: navbarProps, scopedSlots: childSlots.navbar}}/>

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
                    <Page {...{props: pageProps, scopedSlots: childSlots.page}}/>
                </section>
            </section>
        )
    }
}
</script>
