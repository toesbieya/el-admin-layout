export default class HorizontalScroller {
  /**
   * @param el {HTMLElement=}
   */
  constructor(el) {
    this.$el = el
  }

  /**
   * 鼠标滚轮滚动事件
   * @param event {WheelEvent}
   * @param $el {HTMLElement=}
   */
  onWheel(event, $el = this.$el) {
    const { deltaY } = event
    const { scrollLeft, scrollWidth, clientWidth } = $el

    /**
     * 无法滚动的情况
     * ①滚轮向上滚动并且是最左边
     * ②滚轮向下滚动并且是最右边
     */
    if (deltaY < 0 && scrollLeft === 0
      || deltaY > 0 && scrollWidth <= scrollLeft + clientWidth) {
      return
    }

    // 为啥webstorm会提示'deltaY' should probably not be assigned to 'scrollLeft'
    $el.scrollLeft += (deltaY)
  }

  /**
   * 将指定元素以及其相邻元素移动至视窗内，外部调用
   * @param target {HTMLElement} 需要移动的指定元素
   * @param $el {HTMLElement=} 滚动容器
   * @param boundary {number=} 滚动后的元素距离容器边界的像素值
   */
  moveToTarget(target, $el = this.$el, boundary = 10) {
    const nodes = Array.from($el.children)

    // 容器无内容
    if (nodes.length === 0) return

    const { offsetWidth: containerWidth, scrollWidth, scrollLeft } = $el

    // 内容宽度不足以发生滚动
    if (containerWidth >= scrollWidth) return

    // 指定元素是第一个子级
    if (target === nodes[0]) {
      this.scrollLeft(0, $el)
      return
    }
    // 指定元素是最后一个子级
    if (target === nodes[nodes.length - 1]) {
      this.scrollLeft(scrollWidth - containerWidth, $el)
      return
    }

    // 找出指定元素是第几个子级
    const currentIndex = nodes.findIndex(node => node === target)
    // 指定元素的上一个子级
    const prev = nodes[currentIndex - 1]
    // 指定元素的后一个子级
    const next = nodes[currentIndex + 1]

    // 后一个子级的右边框距离容器最左侧的距离（加上边界距离）
    const afterNextOffsetLeft = next.offsetLeft + next.offsetWidth + boundary
    // 上一个子级的左边框距离容器最左侧的距离（加上边界距离）
    const beforePrevOffsetLeft = prev.offsetLeft - boundary

    // 后一个子级超出容器的右侧可视区
    if (afterNextOffsetLeft > scrollLeft + containerWidth) {
      this.scrollLeft(afterNextOffsetLeft - containerWidth, $el)
      return
    }
    // 上一个子级超出容器的左侧可视区
    if (beforePrevOffsetLeft < scrollLeft) {
      this.scrollLeft(beforePrevOffsetLeft, $el)
    }
  }

  /**
   * 滚动至距离容器左边框指定距离的位置
   * @param left {number}
   * @param $el {HTMLElement=}
   */
  scrollLeft(left, $el = this.$el) {
    $el.scrollTo({ left, behavior: 'smooth' })
  }
}
