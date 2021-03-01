<template>
    <div v-show="showIframe" class="page-iframe">
        <iframe
            v-for="src in iframeList"
            v-show="src === currentIframe"
            :id="src"
            :key="src"
            :src="src"
            frameborder="0"
            height="100%"
            width="100%"
        />
    </div>
</template>

<script>
import {pageGetters, pageMutations, tagsViewGetters} from "el-admin-layout"
import {getRouterKey} from "@/config/logic"
import {isEmpty} from "@/util"

export default {
    name: "PageIframe",

    computed: {
        showIframe() {
            return pageGetters.showIframe
        },
        iframeList() {
            return pageGetters.iframeList
        },
        currentIframe() {
            return pageGetters.currentIframe
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

                pageMutations.closeIframe(from.meta.iframe, del)
            }

            //跳转至iframe页面时，打开iframe
            if (to.meta.iframe) {
                pageMutations.openIframe(to.meta.iframe)
            }
        }
    }
}
</script>
