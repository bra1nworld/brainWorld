export class TouchManager extends Leaf.EventEmitter<string> {
    public lifeCircle = new TouchLifeCircle()
    constructor(public node: HTMLElement) {
        super()
        this.attach(this.node)
    }
    attach(node: HTMLElement) {
        if (!node) return
        this.node = node

        for (let name of ["touchstart", "touchmove", "touchcancel", "touchend"]) {
            this.node.addEventListener(name, (e) => {
                this.lifeCircle.feed("touchSignal", e)
            })
        }
    }
}
interface TouchInfo {
    raw: TouchEvent
    position: {
        x: number
        y: number
    }
}
export class TouchLifeCircle extends Leaf.States<"touchStart" | "touchMove" | "touchEnd" | "touchFinish" | "waitTouchStart" | "waitTouchContinue", { touchSignal: TouchEvent }> {
    constructor() {
        super()
        this.debug()
        this.setState("waitTouchStart")
    }
    data: {
        event: TouchEvent
        session: TouchSession
    }
    atWaitTouchStart() {
        this.consumeWhenAvailableMergeToLast("touchSignal", (e: TouchEvent) => {
            if (e.type !== "touchstart") {
                this.setState("waitTouchStart")
                return
            }
            this.setState("touchStart", e)
            this.events.emit("start", this.data.session)
        })
    }
    atTouchStart(stale, e: TouchEvent) {
        let session = this.data.session = new TouchSession()
        session.decoration(e)
        session.start = e
        this.setState("waitTouchContinue")
    }
    atWaitTouchContinue() {
        this.consumeWhenAvailableMergeToLast("touchSignal", (e: TouchEvent) => {
            if (e.type === "touchend" || e.type === "touchcancel") {
                this.setState("touchEnd", e)
                return
            } else if (e.type === "touchmove") {
                this.setState("touchMove", e)
            } else {
                this.error(new Error("Unexpected touch sequence"))
            }
        })
    }
    atTouchMove(stale, e: TouchEvent) {
        this.data.session.add(e)
        this.events.emit("update", this.data.session)
        this.setState("waitTouchContinue")
    }
    atTouchEnd(stale, e: TouchEvent) {
        if (e.type == "touchcancel") {
            this.data.session.end = e
            this.events.emit("cancel", this.data.session)
            this.setState("waitTouchStart")
        }
        if (e.touches.length == 0) {
            this.data.session.end = e
            this.setState("touchFinish")
        } else {
            this.data.session.add(e)
            this.events.emit("change", this.data.session)
            this.setState("waitTouchContinue")
        }
    }
    atTouchFinish(stale) {
        this.events.emit("finish", this.data.session)
        this.setState("waitTouchStart")
    }
    atPanic() {
        this.reset()
        this.setState("waitTouchStart")
    }

}

export class TouchSession {
    start: TouchEvent
    moves: TouchEvent[] = []
    end: TouchEvent
    getMovementVector() {
        let move: TouchEvent
        if (this.moves.length > 0) {
            move = this.moves[this.moves.length - 1]
        } else {
            move = this.end || this.start
        }
        if (!move) {
            return {
                x: 0, y: 0
            }
        }
        let end = this.getEventCenterPoint(move, "client")
        let start = this.getEventCenterPoint(this.start, "client")
        return {
            x: end.x - start.x
            , y: end.y - start.y
        }
    }
    getEventCenterPoint(e: TouchEvent, value: string = "client") {
        if (e["savedPoint"]) {
            console.error("GETPOPP", e, e["savedPoint"])
            return e["savedPoint"]
        }
        let p = {
            x: 0
            , y: 0
        }
        for (let index = 0; index < e.touches.length; index += 1) {
            let touch = e.touches[index]
            p.x += touch[value + "X"]
            p.y += touch[value + "Y"]
        }
        p.x /= e.touches.length
        p.y /= e.touches.length
        return p
    }
    decoration(e: TouchEvent) {
        let point = this.getEventCenterPoint(e)
        e["savedPoint"] = point
    }
    add(e: TouchEvent) {
        let point = this.getEventCenterPoint(e)
        e["savedPoint"] = point
        console.error(point)
        this.moves.push(e)
    }
}
