<script>
export default {
    data: () => ({flag: false}),

    components: {
        Child: {
            render(h) {
                console.log('child render')
                const {extra} = this.$scopedSlots

                return h('div', [
                    h('p', 'this is child'),
                    extra && extra(99)
                ])

                //jsx
                /*return (
                    <div>
                        <p>this is child</p>
                        {extra && extra()}
                    </div>
                )*/
            }
        }
    },

    methods: {
        triggerRender() {
            this.flag = !this.flag
        }
    },

    render(h) {
        console.log('parent render')

        //trigger the render
        if (this.flag) {

        }

        return h('div', [
            h('p', 'this is parent'),
            h(
                'button',
                {on: {click: this.triggerRender}},
                'click to trigger parent render'
            ),
            h('child', {scopedSlots: {extra: this.$scopedSlots.childExtra}})
        ])

        //jsx
        /*return (
            <div>
                <p>this is parent</p>
                <button on-click={this.triggerRender}>click to trigger parent render</button>
                <child {...{scopedSlots: this.childSlots}}/>
            </div>
        )*/
    }
}
</script>
