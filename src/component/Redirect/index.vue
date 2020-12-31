<script>
import {getRedirectPath} from "../../config"

export default {
    mounted() {
        const {fullPath} = this.$route
        this.$router.replace(fullPath.replace(new RegExp(getRedirectPath(), 'gm'), ''))
    },

    render: h => h()
}
</script>
