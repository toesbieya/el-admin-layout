import MenuItemContent from './content'

function renderSingleMenu(h, {index, icon, title, highlight}) {
    return (
        <el-menu-item key={index} index={index}>
            <MenuItemContent icon={icon} title={title} highlight={highlight}/>
        </el-menu-item>
    )
}

function renderSubMenu(h, {index, icon, title, popperClass, highlight, children}) {
    return (
        <el-submenu key={index} index={index} popper-class={popperClass} popper-append-to-body>
            <MenuItemContent slot="title" icon={icon} title={title} highlight={highlight}/>
            {children}
        </el-submenu>
    )
}

function renderChildrenWithParentMenu(h, {icon, title, children}) {
    return [
        <div class="popover-menu__title el-menu-item">
            <MenuItemContent icon={icon} title={title}/>
        </div>,
        <div class="el-menu el-menu--inline">{children}</div>
    ]
}

export default function renderMenu(h, props) {
    const {
        menu,
        popperClass,
        highlight,
        showParent,
        collapse,
        showIconMaxDepth,
        depth = 1
    } = props

    const onlyOneChild = getOnlyChild(menu)

    const showSingle = onlyOneChild && !onlyOneChild.children

    if (showSingle) {
        const {fullPath, meta: {icon, title}} = onlyOneChild
        return renderSingleMenu(h, {
            index: fullPath,
            icon: getIcon({icon, showIconMaxDepth, depth}),
            title,
            highlight
        })
    }

    const {icon, title} = menu.meta

    let children = menu.children.map(child => renderMenu(h, {...props, menu: child, depth: depth + 1}))

    //弹出菜单显示父级信息
    if (collapse && showParent) {
        children = renderChildrenWithParentMenu(h, {icon, title, children})
    }

    return renderSubMenu(h, {
        index: menu.fullPath,
        icon: getIcon({icon, showIconMaxDepth, depth}),
        title,
        popperClass,
        highlight,
        children
    })
}

//根据showIconMaxDepth、depth判断是否需要限制图标的显示
function getIcon({icon, showIconMaxDepth, depth}) {
    if (showIconMaxDepth == null || showIconMaxDepth < 0) {
        return icon
    }
    return showIconMaxDepth < depth ? undefined : icon
}

//获取不需要嵌套展示的菜单
function getOnlyChild(menu) {
    const {children = [], meta: {alwaysShow} = {}} = menu

    if (!children.length) return {...menu, children: undefined}

    if (children.length === 1) return alwaysShow ? null : getOnlyChild(children[0])

    return null
}
