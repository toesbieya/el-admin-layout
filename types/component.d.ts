import type Vue from 'vue'

interface VoidFunction {
  (): void
}

export class Layout extends Vue {

}

export class Breadcrumb extends Vue {

}

export class CachedRouterView extends Vue {
  rerenderRouterView(): void
}

export class ContextMenu extends Vue {

}

type ContextMenuItem = { content: string, click: VoidFunction }
type ContextMenuOptions = { left: number, top: number, minDistance?: number }

export interface useContextMenu {
  (items: ContextMenuItem[], options: ContextMenuOptions): VoidFunction
}

export class NavMenu extends Vue {

}
