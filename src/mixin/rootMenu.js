import {getRedirectPath} from "../config"
import {appGetters, appMutations} from "../store"
import menuMixin from "./menu"

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
            const root = appGetters.menus.find(i => i.fullPath === index)

            //vue-router中对应index的路由可能有子级且未设置redirect，此时访问index会404
            const {leaf, hasOtherLeaf} = findFirstLeaf(root)

            //如果该根节点已激活且有多个叶子节点，退出
            if (!leaf || appGetters.activeRootMenu === index && hasOtherLeaf) {
                return
            }

            //el-menu中的key即appStore中menus的对象的fullPath属性
            this.actionOnSelectMenu(leaf.fullPath)
        },

        //根据路由设置当前高亮的根节点
        setActiveRootMenu({matched: [root]} = this.$route) {
            root && appMutations.activeRootMenu(root.path || '/')
        },

        //路由变化时设置高亮根节点菜单，设置成功时返回true
        setActiveRootMenuWhenRouteChange(route) {
            const {path, matched} = route

            //使用redirect跳转 或 无匹配路由 时跳过
            if (path.startsWith(getRedirectPath()) || matched.length === 0) {
                return false
            }

            this.setActiveRootMenu(route)

            return true
        }
    }
}
