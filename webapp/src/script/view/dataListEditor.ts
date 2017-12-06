import { App } from "../app"
import { toReadableDate, cloneObject, downloadFile } from "../helpers"

export class DataListEditor<TData> extends R.DataListEditor {
    table: SillyTable<TData>
    pagination: SillyPagination
    filter: SillyFilter<TData>
    events: Leaf.EventEmitter<{
        refresh: {
            paginate?: Paginate<TData>
        }
    }>
    constructor(public readonly definition: Definition<TData>) {
        super()
        this.VM.title = definition.title
        this.VM.required = definition.required
        this.VM.addButton = definition.addButton
        this.VM.applyButton = definition.applyButton
        this.VM.backButton = definition.backButton
        this.VM.name = definition.name
        this.render(null)
        if (this.definition.filter) {
            this.renderFilter(this.definition.filter)
        }
        if (this.definition.pagination) {
            this.renderPagination(this.definition.pagination)
        }
        if (this.definition.readonly) {
            this.readonly(this.definition.readonly)
        }
    }
    public readonly(readonly: boolean = true) {
        this.VM.readonly = readonly
    }
    refresh(option: {
        query?: any,
    } = {}) {
        this.events.emit("refresh")
    }

    addItem(data: TData) {
        let items = this.table.getAll()
        items.push(data)
        this.table.from(items)
    }
    deleteItem(data: TData) {
        if (window.confirm("确定删除？")) {
            this.table.from(this.table.getAll().filter(item => item != data))
        }
    }
    editItem(oldData: TData, newData: TData) {
        let index: number
        let items = this.table.getAll().filter((item, i) => {
            if (item != oldData) {
                index = i
                return true
            }
            return false
        })
        items.splice(index, 0, newData)
        this.table.from(items)
    }
    render(items: TData[]) {
        let definition = this.definition
        let {
            name,
            fields,
            actions,
            transform,
            actionAvailable,
            extraTokens
    } = definition.table

        let downloadActions: { [key: string]: CustomAction<TData> } = {}
        let tableActions: { [key: string]: string } = {}

        if (definition.form) {
            let { types, fields: formFields } = definition.form
            for (let k in types) {
                if (types[k] == "file") {
                    downloadActions[`download-${k}`] = {
                        displayText: `下载${formFields[k]}`,
                        handler: (manager, data) => {
                            let file = data[k]
                            if (file && typeof file == "string") {
                                downloadFile(file)
                            }
                        }
                    }
                }
            }
        }
        let allActions = { ...actions, ...downloadActions }

        for (let a in allActions) {
            let action = allActions[a]
            if (isCustomAction(action)) {
                tableActions[a] = action.displayText
            } else {
                tableActions[a] = action
            }
        }

        let table = new SillyTable<TData, { [key: string]: any }>({
            name,
            fields,
            transform,
            extraTokens,
            actions: tableActions
        })
        this.table = table

        table.events.listenBy(this, "delete", data => {
            if (!allActions["delete"] || isCustomAction(allActions["delete"])) {
                return
            }
            if (actionAvailable && actionAvailable["delete"]) {
                if (typeof actionAvailable["delete"] == "function") {
                    if (!actionAvailable["delete"](data)) {
                        return
                    }
                }
            }
            this.deleteItem(data)
        })
        table.events.listenBy(this, "edit", data => {
            if (!allActions["edit"] || isCustomAction(allActions["edit"])) {
                return
            }
            if (actionAvailable && actionAvailable["edit"]) {
                if (typeof actionAvailable["edit"] == "function") {
                    if (!actionAvailable["edit"](data)) {
                        return
                    }
                }
            }
            let formDefinition: FormDefinition<TData> = cloneObject(
                this.definition.form || {}
            )
            formDefinition.fields =
                formDefinition.fields || this.definition.table.fields
            formDefinition.data = data
            let se = new SillyEditor<TData>(formDefinition)
            se.asModal.VM.title = this.definition.title
            se.edit((error, result) => {
                if (error) {
                    console.error(error)
                    return
                }
                for (let name in data) {
                    let value = result[name]
                    if (value == undefined || value == null) {
                        result[name] = data[name]
                    }
                }
                this.editItem(data, result)
            })
        })

        for (let a in allActions) {
            let action = allActions[a]
            if (isCustomAction(action)) {
                let handler = action.handler
                table.events.listenBy(this, a, data => {
                    handler(this, data)
                })
            }
        }

        this.setValue(items)
    }
    getValue() {
        return this.table.getAll()
    }
    setValue(items: TData[]) {
        this.table.from(items || [])
    }
    onClickAdd() {
        let formDefinition: FormDefinition<TData> = cloneObject(
            this.definition.form || {}
        )
        formDefinition.fields =
            formDefinition.fields || this.definition.table.fields
        let se = new SillyEditor<TData>(formDefinition)
        se.asModal.VM.title = this.definition.title
        se.edit((error, result) => {
            if (error) {
                console.error(error)
                return
            }
            this.addItem(result)
        })
    }


    renderPagination(option: PaginationDefinition) {
        let { pageIndex, pageSize, pageLimit } = option
        this.pagination = new SillyPagination()
        this.events.on("refresh", (option: { paginate }) => {
            let { pageIndex, pageTotal, total } = option.paginate
            this.setValue(option.paginate.items)
            this.pagination.setValue({
                pageIndex: option.paginate.pageIndex,
                pageTotal: option.paginate.pageTotal,
                pageLimit,
                pageSize,
                total
            })
        })

        this.refresh({
            query: {
                pageIndex,
                pageSize
            }
        })

        this.pagination.events.listenBy(this, "paging", (index: number) => {
            this.refresh({
                query: {
                    pageIndex: index,
                    pageSize,
                }
            })
        })

    }
    renderFilter(option: FilterDefinition<TData>) {
        this.filter = new SillyFilter(option)
        this.filter.events.listenBy(this, "query", (query) => {
            query.pageIndex = 0
            this.refresh({ query })
        })
    }

}

interface TableDefinition<TData> extends SillyTableDefinition<TData, any> {
    actions?: {
        [key: string]: CustomAction<TData> | string
    }
    actionAvailable?: {
        [key: string]: { (value?: TData): boolean }
    }
}

interface FormDefinition<TData> extends SillyEditorDefinition<TData> { }

export type Definition<TData> = {
    title: string
    name?: string
    table: TableDefinition<TData>
    form?: FormDefinition<TData>
    required?: boolean
    addButton?: boolean
    applyButton?: boolean
    backButton?: boolean
    readonly?: boolean
    pagination?: PaginationDefinition
    filter?: FilterDefinition<TData>
    data?: Partial<TData>
}

export type DataListEditorDefinition<TData> = Definition<TData>

export type DefinitionMap<TData, TMap> = {
    [M in keyof TMap]?: Definition<TData>
}

type CustomAction<TData> = {
    displayText: string
    handler: (editor: DataListEditor<TData>, data: TData) => void
}

function isCustomAction<TData>(
    action: CustomAction<TData> | string
): action is CustomAction<TData> {
    return (<CustomAction<TData>>action).displayText !== undefined
}

import {
    SillyTable,
    Definition as SillyTableDefinition
} from "./base/sillyTable"
import {
    SillyEditor,
    Definition as SillyEditorDefinition
} from "./base/sillyEditor"


import { SillyPagination, PaginationDefinition } from "./base/sillyPagination"
import { SillyFilter, FilterDefinition } from "./base/sillyFilter"