<script>
import {getRedirectPath} from "el-admin-layout/src/config"

export default {
    mounted() {
        const {fullPath} = this.$route
        this.$router.replace(fullPath.replace(new RegExp(getRedirectPath(), 'gm'), ''))
    },

    render: h => h()
}
</script>
