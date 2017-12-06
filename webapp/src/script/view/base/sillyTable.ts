import { camelToDash } from "../../helpers"

export class SillyTable<TModel = any, TAction =  any> extends R.Base.SillyTable {
    constructor(public readonly definition: Definition<TModel, TAction>, option: {
        checkbox?: boolean
        focus?: boolean
    } = {}) {
        super()
        this.UI.thead.appendChild(new TableHead(this).node)
        this.VM.name = this.definition.name
        if (!this.definition.actions || Object.keys(this.definition.actions).length === 0) {
            this.VM.withoutAction = true
        }
        if (!option.checkbox) {
            this.VM.withoutCheckbox = true
        }
        if (option.focus) {
            this.VM.withFocus = true
            this.focusBehavior = new SillyTableFocusBehavior(this)
        }
        this.events.listenBy(this, "moveUp", (data) => {
            let all = this.getAll()
            let result = all.map((item, index) => {
                if (item === data) {
                    if (index > 0) {
                        return all[index - 1]
                    }
                } else if (all[index + 1] === data) {
                    return data
                }
                return item
            })
            this.from(result)
        })
        this.events.listenBy(this, "moveDown", (data) => {
            let all = this.getAll()
            let result = all.map((item, index) => {
                if (item === data) {
                    if (all[index + 1]) {
                        return all[index + 1]
                    }
                } else if (all[index - 1] === data) {
                    return data
                }
                return item
            })
            console.log(result)
            this.from(result)
        })
    }
    focusBehavior: SillyTableFocusBehavior<TModel, TAction>
    rows: Leaf.List<TableRow<TModel, TAction>>
    from(items: TModel[]) {
        if (this.focusBehavior) this.focusBehavior.currentFocus = null
        this.rows.empty()
        for (let item of items) {
            this.add(item)
        }
        if (this.focusBehavior && this.rows.length > 0) {
            this.focusBehavior.focusAt(this.rows[0])
        }
    }
    add(item: TModel) {
        let row = new TableRow(this, item, this.rows.length)
        let index = this.rows.length - 1
        this.rows.push(row)
        for (let name in this.definition.actions) {
            row.events.listenBy(this, name, (data) => {
                this.events.emit(name as any, row.data)
            })
        }
    }
    selectAll() {
        return this.rows.toArray().forEach((item) => {
            item.select()
        })
    }
    unselectAll() {
        return this.rows.toArray().forEach((item) => {
            item.unselect()
        })

    }
    getAll() {
        return this.rows.toArray().map(item => item.data)
    }
    getSelected(): TModel[] {
        return null
    }
    getFocus(): TModel {
        if (this.focusBehavior && this.focusBehavior.currentFocus) {
            return this.focusBehavior.currentFocus.data
        }
        return null
    }
    events = new Leaf.EventEmitter<{
        [K in keyof TAction]: TModel
    } & {
            moveUp: TModel
            moveDown: TModel
        }>()
}


export class TableHead<TModel, TAction> extends R.Base.SillyTable.Head {
    constructor(protected table: SillyTable<TModel, TAction>) {
        super()
        for (let name in this.table.definition.fields) {
            if (name === "_extra") continue
            let displayText = this.table.definition.fields[name]
            this.addHeadItem(displayText, name)
        }
        if (table.definition.fields && table.definition.fields._extra) {
            for (let item of table.definition.fields._extra) {
                this.addHeadItem(item.displayName)
            }
        }

    }
    addHeadItem(displayText: string, name?: string) {
        let th = document.createElement("th")
        th.className = `th ${camelToDash(name)}`
        th.innerHTML = displayText
        this.node.insertBefore(th, this.UI.actions)
    }
    private allSelect: boolean = false
    onClickCheckbox() {
        if (!this.allSelect) {
            this.table.selectAll()
        }
        else {
            this.table.unselectAll()
        }
        this.allSelect = !this.allSelect
    }
}

export class TableRow<TModel, TAction> extends R.Base.SillyTable.Row {
    constructor(protected table: SillyTable<TModel, TAction>, public data: TModel, public index: number) {
        super()
        for (let name in this.table.definition.fields) {
            if (name === "_extra") continue
            let displayText: string
            let trans = table.definition.transform || {} as any
            if (trans[name]) {
                displayText = trans[name](this.data[name], this.data, this.index)
            }
            else {
                if (typeof this.data[name] === "boolean") {
                    displayText = this.data[name] && "是" || "否"
                } else {
                    displayText = this.data[name] as any
                }
            }
            this.addItem(displayText, name)
        }
        if (this.table.definition.fields._extra) {
            for (let item of this.table.definition.fields._extra) {
                let value = item.compute(this.data)
                this.addItem(value, name)
            }
        }
        for (let action in this.table.definition.actions) {
            let displayText: any = this.table.definition.actions[action]
            if (typeof displayText === "function") {
                displayText = displayText(this.data)
            }
            if (!displayText) continue
            let button = new R.Base.SillyTable.Row.ActionButton()
            button.node.innerHTML = displayText
            button.node.title = displayText
            button.node.classList.add(action)
            button.node.onclick = (e) => {
                e.stopImmediatePropagation()
                e.stopPropagation()
                this.events.emit(action)
            }
            this.actions.push(button)
        }
        if (this.table.definition.extraTokens && typeof this.table.definition.extraTokens == "function") {
            this.table.definition.extraTokens(this.data).forEach((className) => {
                this.node.classList.add(camelToDash(className))
            })
        }
    }
    addItem(displayText: string, name?: string) {
        let th = document.createElement("td")
        th.className = `td ${camelToDash(name)}`
        if (displayText as any === 0) displayText = "0"
        th.innerHTML = displayText || "(空)"
        this.node.insertBefore(th, this.UI.actions)
    }
    select() {
        this.UI.checkbox.checked = true
    }
    unselect() {
        this.UI.checkbox.checked = false
    }
    events = new Leaf.EventEmitter<{
        [K in keyof TAction]: TModel
    }>()
    onClick(e) {
        if (this.table.focusBehavior) {
            this.table.focusBehavior.focusAt(this)
        }
    }
}
export class SillyTableFocusBehavior<TModel, TAction> {
    constructor(public table: SillyTable<TModel, TAction>) {
        //this.table.rows.events.listenBy(this, "child/add", (child: TableRow<TModel, TAction>) => {
        //    console.log("attach click", child)
        //    child.node.onclick = (e) => {
        //        console.log("click", "???")
        //        e.stopImmediatePropagation()
        //        e.preventDefault()
        //        this.focusAt(child)
        //    }
        //})
    }
    public currentFocus: TableRow<TModel, TAction>;
    focusAt(node: TableRow<TModel, TAction>) {
        if (this.currentFocus) {
            this.currentFocus.VM.focus = false
        }
        this.currentFocus = node
        this.currentFocus.VM.focus = true
    }
}

export interface Definition<TModel, TAction> {
    name?: string
    fields: {
        // name : displayText
        [K in keyof TModel]?: string
    } & {
        _extra?: {
            displayName: string
            compute: (all: TModel) => string
        }[]
    }
    actions?: {
        [K in keyof TAction]: string | ((model: TModel) => string | boolean)
    }
    transform?: {
        [K in keyof TModel]?: (value?: TModel[K], obj?: TModel, index?: number) => any
    }
    extraTokens?: (all: TModel) => string[]
}
