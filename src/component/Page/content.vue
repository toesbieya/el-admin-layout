<script>
import { pageGetters, tagsViewGetters } from '../../store'
import { getRouterKey } from '../../config/logic'
import Breadcrumb from '../../component/Breadcrumb'
import CachedRouterView from '../../component/CachedRouterView'

const PageHeader = {
  name: 'PageFooter',

  render(h) {
    return h('div', { staticClass: 'page-header' }, this.$slots.default)
  }
}
const PageFooter = {
  name: 'PageFooter',

  render(h) {
    return h('footer', { staticClass: 'page-footer' }, this.$slots.default)
  }
}

export default {
  name: 'PageContent',

  computed: {
    header() {
      const { showHeader, headerSlot } = pageGetters
      const { pageHeader } = this.$route.meta
      if (!showHeader || pageHeader === false) {
        return
      }

      const h = this.$createElement
      return h(PageHeader, headerSlot ? headerSlot(h) : [h(Breadcrumb)])
    },
    view() {
      const h = this.$createElement
      const transitionProps = pageGetters.enableTransition
        ? { name: pageGetters.transition.curr, mode: 'out-in' }
        : undefined
      const props = {
        cacheable: tagsViewGetters.enabled && tagsViewGetters.enableCache,
        transitionProps,
        keyFn: getRouterKey,
        includes: tagsViewGetters.cachedViews
      }
      return h(CachedRouterView, { staticClass: 'page-view', props })
    },
    footer() {
      const { showFooter, footerSlot } = pageGetters
      const { pageFooter } = this.$route.meta
      if (!showFooter || !footerSlot || pageFooter === false) {
        return
      }

      const h = this.$createElement
      return h(PageFooter, footerSlot(h))
    }
  },

  render(h) {
    const { header, view, footer } = this
    const className = {
      'page-content': true,
      'has-page-header': Boolean(header),
      'has-page-footer': Boolean(footer)
    }

    return h('div', { class: className }, [header, view, footer])
  }
}
</script>
