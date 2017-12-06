import { Field } from "../..//lib/component/formTemplate"

export class Input extends R.Form.Input implements Field<string> {
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
        return this.UI.input.value
    }
    setValue(str: string) {
        this.UI.input.value = str
    }
}
