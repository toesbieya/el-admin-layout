<template>
    <main class="page-main">
        <page-content/>

        <page-iframe/>
    </main>
</template>

<script>
import PageIframe from "./component/Iframe"
import PageContent from "./component/Content"

export default {
    name: 'Page',

    components: {PageContent, PageIframe}
}
</script>
