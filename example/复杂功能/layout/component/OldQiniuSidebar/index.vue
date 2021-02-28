<script>
import Root from './root'
import Sub from './sub'

export default {
    name: "OldQiniuSidebar",

    functional: true,

    render(h) {
        return [h(Root), h(Sub)]
    }
}
</script>
