<script>
import PageHeader from "./header"
import PageFooter from "./footer"
import PageView from "./view"
import Breadcrumb from '../../component/Breadcrumb'
import {pageGetters} from "../../store"

export default {
    name: "PageContent",

    components: {PageHeader, PageFooter, PageView, Breadcrumb},

    computed: {
        showHeader() {
            return pageGetters.showHeader && this.$route.meta.pageHeader !== false
        },
        showFooter() {
            return pageGetters.showFooter && this.$route.meta.pageFooter !== false
        },
        className() {
            return {
                'page-content': true,
                'has-page-header': this.showHeader,
                'has-page-footer': this.showFooter
            }
        }
    },

    render() {
        const {header, footer} = this.$parent.$scopedSlots

        return (
            <div class={this.className}>
                {this.showHeader && (
                    <page-header>
                        {header ? header() : <breadcrumb/>}
                    </page-header>
                )}

                <page-view/>

                {this.showFooter && footer && (
                    <page-footer>
                        {footer()}
                    </page-footer>
                )}
            </div>
        )
    }
}
</script>
