<script>
import { appGetters } from '../../store'
import { isEmpty } from '../../util'

export default {
  name: 'Logo',

  props: { showTitle: Boolean },

  methods: {
    onClick(e) {
      const { onLogoClick } = appGetters
      if (onLogoClick) return onLogoClick(e)

      const to = appGetters.logoRoute
      const method = typeof to === 'object' && to.replace ? 'replace' : 'push'

      this.$router[method](to, () => undefined)
    }
  },

  render(h) {
    const { logo: src, title: txt, logoSlot } = appGetters

    const img = src && <img src={src}/>
    const title = !isEmpty(txt) && this.showTitle && <h1>{txt}</h1>

    const children = logoSlot ? logoSlot(h, { img, title, props: this.$props }) : [img, title]

    if (!children || Array.isArray(children) && children.filter(Boolean).length === 0) {
      return
    }

    return (
      <div class="logo-container" on-click={this.onClick}>
        {children}
      </div>
    )
  }
}
</script>
