<script>
import CachedRouterView from '../../component/CachedRouterView'
import Breadcrumb from '../../component/Breadcrumb'
import { pageGetters } from '../../store'

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
    showHeader() {
      return pageGetters.showHeader && this.$route.meta.pageHeader !== false
    },
    showFooter() {
      return pageGetters.showFooter && this.$route.meta.pageFooter !== false
    }
  },

  render(h) {
    const { headerSlot, footerSlot } = pageGetters
    const showFooter = this.showFooter && footerSlot

    const className = {
      'page-content': true,
      'has-page-header': this.showHeader,
      'has-page-footer': showFooter
    }

    return (
      <div class={className}>
        {this.showHeader && (
          <PageHeader>
            {headerSlot ? headerSlot(h) : <Breadcrumb/>}
          </PageHeader>
        )}

        <CachedRouterView class="page-view"/>

        {showFooter && <PageFooter>{footerSlot(h)}</PageFooter>}
      </div>
    )
  }
}
</script>
