<template>
    <div class="code-previewer">
        <div class="code-previewer-header"/>

        <iframe style="height:650px;width: 100%;border: 0"/>

        <div class="code-previewer-footer">
            <button title="重新加载iframe" @click="reload">
                <svg viewBox="0 0 1024 1024">
                    <path
                        d="M939.456 256.224c-16.672-5.984-34.976 2.72-40.896 19.36l-24.768 69.344c-28.992-65.312-74.784-122.72-133.088-165.92-185.376-137.28-449.408-99.776-588.384 83.648-67.264 88.768-95.616 198.176-79.84 308.032 15.84 110.304 74.208 207.776 164.352 274.496 75.424 55.808 163.808 82.752 251.456 82.752 128.032 0 254.56-57.44 336.992-166.272 36.48-48.128 61.472-102.08 74.208-160.416 3.776-17.248-7.136-34.304-24.416-38.08-17.216-3.712-34.304 7.104-38.08 24.416-10.784 49.184-31.872 94.752-62.72 135.456-117.888 155.52-341.92 187.232-499.392 70.72-76.288-56.48-125.664-138.912-139.072-232.16-13.344-92.8 10.656-185.248 67.488-260.288 117.856-155.584 341.792-187.424 499.328-70.848 57.024 42.24 99.84 100.608 122.976 166.624l-109.984-42.944c-16.416-6.368-35.008 1.696-41.44 18.176-6.432 16.48 1.728 35.008 18.176 41.44l161.856 63.2c3.808 1.472 7.744 2.208 11.616 2.208.544 0 1.024-.192 1.568-.224 1.216.128 2.432.64 3.648.64 13.12 0 25.472-8.16 30.112-21.248l57.632-161.184c5.984-16.672-2.688-35.008-19.328-40.928z"/>
                </svg>
            </button>
            <button title="在新标签页中打开" @click="openOnNewTab">
                <svg viewBox="0 0 1024 1024">
                    <path d="M832 128H640v64h146.752L521.376 457.376l45.248 45.248L832 237.248V384h64V128z"/>
                    <path
                        d="M768 832H192V256h352v-64H160a32 32 0 0 0-32 32v640a32 32 0 0 0 32 32h640a32 32 0 0 0 32-32V480h-64v352z"/>
                </svg>
            </button>

            <span style="flex: 1"/>

            <button title="显示/隐藏代码" @click="toggle">
                <svg viewBox="0 0 1024 1024">
                    <path
                        d="M318.578 819.2L17.067 512l301.51-307.2 45.512 45.511L96.71 512l267.38 261.689zm386.844 0l-45.51-45.511L927.288 512 659.91 250.311l45.511-45.511L1006.933 512zM540.786 221.867l55.75 11.15-113.379 569.116-55.75-11.093z"/>
                </svg>
            </button>
        </div>

        <div v-show="!collapse" class="code-previewer-source">
            <slot/>
        </div>
    </div>
</template>

<script>
const PreviewPrefix =
    process.env.NODE_ENV === 'production'
        ? 'https://toesbieya.cn/el-admin-layout/'
        : 'http://localhost:8079/'

export default {
    name: "CodePreviewer",

    props: {src: String},

    data: () => ({collapse: true}),

    computed: {
        realSrc() {
            return PreviewPrefix + this.src
        }
    },

    methods: {
        getIframe() {
            return this.$el.getElementsByTagName('iframe')[0]
        },

        reload() {
            const iframe = this.getIframe()
            console.log(iframe.src)
            iframe.src = iframe.getAttribute('src')
        },
        openOnNewTab() {
            window.open(this.realSrc)
        },
        toggle() {
            this.collapse = !this.collapse
        }
    },

    mounted() {
        const io = new window.IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return

                io.disconnect()
                this.getIframe().src = this.realSrc
            },
            {threshold: [0.25]}
        )

        io.observe(this.$el)
    }
}
</script>

<style lang="stylus">
.code-previewer
    width: 100%
    background-color: #fff
    border-radius: 6px
    overflow: hidden
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)

    &-header
        padding: 2px 6px
        background-color: #ebedf1

        &::before
            content: ''
            display: inline-block
            width: 12px
            height: 12px
            border-radius: 50%
            background-color: #fd6458
            box-shadow: 20px 0 0 #ffbf2b, 40px 0 0 #24cc3d

    &-footer
        display: flex
        height: 40px
        padding: 0 1em
        align-items: center
        border-top: 1px dashed #dcdfe6

        button
            font-size: 18px
            border: 0
            background-color: inherit
            cursor: pointer
            outline: none

            & + button
                margin-left: 5px

            &:hover
                color: #409eff

            svg
                width: 1em
                height: 1em
                vertical-align: middle
                fill: currentColor
                overflow: hidden

    &-source
        border-top: 1px dashed #dcdfe6

        div[class*="language-"]
            border-radius: 0 0 6px 6px
</style>
