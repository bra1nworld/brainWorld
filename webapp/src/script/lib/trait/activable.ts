export class Activable {
    events = new Leaf.EventEmitter<{
        change: boolean
        active
        deactive
    }>()
    constructor(private owner: {
        asActivable: Activable
        onActivate?: Function
        onDeactivate?: Function
        onActiveChange?: Function
    }, public isActive: boolean = false) {
    }
    activate() {
        if (this.isActive) return
        this.isActive = true
        if (this.owner.onActivate) { this.owner.onActivate() }
        if (this.owner.onActiveChange) { this.owner.onActiveChange(this.isActive) }
        this.events.emit("active")
        this.events.emit("change", this.isActive)
    }
    deactivate() {
        if (!this.isActive) return
        this.isActive = false
        if (this.owner.onDeactivate) { this.owner.onDeactivate() }
        if (this.owner.onActiveChange) { this.owner.onActiveChange(this.isActive) }
        this.events.emit("deactive")
        this.events.emit("change", this.isActive)
    }
}
