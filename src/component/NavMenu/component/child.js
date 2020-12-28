import MenuItem from './ElMenu/item'
import SubMenu from './ElMenu/sub'
import MenuItemContent from './content'

function renderSingleMenu(h, {index, inlineIndent, icon, title, highlight}) {
    return (
        <MenuItem key={index} index={index} inline-indent={inlineIndent}>
            <MenuItemContent icon={icon} title={title} highlight={highlight}/>
        </MenuItem>
    )
}

function renderSubMenu(h, {index, inlineIndent, icon, title, popperClass, highlight, children}) {
    return (
        <SubMenu key={index} index={index} inline-indent={inlineIndent} popper-class={popperClass}>
            <MenuItemContent slot="title" icon={icon} title={title} highlight={highlight}/>
            {children}
        </SubMenu>
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
        inlineIndent,
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
            inlineIndent,
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
        inlineIndent,
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
