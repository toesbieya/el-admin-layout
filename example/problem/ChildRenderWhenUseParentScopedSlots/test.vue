<script>
export default {
    render() {
        console.log('test render')
        const {default: slot} = this.$scopedSlots
        return (
            <div>
                <p>this is test</p>
                {slot && slot()}
            </div>
        )
    }
}
</script>
