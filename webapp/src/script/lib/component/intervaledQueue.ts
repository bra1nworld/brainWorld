export class IntervaledQueue<T>  {
    constructor(public interval: number) {
    }
    events = new Leaf.EventEmitter<{
        solve: T
    }>()
    private taskQueue: T[] = []
    private previousTaskDate: number
    private solveTaskTimer: any // NodeJS.Timer | number
    public push(task: T) {
        if (this.taskQueue.length === 0 && (!this.previousTaskDate || Date.now() - this.previousTaskDate > this.interval)) {
            this.previousTaskDate = Date.now()
            this.handle(task)
        } else {
            this.taskQueue.push(task)
            clearTimeout(this.solveTaskTimer)
            this.solveTaskTimer = setTimeout(() => {
                this.solveTask()
            }, this.interval - (Date.now() - this.previousTaskDate))
        }
    }
    private solveTask() {
        let task = this.taskQueue.shift()
        if (!task) return
        this.previousTaskDate = Date.now()
        this.handle(task)
        if (this.taskQueue.length != 0) {
            this.solveTaskTimer = setTimeout(() => {
                this.solveTask()
            }, this.interval)

        }
    }
    private handle(task: T) {
        this.events.emit("solve", task)
    }
}
