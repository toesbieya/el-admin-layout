<script lang="jsx">
/**
 * () => VNode  vs  VNode
 * 两者区别不大？直接返回VNode(h(...))并不会触发组件的渲染
 */
export default {
  components: {
    Child: {
      name: 'Child',

      beforeCreate() {
        console.log('child beforeCreate')
      },

      render() {
        console.log('child render')
        return <p>this is child</p>
      }
    }
  },

  methods: {
    // 调用该函数并不会触发child渲染
    f() {
      return <child/>
    }
  },

  render() {
    console.log('parent render')
    const { default: defaultSlot } = this.$scopedSlots
    return (
      <div>
        <p>this is parent</p>
        {/*defaultSlot中，传this.f还是this.f()基本没区别*/}
        {defaultSlot ? defaultSlot(this.f) : this.f()}
      </div>
    )
  }
}
</script>
