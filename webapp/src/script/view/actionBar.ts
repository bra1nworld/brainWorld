import { PopupBehavior } from "../lib/behavior/popupBehavior"
export class ActionBar extends R.ActionBar {
    constructor() {
        super()
    }
    menuList: Leaf.List<MenuEntryListItem>
    install(items: ListItemData[]) {
        for (let item of items) {
            this.menuList.push(new MenuEntryListItem(item))
        }
    }
    onChildAddMenuList
}

export class Menu extends R.ActionBar.Menu {
    constructor(public readonly data: ListItemData) {
        super()
        for (let item of data.children || []) {
            this.install(item)
        }
    }
    asPopup = new PopupBehavior(this)
    showBelow(el: HTMLElement) {
        let rect = el.getBoundingClientRect()
        this.asPopup.show()
        this.node.style.left = rect.left + "px"
        this.node.style.top = rect.bottom + "px"
    }
    showAfter(el: HTMLElement) {
        let rect = el.getBoundingClientRect()
        this.asPopup.show()
        this.node.style.left = rect.right + "px"
        this.node.style.top = rect.top + "px"
    }
    hide() {
        this.asPopup.hide()
    }
    itemList: Leaf.List<Menu>
    install(item: ListItemData) {
        this.menuEntryList.push(new MenuEntryListItem(item))
    }
}
export class MenuEntryListItem extends R.ActionBar.Menu.MenuEntryListItem {
    constructor(public readonly data: ListItemData) {
        super()
        this.VM.name = data
    }
    events = new Leaf.EventEmitter<{
        trigger
    }>()
    onClickNode() {
        this.events.emit("trigger")
    }
}

interface ListItemData {
    id: string
    displayName: string
    children?: ListItemData[]
    hotkey?: string
}
