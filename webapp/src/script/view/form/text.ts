import { Field } from "../..//lib/component/formTemplate"

export class Text extends R.Form.Text implements Field<string> {
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
        return this.UI.textarea.value
    }
    setValue(str: string) {
        this.UI.textarea.value = str
    }
}
