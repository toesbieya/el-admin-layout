import {getRedirectPath} from "./const"
import Redirect from '../component/Redirect'

/**
 * 注入默认的路由
 *
 * @param layout 你的layout组件
 * @returns {array}
 */
export function injectDefaultRoute(layout) {
    return [
        {
            path: getRedirectPath(),
            component: layout,
            children: [
                {
                    path: '*',
                    component: Redirect
                }
            ]
        }
    ]
}
