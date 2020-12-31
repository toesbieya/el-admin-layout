<script type="text/jsx">
import {getIconRenderer} from "el-admin-layout/src/config"
import {isEmpty} from "el-admin-layout/src/util"

//获得高亮的菜单内容vnode
function getHighlightContent(h, title, highlight) {
    const start = title.indexOf(highlight)

    if (start === -1) return title

    const end = start + highlight.length

    return [
        title.substring(0, start),
        <span class="menu-highlight-result">{title.substring(start, end)}</span>,
        title.substring(end)
    ]
}

export default {
    functional: true,

    props: {
        icon: String,
        title: String,
        highlight: String
    },

    render(h, context) {
        const {icon, title, highlight} = context.props
        const content = isEmpty(highlight)
            ? title
            : getHighlightContent(h, title, highlight)

        return [
            getIconRenderer()(h, icon),
            <span slot="title" class="menu-item-content">{content}</span>
        ]
    }
}
</script>
