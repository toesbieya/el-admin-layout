<template>
    <div class="horizontal-scroller" @wheel="handleScroll">
        <slot/>
    </div>
</template>

<script>
export default {
    name: 'HorizontalScroller',

    props: {
        //元素之间的距离（px）
        between: {type: Number, default: 4}
    },

    methods: {
        handleScroll(e) {
            const eventDelta = e.deltaY
            const {scrollLeft, scrollWidth, clientWidth} = this.$el

            /**
             * ①滚轮向上滚动并且是最左边
             * ②滚轮向下滚动并且是最右边
             */
            if (eventDelta < 0 && scrollLeft === 0
                || eventDelta > 0 && scrollWidth <= scrollLeft + clientWidth) {
                return
            }

            this.$el.scrollLeft += eventDelta
        },

        moveToTarget(target) {
            const nodes = Array.from(this.$el.children)
            const {offsetWidth: containerWidth, scrollWidth, scrollLeft} = this.$el

            if (containerWidth >= scrollWidth) return

            let first = null
            let last = null

            // find first el and last el
            if (nodes.length > 0) {
                first = nodes[0]
                last = nodes[nodes.length - 1]
            }

            if (first === target) {
                return this.scrollLeft(0)
            }
            if (last === target) {
                return this.scrollLeft(scrollWidth - containerWidth)
            }

            // find prev and next
            const currentIndex = nodes.findIndex(item => item === target)
            const prev = nodes[currentIndex - 1]
            const next = nodes[currentIndex + 1]

            // the el's offsetLeft after of next
            const afterNextOffsetLeft = next.offsetLeft + next.offsetWidth + this.between

            // the el's offsetLeft before of prev
            const beforePrevOffsetLeft = prev.offsetLeft - this.between

            if (afterNextOffsetLeft > scrollLeft + containerWidth) {
                this.scrollLeft(afterNextOffsetLeft - containerWidth)
            }
            else if (beforePrevOffsetLeft < scrollLeft) {
                this.scrollLeft(beforePrevOffsetLeft)
            }
        },

        scrollLeft(val) {
            this.$el.scrollTo({left: val, behavior: 'smooth'})
        }
    }
}
</script>
