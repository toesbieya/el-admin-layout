<template>
    <div class="tab">
        <div class="tab-items">
            <div class="tab-item" v-for="i in items" @click="e => onClick(e, i.label)">{{ i.label }}</div>
        </div>

        <slot/>
    </div>
</template>

<script>
export default {
    name: "Tab",

    data: () => ({items: []}),

    methods: {
        onClick(e, label) {
            this.setActiveItem(e.target)
            this.setActivePanel(this.items.find(i => i.label === label).$el)
        },

        setActiveItem(dom) {
            if (this.$_activeItem) {
                this.$_activeItem.classList.remove('active')
            }
            dom.classList.add('active')
            this.$_activeItem = dom
        },
        setActivePanel(dom) {
            if (this.$_activePanel) {
                this.$_activePanel.classList.remove('active')
            }
            dom.classList.add('active')
            this.$_activePanel = dom
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.setActiveItem(this.$el.querySelector('.tab-item'))
            this.setActivePanel(this.$el.querySelector('.tab-panel'))
        })
    }
}
</script>

<style>
.tab-items{
    border-top: 1px dashed #dcdfe6;
    white-space: nowrap;
    overflow-x: auto;
}

.tab-item {
    display: inline-block;
    padding: 0 16px;
    font-size: 14px;
    line-height: 36px;
    box-sizing: border-box;
    cursor: pointer;
}

.tab-item:hover{
    color: #409eff;
}

.tab-item.active {
    border-bottom: 2px solid #409eff;
}

.tab-panel {
    display: none;
}

.tab-panel.active {
    display: unset;
}
</style>
