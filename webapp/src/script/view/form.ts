import { FormTemplate, Constructor } from "../lib/component/formTemplate"
import { Popupable } from "../lib/trait/popupable"
import { Input } from "./form/input"
import { Selection } from "./form/selection"
import { Text } from "./form/text"
import { Color } from "./form/color"
import { Tags } from "./form/tags"
import { Items } from "./form/items"
import { Span } from "./form/span"
import { Boolean } from "./form/boolean"

export type Constructor<T> = Constructor<T>
export const Form = new FormTemplate({
    "input": Input,
    "selection": Selection,
    "color": Color,
    "text": Text,
    "tags": Tags,
    "items": Items,
    "span": Span,
    "boolean": Boolean,
})
export class PopupEditor<T> extends R.PopupEditor {
    getValue: () => T
    setValue: (T) => void
    private callback: Callback<T>
    asPopup: Popupable = new Popupable(this)
    edit(value: Partial<T>, callback: Callback<T>) {
        this.callback = callback
        this.setValue(value || {})
        this.asPopup.show()
        this.asPopup.center()
    }
    onClickCancel() {
        this.asPopup.hide()
        this.callback(new Error("Abort"))
    }
    onClickOk() {
        let value = this.getValue()
        this.asPopup.hide()
        this.callback(null, value)
    }
}



export type Partial<T> = {
    [K in keyof T]?: T[K]
}
