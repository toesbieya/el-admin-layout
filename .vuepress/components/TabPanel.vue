<template>
    <div class="tab-panel">
        <slot/>
    </div>
</template>

<script>
export default {
    name: "TabPanel",

    props: {label: String},

    mounted() {
        this.$parent.items.push(this)
    }
}
</script>
