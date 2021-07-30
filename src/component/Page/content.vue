<script>
import PageHeader from './header'
import PageFooter from './footer'
import PageView from './view'
import Breadcrumb from '../../component/Breadcrumb'
import {pageGetters} from '../../store'

export default {
    name: 'PageContent',

    computed: {
        showHeader() {
            return pageGetters.showHeader && this.$route.meta.pageHeader !== false
        },
        showFooter() {
            return pageGetters.showFooter && this.$route.meta.pageFooter !== false
        }
    },

    render(h) {
        const {headerSlot, footerSlot} = pageGetters
        const showFooter = this.showFooter && footerSlot

        const className = {
            'page-content': true,
            'has-page-header': this.showHeader,
            'has-page-footer': showFooter
        }

        return (
            <div class={className}>
                {this.showHeader && (
                    <PageHeader>
                        {headerSlot ? headerSlot(h) : <Breadcrumb/>}
                    </PageHeader>
                )}

                <PageView/>

                {showFooter && <PageFooter>{footerSlot(h)}</PageFooter>}
            </div>
        )
    }
}
</script>
