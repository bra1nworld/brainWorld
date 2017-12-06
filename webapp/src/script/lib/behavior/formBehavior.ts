export class FormBehavior<T = {
    [key: string]: any
}> {
    constructor(private widget: Leaf.Widget) {
    }
    public definition = new FormDataDefinition<T>(this.widget, this)
    getData(): T {
        return this.definition.getData()
    }
    validate() {
        return this.definition.validate()
    }
}
const ValidatorRule = Leaf.ValidatorRule
export class FormDataDefinition<T> extends Leaf.DataDefinition<T> {
    constructor(private widget: Leaf.Widget, private formBehavior: FormBehavior) {
        super()
    }
    @ValidatorRule
    public input(name: string): this {
        return {
            type: "input",
            annotation: true,
            name
        } as any
    }
    public getData() {
        let result = {} as any
        for (let name in this.fields) {
            let input = this.getInputName(name)
            let el = this.widget.UI[input] as HTMLInputElement
            if (!el) continue
            let value = el.value.trim()
            result[name] = value
        }
        return result
    }
    public validate() {
        this.check(this.getData())
    }
    private getInputName(field: string): string {
        if (!this.fields[field]) return null
        let info = this.fields[field]
        for (let rule of info.rules) {
            if (rule.type == "input") {
                return rule["name"]
            }
        }
        return field + "Input"
    }
}
