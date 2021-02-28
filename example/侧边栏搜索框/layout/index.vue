<template>
    <el-admin-layout ref="layout">
        <template v-slot:asideHeader="defaultContent">
            <aside-header :default="defaultContent"/>
        </template>

        <template v-slot:asideMenuContent="{menu}">
            <aside-menu-content :title="menu.meta.title" :search-word="searchWord"/>
        </template>
    </el-admin-layout>
</template>

<script type="text/jsx">
import ElAdminLayout, {appGetters, appMutations, asideGetters, asideMutations} from 'el-admin-layout'
import menus from "@example/common/menu"
import MenuSearch from './component/MenuSearch'
import {filterMenuBySearchWord, expandAfterSearch} from "../util"

appMutations.title('侧边栏搜索框')
appMutations.menus(menus)
appMutations.navMode('aside')

export default {
    name: "Layout",

    components: {
        ElAdminLayout,

        AsideHeader: {
            functional: true,

            props: {default: Object},

            render(h, context) {
                return [
                    context.props.default,
                    !appGetters.isMobile && (
                        <MenuSearch
                            v-show={!asideGetters.collapse}
                            on-search={context.parent.searchWordMutation}
                        />
                    )
                ]
            }
        },

        AsideMenuContent: {
            props: {
                title: String,
                searchWord: String
            },

            render() {
                const {title, searchWord} = this

                if (!searchWord) return <span>{title}</span>

                const start = title.indexOf(searchWord)

                if (start === -1) return <span>{title}</span>

                const end = start + searchWord.length

                return (
                    <span>
                        {title.substring(0, start)}
                        <span class="menu-highlight-result">{title.substring(start, end)}</span>
                        {title.substring(end)}
                    </span>
                )
            }
        }
    },

    props: {
        //菜单内容搜索结果的渲染器
        searchResultRenderer: {
            type: Function,
            default: (h, menu, searchWord) => {
                const {title} = menu.meta
                const start = title.indexOf(searchWord)

                if (start === -1) return title

                const end = start + searchWord.length

                return [
                    title.substring(0, start),
                    <span class="menu-highlight-result">{title.substring(start, end)}</span>,
                    title.substring(end)
                ]
            }
        },
    },

    data: () => ({searchWord: ''}),

    methods: {
        searchWordMutation(v) {
            this.searchWord = v
        },
        postMenus(menus) {
            const searchWord = this.searchWord
            const filtered = filterMenuBySearchWord(menus, searchWord)

            //在新的菜单渲染完毕后
            this.$nextTick(() => {
                const sidebar = this.$refs['layout'].$refs['aside'].$refs['default-sidebar']
                const elMenu = sidebar.$_getElMenuInstance()
                if (elMenu) {
                    expandAfterSearch(elMenu, searchWord, filtered)
                }
            })

            return filtered
        }
    },

    created() {
        //避免搜索结果为空时侧边栏不渲染
        asideMutations.alwaysRender(true)
        asideMutations.postMenus(this.postMenus)
    }
}
</script>
