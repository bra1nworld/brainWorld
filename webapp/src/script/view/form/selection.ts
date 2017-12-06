import { Field } from "../..//lib/component/formTemplate"

export class Selection extends R.Form.Selection implements Field<string> {
    constructor(option: {
        name: string
        displayName: string
    }) {
        super()
        this.name = option.name
        this.displayName = option.displayName
        this.VM.displayName = option.displayName
    }
    name: string
    displayName: string
    getValue() {
        for (let item of this.selectionList.toArray()) {
            if (item.node["selected"]) return item.value
        }
        let option = this.UI.selection.selectedOptions
        console.log(option, "??")
        return option["widget"].value
    }
    private currentValue
    selectionList: Leaf.List<Option>
    setValue(value: any) {
        this.currentValue = value
        for (let item of this.selectionList.toArray()) {
            if (item.value === value) {
                item.select()
            }
        }
    }
    defaultHint = "请选择"
    setMeta(meta: {
        noDefault?: boolean
        defaultHint?: string
        default?: any
        options: {
            displayText: string
            value: any
        }[]
    }) {
        this.selectionList.length = 0
        if (!meta.noDefault) {
            let def = new Option({
                displayText: meta.defaultHint || this.defaultHint,
                value: null
            })
            this.selectionList.push(def)
            def.select()
        }
        for (let item of meta.options) {
            let option = new Option(item)
            this.selectionList.push(option)
            if (meta.default && option.value === meta.default) {
                option.select()
            }
            if (this.currentValue === option.value) {
                option.select()
            }
        }
    }
}
class Option extends R.Form.Selection.SelectionListItem {
    constructor(option: {
        displayText: string
        value: any
    }) {
        super()
        this.VM.displayName = option.displayText
        this.value = option.value
    }
    public readonly value: any
    select() {
        let select = this.node as any as HTMLOptionElement
        select.selected = true
    }
}
