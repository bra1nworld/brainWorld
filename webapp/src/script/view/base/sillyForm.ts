import { App } from "../../app"
import * as Dict from "../../dict"
import { arrayToDict } from "../../dict"
import { SillyTable } from "./sillyTable"
import { SillyDropdown } from "./sillyDropdown"

export class SillyForm<TModel> extends R.Base.SillyForm {
    fields: Leaf.List<SillyField>
    fieldMap: {
        [name: string]: SillyField,
    } = {}
    constructor(private definition: Definition<TModel>) {
        super()
        let data = definition.data || {}
        let types = definition.types || {}
        let metas = definition.metas || {}
        let descriptions = definition.descriptions || {}
        this.definition.optional = this.definition.optional || {} as any
        for (let name in definition.fields) {
            let displayName = definition.fields[name]
            let meta = metas[name]
            let type = types[name as any] || "text" as any
            let Field = Fields[type] || TextField
            let field = new Field(name, displayName) as any
            if (field.setMeta && meta) {
                field.setMeta(meta)
            }
            this.fieldMap[name] = field
            this.fields.push(field)
            let value = data[name as string]
            if (value || value === false) {
                field.setValue(value as any)
            }
            field.events.listenBy(this, "change", () => {
                //let kv = {} as any
                //kv[name] = field.getValue(true)
                // let kv = this.getValue(true)
                // this.reviewDepends(kv)
            })
            if (descriptions[name]) {
                field["VM"].description = descriptions[name]
            }
            if (definition.readonly === true || definition.readonly && definition.readonly[field.name]) {
                field.readonly()
                field.node.addEventListener("mousedown", (e) => {
                    e.stopImmediatePropagation()
                    e.preventDefault()
                }, true)
                field.setOptional()
            }
            let optionalKey = name as any
            if (this.isOptional(definition.optional[optionalKey])) {
                field.setOptional()
            }
        }

        if (definition.readonly === true) {
            this.VM.readonly = true
        } else {
            this.VM.readonly = false
        }

        this.reviewDepends(definition.data || {})
        if (definition.readonly === true) {
            this.node.addEventListener("mousedown", (e) => {
                e.stopImmediatePropagation()
                e.preventDefault()
            })
        }
    }
    reviewDepends(value) {
        let depends = this.definition.depends || {} as any
        for (let field of this.fields.toArray()) {
            let depend = depends[field.name]
            if (depend) {
                if (!depend(value)) {
                    field.node.classList.add("hide")
                    field.undepend = true
                } else {
                    field.node.classList.remove("hide")
                    field.undepend = false
                }
            }
        }
    }

    getValue(trial?: boolean): TModel {
        let result = {} as TModel
        if (!trial) {
            this.reviewDepends(this.getValue(true))
        }
        for (let item of this.fields.toArray()) {
            let name = item.name
            item.optional = this.definition.optional[name] || this.definition.optional === true
            let value = item.getValue(trial)
            if (!trial && (!value || value instanceof Array && value.length == 0) && value !== 0 && typeof value !== "boolean" && !this.isOptional(this.definition.optional[name]) && this.definition.optional !== true && !item.undepend) {
                alert(`请填写"${item.displayText}"`)
                throw new Error("Invalid parameter " + item.name)
            }
            result[name] = value
        }
        let computes = this.definition.computes || {}
        for (let name in computes) {
            result[name] = computes[name](result)
        }
        if (trial) return result as any
        let validates = this.definition.validates || {}
        // validate things
        for (let item of this.fields.toArray()) {
            let name = item.name
            if (typeof validates[name as any] === "function") {
                validates[name as any](result[name], result)
            }
        }
        return result as any
    }
    isOptional(opt) {
        if (typeof opt === "function") {
            return opt(this.getValue(true))
        } else {
            if (opt === true) return true
        }

        return false
    }
    clear() {
        for (let field of this.fields.toArray()) {
            field.clear()
        }
    }
}
export interface SillyField extends Leaf.Widget {
    displayText: string
    name: string
    getValue(trial?: boolean): any
    setValue(value: any)
    setMeta?: (meta: any) => void
    clear()
    optional?: boolean
    undepend?: boolean
    events: Leaf.EventEmitter<{ change }>
    isReadonly: boolean
    readonly()
    setOptional()
}

export class SettlementAmountField extends R.Base.SillyForm.SettlementAmount implements SillyField {
    optional?: boolean
    constructor(public name: string, public displayText) {
        super()
        if (this.optional) {
            this.VM.optional = "optional"
        }
    }
    events = new Leaf.EventEmitter<{ change }>()
    getValue() {
        return
    }
    setValue(value): void {
        this.VM.displayText = value
    }
    clear() { }
    isReadonly: boolean
    readonly() { }
    setOptional() {
        this.VM.optional = "optional"
    }
}

export class TextField extends R.Base.SillyForm.TextField implements SillyField {
    constructor(public name: string, public displayText) {
        super()
        this.VM.displayText = displayText
    }
    events = new Leaf.EventEmitter<{ change }>()
    onChangeInput() {
        this.events.emit("change")
    }
    getValue() {
        return this.UI.input.value
    }
    setValue(value) {
        this.UI.input.value = value
    }
    clear() {
        this.UI.input.value = ""
    }
    isReadonly: boolean
    readonly() {
        this.isReadonly = true
        this.VM.readonly = true
    }
    setOptional() {
        this.VM.optional = "optional"
    }
}



export class PasswordField extends TextField {
    constructor(public name: string, public displayText) {
        super(name, displayText)
        this.UI.input.type = "password"
    }
}

export class RpcIdField extends R.Base.SillyForm.RpcIdField implements SillyField {
    constructor(public name: string, public displayText) {
        super()
        this.VM.displayText = displayText
    }
    events = new Leaf.EventEmitter<{ change }>()
    onChangeInput() {
        this.events.emit("change")
    }
    getValue(trial?: boolean) {
        console.log("trial" + trial)
        let value = this.UI.input.value.toString()
        if (value && value.length !== 15 && value.length !== 18) {
            alert("身份证格式不正确")
            throw new Error("invalid rpc id")
        }
        return value
    }
    setValue(value) {
        this.UI.input.value = value
    }
    clear() {
        this.UI.input.value = ""
    }
    isReadonly: boolean
    readonly() {
        this.isReadonly = true
        this.VM.readonly = true
    }
    setOptional() {
        this.VM.optional = "optional"
    }
}

export class IntField extends R.Base.SillyForm.IntField implements SillyField {
    constructor(public name: string, public displayText) {
        super()
        this.VM.displayText = displayText
    }
    events = new Leaf.EventEmitter<{ change }>()
    onChangeInput() {
        this.events.emit("change")
    }
    getValue(trial: boolean) {
        let value = parseInt(this.UI.input.value.trim())
        if (value >= 0) {
            this.setValue(value)
            return this.UI.input.value
        }
        if (trial) return
        alert("请填写整数")
        throw new Error("请填写整数")
    }
    setValue(value) {
        this.UI.input.value = value
    }
    clear() {
        this.UI.input.value = ""
    }
    isReadonly: boolean
    readonly() {
        this.isReadonly = true
        this.VM.readonly = true
    }
    setOptional() {
        this.VM.optional = "optional"
    }
}


export class ParagraphField extends R.Base.SillyForm.ParagraphField implements SillyField {
    constructor(public name: string, public displayText) {
        super()
        this.VM.displayText = displayText
    }
    events = new Leaf.EventEmitter<{ change }>()
    onChangeInput() {
        this.events.emit("change")
    }
    getValue() {
        return this.UI.input.value
    }
    setValue(value) {
        this.UI.input.value = value
    }
    clear() {
        this.UI.input.value = ""
    }
    isReadonly: boolean
    readonly() {
        this.isReadonly = true
        this.VM.readonly = true
    }
    setOptional() {
        this.VM.optional = "optional"
    }
}

export class DictField extends R.Base.SillyForm.DictField implements SillyField {
    constructor(public name: string, public displayText) {
        super()
        this.VM.displayText = displayText
        this.dropdown.events.listenBy(this, "change", this.events.emit.bind(this.events, "change"))

    }
    setMeta(name: any) {
        this.dropdown.setOptionDict(name)
    }
    dropdown = new SillyDropdown(this.displayText)
    events = new Leaf.EventEmitter<{ change }>()
    getValue() {
        return this.dropdown.getValue()
    }
    setValue(value) {
        this.dropdown.setValue(value)
    }
    clear() {
        this.dropdown.clear()
    }
    isReadonly: boolean
    readonly() {
        this.dropdown.readonly()
        this.isReadonly = true
        this.VM.readonly = true
    }
    setOptional() {
        this.VM.optional = "optional"
    }
}

const Fields = {
    text: TextField,
    paragraph: ParagraphField,
    password: PasswordField,
    dict: DictField,
    int: IntField,
    rpcId: RpcIdField,
}

import * as SillyEditorModule from "./sillyEditor"


export interface Definition<TModel> {
    fields: {
        [K in keyof TModel]?: string
    },
    types?: {
        [K in keyof TModel]?: string
    }
    optional?: {
        [K in keyof TModel]?: boolean | { (currentValue: TModel): boolean }
    } | boolean
    metas?: {
        [K in keyof TModel]?: any
    }
    depends?: {
        [K in keyof TModel]?: (currentValue: TModel) => boolean
    }
    validates?: {
        [K in keyof TModel]?: (value: TModel[K], all: TModel) => void
    }
    descriptions?: {
        [K in keyof TModel]?: string
    },
    computes?: {
        [K in keyof TModel]?: (value: TModel) => TModel[K]
    }
    data?: TModel
    readonly?: {
        [K in keyof TModel]?: boolean
    } | boolean
}