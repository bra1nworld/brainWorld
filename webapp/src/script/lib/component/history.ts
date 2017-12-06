// HistoryLogicalState: ...raw(none) - hijacked - void
//
const TITLE_HOLDER = null
export interface HistoryStateInfo {
    fromWhere: "hijacked" | "none" | "void"
}
export class HistoryState extends Leaf.States<string, {
    popstate
    goto
}> {
    events = new Leaf.EventEmitter<{
        goto: string
        reset: void
        state: string
    }>()
    constructor(public history: History) {
        super()
        this.debug()
        this.setState("initActivating")
    }
    private browserHistory = window.history
    protected data: {
        goto?: GotoInfo
    } = {}
    atInitActivating() {
        this.browserHistory.pushState({
            fromWhere: "none"
        }, TITLE_HOLDER, this.history.getLocation())
        this.setState("hijacking")
    }
    atHijacking() {
        // push checking state into history and thus we are now at hijacked state
        this.browserHistory.pushState({
            fromWhere: "hijacked"
        }, TITLE_HOLDER, this.history.getLocation())
        this.setState("appendVoid")
    }
    atAppendVoid() {
        this.browserHistory.pushState({
            fromWhere: "void"
        }, TITLE_HOLDER, this.history.getLocation())
        this.setState("waiting")
    }
    atWaiting(stale) {
        // waiting state is guaranteed to be at solving
        this.consumeWhenAvailable("popstate", (e: PopStateEvent) => {
            if (!e.state) {
                this.error(new Error("EmptyState likely get out of our history session"))
                return
            }
            let state = e.state as any as HistoryStateInfo
            if (state.fromWhere === "hijacked") {
                if (this.data.goto) {
                    this.history.popAll()
                    this.setState("goto")
                    return
                } else if (this.history.stack.length > 0) {
                    this.history.pop()
                    this.setState("appendVoid")
                    return
                } else {
                    // really go back
                    this.setState("back")
                    return
                }
            } else if (state.fromWhere === "none") {
                console.error("broken state", state)
                this.error(new Error("broken none"))
            } else {
                console.error("Unknown state", state)
                this.error(new Error("Unknown state"))
                this.browserHistory.back()
            }
        })
        if (stale()) return
        this.consumeWhenAvailable("goto", (info: GotoInfo) => {
            // preventing further consuming
            this.clearConsumers()
            this.data.goto = info
            this.browserHistory.back()
            this.setState("waiting")
        })
    }
    atGoto(stale) {
        if (!this.data.goto) {
            this.error(new Error("Invalid goto state without goto"))
            return
        }
        this.consumeWhenAvailable("popstate", (e: PopStateEvent) => {
            if (stale()) return
            if (!e.state) {
                this.error(new Error("Invalid goto state"))
                return
            }
            this.setState("applyGotoUrl")
        })
        this.browserHistory.back()
    }
    atApplyGotoUrl() {
        let info = this.data.goto
        if (!info) {
            this.error(new Error("Invalid apply goto url"))
            return
        }
        this.browserHistory.pushState({
            fromWhere: "none"
        } as HistoryStateInfo, TITLE_HOLDER, this.data.goto.url)
        this.data.goto = null
        setTimeout(() => {
            if (!info.silent) {
                this.history.events.emit("goto", this.history.getLocation())
            }
        }, 0)
        this.setState("hijacking")
    }
    atBack() {
        this.consumeWhenAvailable("popstate", (e: PopStateEvent) => {
            if (!e.state || e.state.fromWhere !== "none") {
                this.setState("retire")
                return
            }
            this.setState("applyBack")
        })
        this.browserHistory.back()
    }
    atApplyBack() {
        this.consumeWhenAvailable("popstate", (e: PopStateEvent) => {
            if (!e.state || e.state.fromWhere !== "none") {
                this.setState("retire")
                return
            }
            setTimeout(() => {
                this.history.events.emit("goto", this.history.getLocation())
            }, 0)
            this.setState("hijacking")
        })
        this.browserHistory.back()
    }
    atRetire() {
        // really go back
        this.browserHistory.back()
    }
}

export class History {
    static instance: History = null
    public stack: BackButtonInfo[] = []
    public events = new Leaf.EventEmitter<{
        goto: string
    }>()
    public state: HistoryState = null
    constructor() {
        if (History.instance) return History.instance
        this.state = new HistoryState(this)
        window.addEventListener("popstate", (e) => {
            this.state.feed("popstate", e)
        })
        History.instance = this
    }
    goto(url: string, silent: boolean = false) {
        this.state.feed("goto", {
            url, silent
        })
    }
    registerBackButton(id: any, handler: Function) {
        this.stack.push({
            id, handler
        })
    }
    removeBackButton(id: any) {
        this.stack = this.stack.filter(item => item.id !== id)
    }
    getLocation() {
        return window.location.toString()
    }
    pop(): boolean {
        let item = this.stack.pop()
        if (!item) {
            return false
        }
        try {
            item.handler()
        } catch (e) {
            console.error(e)
        }
        return true
    }
    popAll() {
        while (this.pop());
    }
}

export interface BackButtonInfo {
    id: any
    handler: Function
}
export interface GotoInfo {
    url: string
    silent: boolean
}
