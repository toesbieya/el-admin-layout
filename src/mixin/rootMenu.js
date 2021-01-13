import menuMixin from "./menu"
import {appGetters, appMutations} from "el-admin-layout"
import {getMenuByFullPath} from "el-admin-layout/src/store/app"
import {isRedirectRouter} from "el-admin-layout/src/config/logic"

/**
 * 以深度优先找到根节点的第一个叶子节点，并判断是否有其他的叶子节点
 *
 * @param node
 * @param hasOtherLeaf
 * @returns {{hasOtherLeaf: boolean, leaf: ({children}|*)}|*}
 */
function findFirstLeaf(node, hasOtherLeaf = false) {
    if (!node || !node.children || node.children.length === 0) {
        return {leaf: node, hasOtherLeaf}
    }

    return findFirstLeaf(node.children[0], hasOtherLeaf || node.children.length > 1)
}

export default {
    mixins: [menuMixin],

    methods: {
        //点击根节点时
        onSelectRootMenu(index) {
            const root = getMenuByFullPath(index)

            //vue-router中对应index的路由可能有子级且未设置redirect，此时访问index会404
            const {leaf, hasOtherLeaf} = findFirstLeaf(root)

            //如果该根节点已激活且有多个叶子节点，退出
            if (!leaf || appGetters.activeRootMenu === index && hasOtherLeaf) {
                return
            }

            this.actionOnSelectMenu(leaf.fullPath)
        },

        //根据路由设置当前高亮的根节点
        setActiveRootMenu({matched: [root]} = this.$route) {
            //此处的path是路由定义中的原始数据，所以根路由不能使用动态匹配的方式定义（一般也不会有这种情况吧）
            //如果路由中使用了'/'，那么此处的path会是''
            root && appMutations.activeRootMenu(root.path || '/')
        },

        //路由变化时设置高亮根节点菜单，设置成功时返回true
        setActiveRootMenuWhenRouteChange(route) {
            const {matched} = route

            if (matched.length === 0 || isRedirectRouter(route)) {
                return false
            }

            this.setActiveRootMenu(route)

            return true
        }
    }
}
