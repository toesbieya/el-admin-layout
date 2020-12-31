import {getRedirectPath} from "el-admin-layout/src/config"
import {pageMutations} from "el-admin-layout/src/store"

export default {
    methods: {
        iframeCtrl(to, from) {
            //从iframe页面离开时，判断是否需要删除iframe
            if (from.meta.iframe) {
                //如果设置了无缓存或是进行了刷新，那么移除iframe
                const del = from.meta.noCache || to.path === `${getRedirectPath()}${from.path}`

                pageMutations.closeIframe({src: from.meta.iframe, del})
            }

            //跳转至iframe页面时，打开iframe
            if (to.meta.iframe) {
                pageMutations.openIframe({src: to.meta.iframe})
            }
        }
    }
}
