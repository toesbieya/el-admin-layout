<template>
    <ul v-show="value" class="context-menu" :style="style">
        <li v-for="i in menuItems" :key="i.content" class="context-menu-item" @click="i.click">
            {{ i.content }}
        </li>
    </ul>
</template>

<script type="text/jsx">

export default {
    name: "ContextMenu",

    props: {
        value: Boolean,
        items: Array,
        left: Number,
        top: Number
    },

    data() {
        return {
            realLeft: '0px',
            realTop: '0px'
        }
    },

    computed: {
        style() {
            return {left: this.realLeft, top: this.realTop}
        },

        menuItems() {
            return this.items.filter(Boolean)
        }
    },

    watch: {
        value(v) {
            document.body[v ? 'addEventListener' : 'removeEventListener']('click', this.close)
            v && this.$nextTick(this.autoAdapt)
        },
        left(v) {
            v && this.autoAdaptLeft(v)
        },
        top(v) {
            v && this.autoAdaptTop(v)
        }
    },

    methods: {
        close() {
            this.$emit('input', false)
        },
        autoAdapt() {
            this.autoAdaptTop(this.top)
            this.autoAdaptLeft(this.left)
        },
        autoAdaptTop(v) {
            if (!this.value) return

            const elOffsetHeight = this.$el.offsetHeight

            if (elOffsetHeight > document.body.clientHeight - v && v > elOffsetHeight) {
                this.realTop = v - elOffsetHeight + 'px'
            }
            else this.realTop = v + 'px'
        },
        autoAdaptLeft(v) {
            if (!this.value) return

            const elOffsetWidth = this.$el.offsetWidth

            if (elOffsetWidth > document.body.clientWidth - v) {
                this.realLeft = v - elOffsetWidth + 'px'
            }
            else this.realLeft = v + 'px'
        }
    }
}
</script>
