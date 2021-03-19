<template>
    <main class="page-main">
        <page-content/>

        <page-iframe/>
    </main>
</template>

<script>
/**
 * 页面，拆成content、iframe、view等好几部分是为了避免额外渲染
 */

import PageIframe from "./iframe"
import PageContent from "./content"

export default {
    name: 'Page',

    components: {PageContent, PageIframe}
}
</script>
