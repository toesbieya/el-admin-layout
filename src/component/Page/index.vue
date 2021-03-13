<template>
    <main class="page-main">
        <page-content/>

        <page-iframe/>
    </main>
</template>

<script>
import PageIframe from "./iframe"
import PageContent from "./content"

export default {
    name: 'Page',

    components: {PageContent, PageIframe}
}
</script>
