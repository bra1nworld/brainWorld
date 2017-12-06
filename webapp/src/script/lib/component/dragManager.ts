// drag-move
// drag-drop
// drag-finish
// drag-cancel
export class DragManager {
    public listenerEvents: string[] = ["mousedown", "mouseup", "mousemove"]
    public capture: boolean = true
    public behavior: DragManager.Behavior
    public lifeCircle: DragManager.LifeCircle
    public minMovement: 0
    public lastEvent: MouseEvent
    // body will add this class when we are dragging
    public bodyDraggingClass = "dragging"
    public shadow: DragManager.ShadowManager
    constructor() {
        this.behavior = new DragManager.Behavior(this)
        this.shadow = new DragManager.ShadowManager(this)
        this.lifeCircle = new DragManager.LifeCircle(this)
        for (let name of this.listenerEvents) {
            let fnName = name + "Listener"
            this[fnName] = (e) => {
                this.lastEvent = e
                this.lifeCircle.feed("mouse", e)
            }
        }
    }
    public initialize() {

        this.attachListeners()
        this.lifeCircle.init()
    }
    public attachListeners() {
        for (let name of this.listenerEvents) {
            window.addEventListener(name, this[name + "Listener"], this.capture)
        }
    }
    public detachListeners() {
        for (let name of this.listenerEvents) {
            window.removeEventListener(name, this[name + "Listener"])
        }
    }
}
export namespace DragManager {
    export class LifeCircle extends Leaf.States<"waitMouseDown" | "waitInitMouseMove" | "handleInitMove" | "waitMouseContinue" | "handleMouseUp", {
        mouse: MouseEvent
    }> {
        protected data: {
            initMouseDown: MouseEvent
            initMoveEvent: MouseEvent
            finalUpEvent: MouseEvent
        }
        constructor(public readonly dragManager: DragManager) {
            super()
        }
        init() {
            if (this.state === "void") {
                this.setState("waitMouseDown")
            }
        }
        public reset() {
            super.reset()
            if (this.dragManager)
                this.dragManager.behavior.clearDrag()
        }
        atWaitMouseDown() {
            this.dragManager.behavior.clearDrag()
            this.consumeWhenAvailable("mouse", (e: MouseEvent) => {
                if (e.type === "mousedown") {
                    this.data.initMouseDown = e
                    this.setState("waitInitMouseMove")
                } else {
                    this.setState("waitMouseDown")
                }
            })
        }
        atWaitInitMouseMove() {
            this.consumeWhenAvailable("mouse", (e: MouseEvent) => {
                if (e.type === "mousemove") {
                    if (MouseEventHelper.getMouseDistance(e, this.data.initMouseDown) < this.dragManager.minMovement) {
                        this.setState("waitInitMouseMove")
                    } else {
                        this.data.initMoveEvent = e
                        this.setState("handleInitMove")
                    }
                } else {
                    this.setState("waitMouseDown")
                }
            })
        }
        atHandleInitMove() {
            if (!this.dragManager.behavior.dragStart(this.data.initMouseDown)) {
                this.setState("waitMouseDown")
                return
            }
            this.setState("waitMouseContinue")
        }
        atWaitMouseContinue() {
            this.consumeWhenAvailable("mouse", (e: MouseEvent) => {
                if (e.type === "mousemove") {
                    this.dragManager.behavior.dragMove(e)
                    this.setState("waitMouseContinue")
                } else if (e.type === "mouseup") {
                    this.data.finalUpEvent = e
                    this.setState("handleMouseUp")
                } else {
                    this.setState("waitMouseDown")
                }
            })
        }
        atHandleMouseUp() {
            this.dragManager.behavior.drop(this.data.finalUpEvent)
            this.setState("waitMouseDown")
        }
    }
    export class MouseEventHelper {
        static computeRelativeMousePosition(el: HTMLElement, e: MouseEvent) {
            let src = this.getMouseSrc(e)
            if (!el.contains(src))
                return null
            let rect = el.getBoundingClientRect()
            return {
                x: rect.left - e.clientX
                , y: rect.top - e.clientY
            }
        }
        static getMouseSrc(e: Event): HTMLElement | null {
            if (!e) return null
            return e.srcElement as HTMLElement || e.target as HTMLElement
        }
        static isElementDraggable(el: DragManager.DraggableElement) {
            return el && (el.dragSupport === "enabled" || el.getAttribute("drag-support") === "enabled")
        }
        static isElementDragless(el: DragManager.DraggableElement) {
            return !el || (el.dragSupport === "disabled" || el.getAttribute("drag-support") === "disabled")
        }
        static getDefaultShadow(el) {
            let copy = document.createElement("div")
            copy.style.width = "100px"
            copy.style.height = "100px"
            copy.style.border = "3px solid rgba(0,0,0,0.7)"
            copy.style.opacity = "0.5"
            copy.style.backgroundColor = "white"
            copy.style.pointerEvents = "none"
            copy.style.transition = "opacity 200ms"
            copy.style.transform = "scale(0.7)"
            return copy
        }
        static getMousePosition(e: MouseEvent) {
            if (!e) return null
            return {
                x: e.clientX
                , y: e.clientY
            }
        }
        static getMouseDistance(e1: MouseEvent, e2: MouseEvent) {
            let p1 = this.getMousePosition(e1)
            let p2 = this.getMousePosition(e2)
            let dx = p1.x - p2.x
            let dy = p1.y - p2.y
            return Math.sqrt(dx * dx + dy * dy)
        }
        static getDraggable(e: Event): HTMLElement {
            let el = this.getMouseSrc(e)
            while (el) {
                if (this.isElementDragless(el)) {
                    return null
                } else if (this.isElementDraggable(el)) {
                    return el
                }
                el = el.parentElement
            }
        }
        static createCustomEvent(name: string, data: any) {
            return new CustomEvent(name, data)
        }
    }
    export class Behavior {
        // getter/setter
        public currentDraggable: DraggableElement
        public draggingElement: DraggableElement
        public dragSession: DragManager.Session
        constructor(public readonly dragManager: DragManager) {
            let preventDefault = (e: Event) => {
                e.preventDefault()
                e.stopImmediatePropagation()
            }
            let draggingElement = null
            // preventing 
            Object.defineProperty(this, "draggingElement", {
                get: () => {
                    return draggingElement
                },
                set: (v) => {
                    if (draggingElement) { }
                    if (v === draggingElement) return
                    if (draggingElement) {
                        let el = draggingElement
                        setTimeout(() => {
                            el.removeEventListener("click", preventDefault, true)
                        }, 1)
                    }
                    draggingElement = v
                    if (!v) return
                    draggingElement.addEventListener("click", preventDefault, true)
                }
            })
        }
        public clearDrag() {
            this.dragManager.shadow.clear()
            this.draggingElement = null
            document.body.classList.remove(this.dragManager.bodyDraggingClass)
        }
        public dragStart(e: MouseEvent): boolean {
            let src = MouseEventHelper.getDraggable(e)
            this.clearDrag()
            if (!src) return false
            e.preventDefault()
            e.stopImmediatePropagation()
            document.body.classList.add(this.dragManager.bodyDraggingClass)
            this.dragSession = new Session(this.dragManager)
            this.currentDraggable = src
            let event = MouseEventHelper.createCustomEvent("drag-init", {
                detail: this.dragSession,
                bubbles: true
            })
            src.dispatchEvent(event)
            this.draggingElement = src
            if (this.draggingElement.dragBehavior === "auto" || this.draggingElement.getAttribute("drag-behavior") === "auto") {
                this.dragManager.shadow.shadowScale = 0.7
                this.dragManager.shadow.setDraggingStyle()
                this.dragManager.shadow.setShadowElement(MouseEventHelper.getDefaultShadow(this.draggingElement), MouseEventHelper.computeRelativeMousePosition(src, e))
            }
            return true

        }
        public dragMove(e: MouseEvent) {
            let event = MouseEventHelper.createCustomEvent("drag-move", {
                detail: this.dragSession,
                bubbles: true
            })
            if (this.draggingElement) {
                this.draggingElement.dispatchEvent(event)
            }

            let target = MouseEventHelper.getMouseSrc(e)
            event = MouseEventHelper.createCustomEvent("drag-stand", {
                detail: this.dragSession,
                bubbles: true
            })
            target.dispatchEvent(event)
            if (!event.defaultPrevented) {
                for (let p of this.dragSession.protocols) {
                    let event = MouseEventHelper.createCustomEvent(`drag-stand/${p.type}`, {
                        detail: this.dragSession,
                        protocol: p,
                        bubbles: true
                    })
                    target.dispatchEvent(event)
                }
            }
            target.dispatchEvent(event)
            this.dragManager.shadow.updateShadowPosition()
        }
        public drop(e: MouseEvent) {
            this.dragManager.shadow.restoreDraggingStyle()
            let target = MouseEventHelper.getMouseSrc(e)
            let event = MouseEventHelper.createCustomEvent("drag-drop", {
                detail: this.dragSession,
                bubbles: true
            })
            target.dispatchEvent(event)
            if (!event.defaultPrevented) {
                for (let p of this.dragSession.protocols) {
                    let event = MouseEventHelper.createCustomEvent(`drag-drop/${p.type}`, {
                        detail: this.dragSession
                        , bubbles: true
                    })
                    target.dispatchEvent(event)

                }
            }
            event = MouseEventHelper.createCustomEvent("drag-finish", {
                detail: this.dragSession
                , bubbles: true
            })
            if (this.draggingElement.contains(target)) {
                e.preventDefault()
                e.stopImmediatePropagation()
            }
            if (this.dragSession.isConsumed) {
                event = MouseEventHelper.createCustomEvent("drag-cancel", {
                    detail: this.dragSession
                    , bubbles: true
                })
            }
            this.draggingElement.dispatchEvent(event)
            this.draggingElement = null
            this.dragManager.shadow.clear()
        }
    }
    export class ShadowManager {
        constructor(public readonly dragManager: DragManager) {

        }
        public draggingShadow: HTMLElement
        public dragFix = {
            x: 0, y: 0
        }
        public savedStyle: {
            opacity: string
            transition: string
        } = null
        public savedElement: DraggableElement
        // scaling the shadow
        public shadowScale: number = 0.7
        public shadowZIndex: number = 1000000
        public setShadowElement(el: HTMLElement, fix: { x: number, y: number } = { x: 0, y: 0 }) {
            if (this.draggingShadow && this.draggingShadow.parentElement) {
                this.draggingShadow.parentElement.removeChild(this.draggingShadow)
            }
            this.draggingShadow = el
            document.body.appendChild(el)
            el.style.position = "absolute"
            el.style.pointerEvents = "none"
            el.style.top = "0"
            el.style.left = "0"
            el.style.zIndex = this.shadowZIndex.toString()
            this.dragFix = fix || { x: 0, y: 0 }
            if (!this.dragFix.x) this.dragFix.x = 0
            if (!this.dragFix.y) this.dragFix.y = 0
            this.updateShadowPosition()
        }
        public updateShadowPosition() {
            if (!this.draggingShadow) return

            let point = MouseEventHelper.getMousePosition(this.dragManager.lastEvent)
            let scaleFix = this.shadowScale || 0.7
            this.draggingShadow.style.position = "absolute"
            this.draggingShadow.style.left = point.x + this.dragFix.x * scaleFix + "px"
            this.draggingShadow.style.top = point.y + this.dragFix.y * scaleFix + "px"
            this.draggingShadow.style.transform = "scale(${this.shadowScale})"
            if (!this.draggingShadow.parentElement) {
                document.body.appendChild(this.draggingShadow)
            }
        }
        public setDraggingStyle() {
            if (this.savedElement) {
                this.restoreDraggingStyle()
            }
            this.savedElement = this.dragManager.behavior.draggingElement
            this.savedStyle = {
                opacity: this.savedElement.style.opacity,
                transition: this.savedElement.style.transition
            }
            this.savedElement.style.opacity = "0.15"
            this.savedElement.style.transition = "all 200ms"
        }
        public clear() {
            if (this.draggingShadow && this.draggingShadow.parentElement) {
                this.draggingShadow.parentElement.removeChild(this.draggingShadow)
            }
            this.draggingShadow = null
        }
        public restoreDraggingStyle() {
            if (this.savedElement) {
                this.savedElement.style.opacity = this.savedStyle.opacity
                this.savedElement.style.transition = this.savedStyle.transition
            }
            this.savedElement = null
        }
    }
    export interface Protocol {
        type: string,
        data: any
    }
    export class Session {
        public protocols: Protocol[] = []
        public protocol: Protocol
        public isConsumed: boolean = false
        constructor(public readonly dragManager: DragManager) {
            Object.defineProperty(this, "protocol", {
                get: () => {
                    return this.protocols[0]
                }
            })
        }
        public add(p: Protocol) {
            this.protocols.push(p)
        }
        public consume() {
            this.isConsumed = true
        }
    }
    export interface DraggableElement extends HTMLElement {
        dragBehavior?: "auto" | "none"
        dragSupport?: "disabled" | "enabled"
    }
    export const instance: DragManager = new DragManager()
}
