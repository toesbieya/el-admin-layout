<script>
import {Const} from "../../config"

export default {
    mounted() {
        const {fullPath} = this.$route
        this.$router.replace(fullPath.replace(new RegExp(Const.redirectPath, 'gm'), ''))
    },

    render: h => h()
}
</script>
