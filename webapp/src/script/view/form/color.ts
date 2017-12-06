import { Field } from "../..//lib/component/formTemplate"

export class Color extends R.Form.Color implements Field<string> {
    constructor(option: {
        name: string
        displayName: string
    }) {
        super()
        this.name = option.name
        this.displayName = option.displayName
        this.VM.displayName = option.displayName
        console.log("create?")
    }
    name: string
    displayName: string
    getValue() {
        return this.UI.input.value
    }
    setValue(str: string) {
        console.log("set value", str, "???")
        this.UI.input.value = str
    }
}
