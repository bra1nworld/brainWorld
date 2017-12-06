export abstract class ListReflower {
    static reflow(list: Leaf.List, itemHeight: number) {
        list.forEach((item, index) => {
            this.transform(item, index * itemHeight)
        })
    }
    static transform(item: Leaf.WidgetAny, top) {
        item.node.style.top = top + "px"
    }
}
