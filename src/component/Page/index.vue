<script type="text/jsx">
import {pageGetters, pageMutations, tagsViewGetters} from "el-admin-layout"
import PageHeader from "./component/Header"
import PageView from "./component/View"
import PageFooter from "./component/Footer"
import Breadcrumb from 'el-admin-layout/src/component/Breadcrumb'
import {isEmpty} from "el-admin-layout/src/util"
import {getRouterKey} from "el-admin-layout/src/config/logic"

export default {
    name: 'Page',

    inject: {
        elAdminLayout: {
            default: {
                pageProps: {},
                $scopedSlots: {}
            }
        }
    },

    components: {PageHeader, PageView, PageFooter, Breadcrumb},

    computed: {
        //Layout中的pageHeader插槽
        headerSlot() {
            return this.elAdminLayout.$scopedSlots.pageHeader
        },
        //自定义渲染页头的方法，入参为h：createElement
        renderHeader() {
            return this.elAdminLayout.pageProps.renderHeader
        },
        //Layout中的pageFooter插槽
        footerSlot() {
            return this.elAdminLayout.$scopedSlots.pageFooter
        },
        //自定义渲染页脚内容的方法，入参为h：createElement
        renderFooter() {
            return this.elAdminLayout.pageProps.renderFooter
        },

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
                'has-page-footer': this.showFooter
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
                const key = getRouterKey(from)
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
                <div v-show={!showIframe} class={this.pageClass}>
                    {this.showHeader && (
                        <page-header>
                            {this.headerSlot
                                ? this.headerSlot()
                                : this.renderHeader
                                    ? this.renderHeader()
                                    : <breadcrumb/>}
                        </page-header>
                    )}

                    <page-view
                        include={cachedViews}
                        transition-name={transition.curr}
                        cacheable={enableTagsView && enableTagsViewCache}
                    />

                    {this.showFooter && (this.footerSlot || this.renderFooter) && (
                        <page-footer>
                            {this.footerSlot ? this.footerSlot() : this.renderFooter()}
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
            </main>
        )
    }
}
</script>
