<script type="text/jsx">
import {pageGetters, tagsViewGetters} from "el-admin-layout/src/store"
import iframeCtrlMixin from './mixin/iframeCtrl'
import BackToTop from "./component/BackToTop"
import PageHeader from "./component/Header"
import PageView from "./component/View"
import PageFooter from "./component/Footer"
import TagsView from './component/TagsView'

export default {
    name: 'Page',

    mixins: [iframeCtrlMixin],

    components: {BackToTop, PageHeader, PageView, PageFooter, TagsView},

    props: {
        //自定义渲染页脚的方法，入参为h：createElement
        renderFooter: Function
    },

    computed: {
        renderPageHeader() {
            return pageGetters.showPageHeader && this.$route.meta.pageHeader !== false
        },
        pageClass() {
            return {
                'scroll-container': true,
                'has-page-header': this.renderPageHeader,
                'has-page-footer': true
            }
        }
    },

    watch: {
        $route(to, from) {
            this.iframeCtrl(to, from)
        }
    },

    render() {
        const {transition, showIframe, iframeList, currentIframe} = pageGetters
        const {cachedViews, enabled: enableTagsView, enableCache: enableTagsViewCache} = tagsViewGetters

        return (
            <main class="page-main">
                {enableTagsView && <tags-view/>}

                <div v-show={!showIframe} class={this.pageClass}>
                    {this.renderPageHeader && <page-header/>}

                    <page-view
                        include={cachedViews}
                        transition-name={transition.curr}
                        cacheable={enableTagsView && enableTagsViewCache}
                    />

                    {this.renderFooter && (
                        <page-footer>{this.renderFooter()}</page-footer>
                    )}
                </div>

                {iframeList.map(src => (
                    <iframe
                        v-show={showIframe && src === currentIframe}
                        id={src}
                        key={src}
                        src={src}
                        frameborder="0"
                        height="100%"
                        width="100%"
                    />
                ))}

                {pageGetters.showBackToTop && <back-to-top/>}
            </main>
        )
    }
}
</script>
