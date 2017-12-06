export class SillyEditor<TModel> extends R.Base.SillyEditor {
    constructor(public readonly definition: Definition<TModel>) {
        super()
        console.log(this.definition)
        if (this.definition.readonly === true) {
            this.VM.readonly = true
        }
        if (this.definition.name) {
            this.asModal.VM.name = this.definition.name
        }
    }
    form = new SillyForm<TModel>(this.definition)
    asModal = new SillyModal(this)
    private callback: Callback<TModel>
    edit(callback: Callback<TModel>) {
        this.callback = callback
        if (this.definition.title) {
            let title = ""
            if (typeof this.definition.title == "string") {
                title = this.definition.title
            } else {
                console.log(this.definition.data)
                title = this.definition.title(this.definition.data)
            }
            if (title && title != "") {
                this.asModal.VM.title = title
            }
        }
        this.asModal.show()
    }
    onClickConfirm() {
        if (this.definition.readonly === true) {
            this.onClickCancel()
            return
        }
        let value = this.form.getValue()
        if (this.definition.confirm) {
            let result = this.definition.confirm(value)
            if (!result) return
        }
        this.asModal.hide()
        this.callback(null, value)
    }
    onClickCancel() {
        this.asModal.hide()
        this.callback(new Error("Abort"))
    }
}

import { SillyForm, Definition as FormDefinition } from "./sillyForm"
import { SillyModal } from "./sillyModal"

export interface Definition<TModel> extends FormDefinition<TModel> {
    name?: string,
    title?: ((data: TModel) => string) | string,
    confirm?: (data: TModel) => boolean
}