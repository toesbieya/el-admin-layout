<script type="text/jsx">
import {pageGetters, pageMutations, tagsViewGetters} from "el-admin-layout"
import PageHeader from "./component/Header"
import PageView from "./component/View"
import PageIframe from "./component/Iframe"
import PageFooter from "./component/Footer"
import Breadcrumb from 'el-admin-layout/src/component/Breadcrumb'
import {isEmpty} from "el-admin-layout/src/util"
import {getRouterKey} from "el-admin-layout/src/config/logic"

export default {
    name: 'Page',

    components: {PageHeader, PageView, PageIframe, PageFooter, Breadcrumb},

    computed: {
        showHeader() {
            return pageGetters.showHeader && this.$route.meta.pageHeader !== false
        },
        showFooter() {
            return pageGetters.showFooter && this.$route.meta.pageFooter !== false
        },
        pageClass() {
            return {
                'page-content': true,
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
        const {header, footer} = this.$scopedSlots

        return (
            <main class="page-main">
                <div class={this.pageClass}>
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

                <page-iframe/>
            </main>
        )
    }
}
</script>
