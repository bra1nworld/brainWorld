import * as Dict from "../../dict"
export class SillyDropdown extends R.Base.SillyDropdown {
    constructor(public selectHint: string, placement: "top" | "bottom" = "bottom") {
        super()
        this.options.empty()
        this.options.push(new DropdownOption(this, { value: null, displayText: "请选择" + this.selectHint, placeholder: true }))
        this.select(this.options[0])
        this.VM.placement = placement
    }
    options: Leaf.List<DropdownOption>
    events = new Leaf.EventEmitter<{
        change
    }>()
    public current: DropdownOption
    public isReadonly: boolean = false
    readonly() {
        this.isReadonly = true
        this.VM.readonly = true
        this.node.addEventListener("mousedown", (e) => {
            e.preventDefault()
            e.stopImmediatePropagation()
        }, true)
    }
    getValue() {
        if (this.current.config.value === false) return false
        return this.current.config.value
    }
    setValue(value) {
        for (let option of this.options.toArray()) {
            let v = option.config.value
            if (v && v.value) {
                v = v.value
            }
            if (v === value) {
                this.select(option)
                return
            }
        }
    }
    clear() {
        this.select(this.options[0])
    }
    select(option: DropdownOption) {
        this.current = option
        this.VM.currentDisplayText = option.config.displayText
        if (SillyDropdown.current = this) {
            SillyDropdown.current = null
        }
        this.VM.active = false
        this.events.emit("change")
    }
    setOptionDict(dict: string | {
        value: any
        displayText: string
    }[]) {
        if (typeof dict == "string") {
            dict = Dict[dict] as any
        }
        this.options.empty()
        this.options.push(new DropdownOption(this, { value: null, displayText: "请选择" + this.selectHint, placeholder: true }))
        if (!dict) return
        for (let item of dict) {
            let op = new DropdownOption(this, item as DictItem)
            this.options.push(op)
        }
    }
    onClickCurrentSelect() {
        console.log(SillyDropdown.current)
        if (this.isReadonly) return
        if (!this.VM.active) {
            if (SillyDropdown.current) {
                SillyDropdown.current.VM.active = false
            }
            SillyDropdown.current = this
        } else {
            SillyDropdown.current = null
        }
        this.VM.active = !this.VM.active
    }
    static current: SillyDropdown
}
export class DropdownOption extends R.Base.SillyDropdown.Option {
    constructor(public parent: SillyDropdown, public config: { value: any, displayText: string, placeholder?: boolean }) {
        super()
        this.VM.displayText = this.config.displayText
    }
    onClick() {
        this.parent.select(this)
    }
}
window.addEventListener("click", (e) => {
    let target = e.srcElement || e.target
    if (SillyDropdown.current) {
        if (SillyDropdown.current.node.contains(target as HTMLElement)) {
            return
        }
        SillyDropdown.current.VM.active = false
        SillyDropdown.current = null
        e.stopImmediatePropagation()
        e.preventDefault()
    }
}, false)
