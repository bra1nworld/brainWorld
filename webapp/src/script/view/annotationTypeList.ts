export class AnnotationTypeList extends R.AnnotationTypeList {
    createList
    events: Leaf.EventEmitter<{
        click,
    }>
    constructor(lists: {
        displayText: string,
        value: string
    }[]) {
        super()
        lists.forEach((list) => {
            let item = new AnnotationTypeListItem(list)
            item.node.onclick = () => {
                this.events.emit("click", item.value)
            }
            this.createList.push(item)
        })
    }
}

export class AnnotationTypeListItem extends R.AnnotationTypeList.CreateListItem {
    events: Leaf.EventEmitter<{
        click,
    }>
    value
    constructor(option: {
        displayText: string,
        value: string
    }) {
        super()
        this.value = option.value
        this.VM.displayText = option.displayText
    }
    onClickNode() {
        this.events.emit("click")
    }
}