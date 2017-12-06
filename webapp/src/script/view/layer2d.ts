export class Layer2d extends R.Layer2d {
    canvas: HTMLCanvasElement
    constructor() {
        super()
        this.canvas = this.node as any as HTMLCanvasElement
    }
    render() {
        this.canvas.width = this.node.clientWidth //* window.devicePixelRatio
        this.canvas.height = this.node.clientHeight //* window.devicePixelRatio
        let context = this.canvas.getContext("2d")
        for (let drawable of this.drawables) {
            if (drawable.hidden) continue
            drawable.draw(context)
        }
    }
    drawables: Drawable[] = []
    show() {
        this.node.style.display = "block"
    }
    hide() {
        this.node.style.display = "none"
    }
}
export interface Drawable {
    draw(context: CanvasRenderingContext2D)
    hidden?: boolean
}
