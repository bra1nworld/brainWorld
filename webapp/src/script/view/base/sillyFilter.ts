export class SillyFilter<TModel> extends R.Base.SillyFilter {
    events = new Leaf.EventEmitter<{
        query: {
            [K in keyof TModel]?: TModel[K]
        }
    }>()
    form = new SillyForm<TModel>(this.option)
    constructor(public readonly option: FilterDefinition<TModel>) {
        super()
        this.VM.collapsed = true
        this.VM.collapseButtonText = "展开"
    }
    onClickConfirm() {
        let value = this.form.getValue()
        this.events.emit("query", value)
    }
    onClickReset() {
        this.form.clear()
        this.events.emit("query", {})
    }
    onClickCollapse() {
        this.VM.collapsed = !this.VM.collapsed
        if (this.VM.collapsed) {
            this.VM.collapseButtonText = "展开"
        } else {
            this.VM.collapseButtonText = "收起"
        }
    }
    getValue() {
        return this.form.getValue()
    }
}

export type FilterDefinition<TModel> = {
    fields: {
        [K in keyof TModel]?: string
    }
    types?: {
        [K in keyof TModel]?: string
    }
    optional?: {
        [K in keyof TModel]?: boolean
    } | boolean
    metas?: {
        [K in keyof TModel]?: any
    }
    data?: TModel
}

import { SillyForm } from "./sillyForm"
