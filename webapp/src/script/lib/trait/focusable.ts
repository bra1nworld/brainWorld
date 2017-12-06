export interface ListItemFocusable extends Leaf.Widget {
    asFocusable?: Focusable
}
export class ListFocusManager<T extends ListItemFocusable = ListItemFocusable> {
    events = new Leaf.EventEmitter<{
        focus: T
        blur: T
    }>()
    currentFocus: T
    constructor(public list: Leaf.List<T>) {
    }
    focusAt(target: T) {
        this.list.forEach((item: T) => {
            if (item === target) {
                if (item.asFocusable.focus())
                    this.events.emit("focus", item)
            } else {
                if (item.asFocusable.blur())
                    this.events.emit("blur", item)
            }
        })
    }
}
export class Focusable {
    constructor(private owner: {
        asFocusable: Focusable
        onFocus?: Function
        onBlur?: Function
        onFocusChange?: Function
    }) { }
    public events = new Leaf.EventEmitter<{
        blur
        focus
    }>()
    public isFocus: boolean
    public focus() {
        if (this.isFocus) return false
        this.isFocus = true
        if (this.owner.onFocus) this.owner.onFocus()
        if (this.owner.onFocusChange) this.owner.onFocusChange(this.isFocus)
        return true
    }
    public blur() {
        if (!this.isFocus) return false
        this.isFocus = false
        if (this.owner.onBlur) this.owner.onBlur()
        if (this.owner.onFocusChange) this.owner.onFocusChange(this.isFocus)
        return true
    }
}
