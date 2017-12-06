import { Field } from "../..//lib/component/formTemplate"

export class Boolean extends R.Form.Boolean implements Field<boolean> {
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
        return this.UI.input.checked
    }
    setValue(value: boolean) {
        this.UI.input.checked = value
    }
}
