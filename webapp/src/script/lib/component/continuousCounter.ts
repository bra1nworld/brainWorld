export class ContinuousCounter {
    constructor(option: {
        count?: number
        during?: number
    } = {}) {
        this.count = option.count || 10
        if (this.count <= 2) this.count = 2
        this.during = option.during || 3000

    }
    public readonly count: number
    public readonly during: number
    events = new Leaf.EventEmitter<{
        trigger
    }>()
    trigger() {
        this.actions.push({
            time: new Date
        })
        if (this.actions.length >= this.count) {
            this.actions.length = 0
            this.events.emit("trigger")
        }
        const step = this.during / this.count
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.actions.length = 0
        }, step)
    }
    actions: {
        time: Date
    }[] = []
    private timer
}
