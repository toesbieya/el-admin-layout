<script type="text/jsx">
import {Const, pageGetters, pageMutations, tagsViewGetters} from "el-admin-layout"
import BackToTop from "./component/BackToTop"
import PageHeader from "./component/Header"
import PageView from "./component/View"
import PageFooter from "./component/Footer"
import TagsView from 'el-admin-layout/src/component/TagsView'
import {isEmpty} from "el-admin-layout/src/util"

export default {
    name: 'Page',

    components: {BackToTop, PageHeader, PageView, PageFooter, TagsView},

    props: {
        //自定义渲染页头的方法，入参为h：createElement
        renderHeader: Function,
        //自定义渲染页脚内容的方法，入参为h：createElement
        renderFooter: Function
    },

    computed: {
        showHeader() {
            return pageGetters.showHeader && this.$route.meta.pageHeader !== false
        },
        showFooter() {
            return pageGetters.showFooter && this.$route.meta.pageFooter !== false
        },
        pageClass() {
            return {
                'scroll-container': true,
                'has-page-header': this.showHeader,
                'has-page-footer': true
            }
        }
    },

    watch: {
        $route: {
            handler(to, from) {
                this.iframeCtrl(to, from)
            },
            immediate: true
        }
    },

    methods: {
        //路由跳转时控制iframe的显隐
        iframeCtrl(to, from) {
            //从iframe页面离开时，判断是否需要删除iframe
            if (from && from.meta.iframe) {
                const key = Const.routerKeyGenerator(from)
                const del = isEmpty(key) || !tagsViewGetters.cachedViews.includes(key)

                pageMutations.closeIframe({src: from.meta.iframe, del})
            }

            //跳转至iframe页面时，打开iframe
            if (to.meta.iframe) {
                pageMutations.openIframe({src: to.meta.iframe})
            }
        }
    },

    render() {
        const {transition, showIframe, iframeList, currentIframe} = pageGetters
        const {cachedViews, enabled: enableTagsView, enableCache: enableTagsViewCache} = tagsViewGetters

        return (
            <main class="page-main">
                {enableTagsView && <tags-view/>}

                <div v-show={!showIframe} class={this.pageClass}>
                    {this.showHeader && (
                        this.renderHeader
                            ? this.renderHeader()
                            : <page-header/>
                    )}

                    <page-view
                        include={cachedViews}
                        transition-name={transition.curr}
                        cacheable={enableTagsView && enableTagsViewCache}
                    />

                    {this.showFooter && this.renderFooter && (
                        <page-footer>
                            {this.renderFooter()}
                        </page-footer>
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
