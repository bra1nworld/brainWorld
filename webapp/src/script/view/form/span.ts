import { Field } from "../..//lib/component/formTemplate"

export class Span extends R.Form.Span implements Field<string> {
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
        return this.VM.value
    }
    setValue(str: string) {
        this.VM.value = str
    }
}
