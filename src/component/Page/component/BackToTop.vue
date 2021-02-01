<script type="text/jsx">
import {Const} from "el-admin-layout"

export default {
    name: 'BackToTop',

    render(h) {
        return (
            <el-backtop target=".page-main .scroll-container" visibility-height={400} bottom={66}>
                {Const.iconRenderer(h, 'el-icon-top')}
            </el-backtop>
        )
    }
}
</script>
