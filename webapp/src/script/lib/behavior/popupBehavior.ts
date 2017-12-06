export class PopupStack {
    public index: number = 0
    public popups: PopupBehavior[] = []
    constructor(public readonly base: number = 10000) {
    }
    public add(p: PopupBehavior): boolean {
        if (this.popups.indexOf(p) >= 0) {
            return false
        }
        this.popups.push(p)
        p.zIndex = ++this.index + this.base
        return true
    }
    public remove(p: PopupBehavior): boolean {
        let change = false
        this.popups = this.popups.filter((old) => {
            if (old === p) {
                change = true
                return false
            }
            return true
        })
        let last = this.popups[this.popups.length - 1]
        if (last) {
            this.index = last.zIndex - this.base
        } else {
            this.index = 0
        }
        return change
    }
}
export class PopupBehavior {
    static globalManager = new PopupStack()
    public zIndex: number
    public isShow: boolean = false
    constructor(private widget: {
        node: HTMLElement
    }, private manager: PopupStack = PopupBehavior.globalManager) {
    }
    public show() {
        if (this.isShow) return
        this.isShow = true
        this.manager.add(this)
        let node = this.widget.node as HTMLElement
        node.style.position = "absolute"
        node.style.zIndex = this.zIndex.toString()
        document.body.appendChild(this.widget.node)
    }
    public hide() {
        this.manager.remove(this)
        if (!this.isShow) return
        this.isShow = false
        this.manager.remove(this)
        document.body.removeChild(this.widget.node)
    }
    public center() {
        if (!this.isShow) return null
        let rect = this.widget.node.getBoundingClientRect()
        let winWidth = window.document.body.offsetWidth
        let winHeight = window.document.body.offsetHeight
        let left = (winWidth - rect.width) / 2
        let top = (winHeight - rect.height) / 2
        this.widget.node.style.top = top + "px"
        this.widget.node.style.left = left + "px"
        return {
            x: left
            , y: top
        }
    }
}
