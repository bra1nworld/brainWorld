import { Inspector } from "./inspector"
import { ContinuousCounter } from "./continuousCounter"
export class MobileConsole extends Leaf.Widget {
    constructor() {
        super("<div data-id='container'></div>")
        this.node.style.whiteSpace = "pre-wrap"
        this.node.style.width = "100%"
        this.node.style.height = "50%"
        this.node.style.position = "absolute"
        this.node.style.left = "0"
        this.node.style.bottom = "0"
        this.node.style.overflowY = "auto"
        this.node.style.background = "rgba(0,0,0,.7)"
        this.node.style.color = "white"
        this.node.style["webkitOverflowScrolling"] = "touch"
    }
    inspect = new Inspector()
    log(...args: any[]) {
        this.content(args, "white")
    }
    error(...args: any[]) {
        this.content(args, "red")
    }
    content(args: any[], color: string) {
        let allString = args.every((item) => {
            return typeof item === "string"
        })
        let content: string
        if (allString) {
            content = args.join(" ")
        }
        else {
            content = args.map(item => this.inspect.inspect(item, 8)).join(" ")
        }
        let span = document.createElement("div")
        span.textContent = content
        this.node.appendChild(span)
        this.node.scrollTop = this.node.clientHeight
        span.style.color = color
    }
    public isShow
    show() {
        if (this.isShow) return
        this.isShow = true
        document.body.appendChild(this.node)
        this.node.scrollTop = this.node.clientHeight
    }
    hide() {
        if (!this.isShow) return
        this.isShow = false
        document.body.removeChild(this.node)
    }
    toggle() {
        if (this.isShow) {
            this.hide()
        } else {
            this.show()
        }
    }
    static initialize(): MobileConsole {
        if (this.console) return this.console
        this.console = new MobileConsole()
        let counter = new ContinuousCounter({
            count: 5,
            during: 1500
        })
        counter.events.listenBy(this, "trigger", () => {
            this.console.toggle()
            this.console.log("Log start:")
        })
        window.onerror = (err) => {
            this.console.error(err)
        }
        document.body.addEventListener("touchstart", () => {
            counter.trigger()
        }, true)
        return this.console
    }
    static console: MobileConsole
}
