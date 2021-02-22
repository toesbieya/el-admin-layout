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
import {pageGetters} from "el-admin-layout"

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
    }
}
</script>
