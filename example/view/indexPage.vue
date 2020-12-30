<template>
    <div>
        我是首页
        <input v-model="val"/>
    </div>
</template>

<script>
export default {
    name: 'indexPage',

    data() {
        return {
            val: ''
        }
    }
}
</script>
