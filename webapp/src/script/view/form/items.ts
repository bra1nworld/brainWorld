import { Field } from "../../lib/component/formTemplate"
export class Items<TData = any> extends R.Form.Items implements Field<TData[]> {
    constructor(option: {
        name: string
        displayName: string
    }) {
        super()
        this.name = option.name
        this.displayName = option.displayName
        this.VM.displayName = option.displayName
    }
    onChildAddItemList(child: Item) {
        child.events.listenBy(this, "remove", () => {
            this.itemList.removeItem(child)
        })
    }
    onChildRemoveItemList(child: Item) {
        child.events.stopListenBy(this)
    }
    onClickAdd() {
        let editor = new this.editor
        editor.edit({}, (err, result) => {
            if (result) {
                this.itemList.push(new Item(result, this))
            }
        })
    }
    name: string
    displayName: string
    getValue() {
        return this.itemList.map(item => item.data)
    }
    setValue(items: string[]) {
        this.itemList.length = 0
        for (let item of items) {
            this.itemList.push(new Item(item, this))
        }
    }
    setMeta(meta: {
        editor: CustomItemEditorConstructor<TData>
        nameField?: string
    }) {
        this.editor = meta.editor
        if (meta.nameField) this.nameField = meta.nameField
    }
    public nameField: string = "name"
    public editor: CustomItemEditorConstructor = null
    itemList: Leaf.List<Item>
}

interface CustomItemEditor<TItem = any> {
    edit(value: TItem, callback: Sybil2.Callback<TItem>)
}
interface CustomItemEditorConstructor<TItem = any> {
    new(): CustomItemEditor<TItem>
}
class Item extends R.Form.Items.ItemListItem {
    constructor(public data: any, public parent: Items) {
        super()
        this.VM.name = data[this.parent.nameField]
    }
    events = new Leaf.EventEmitter<{
        remove: Item
        edit: Item
    }>()
    onClickNode() {
        let editor = new this.parent.editor
        editor.edit(this.data, (err, result) => {
            if (result) {
                this.data = result
                this.VM.name = result[this.parent.nameField]
            }
        })
    }
    onClickDelete(e) {
        e.capture()
        this.events.emit("remove", this)
    }
}
