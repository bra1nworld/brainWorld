import { Layer2d, Drawable } from "./layer2d"
import * as dat from "../../lib/dat.gui"
import { ActionList } from "./actionList"
import { AnnotationScene, Interactable, SmartPoints } from "./annotationScene"
export abstract class InteractableAnnotationGeometry implements Interactable {
    annotation: SceneAnnotation.Annotation
    abstract type: string
    abstract setMeta(any)
    abstract redraw()
    abstract toJSON(): SceneAnnotation.Annotation
    abstract data: {
        color: string
    }
    inScene: boolean
    abstract object: THREE.Object3D
    abstract startEdit()
    abstract endEdit()
    abstract attach(scene: AnnotationScene)
    abstract detach()
    abstract show()
    abstract hide()
    abstract activate()
    abstract deactivate()
    abstract hitTest(camera: THREE.Camera, position: THREE.Vector2)
}

export namespace InteractableAnnotationGeometry {
    export function fromJSON(data: SceneAnnotation.Annotation, actionList: ActionList, readonly: boolean): InteractableAnnotationGeometry {
        switch (data.type) {
            case "rectangle":
                return new RectangleInteractable(data, actionList, readonly)
            case "points":
                return new PointsInteractable(data, actionList, readonly)

        }
    }
}
export class PointsInteractable extends InteractableAnnotationGeometry {
    static type = "points"
    type = "points"
    points = SmartPoints.create()
    object = this.points.mesh
    pointIndice: number[] = []
    private addPointReference(index: number) {
        if (this.pointIndice.indexOf(index) < 0) {
            this.pointIndice.push(index)
        }
    }
    private removePointReference(index: number) {
        this.pointIndice = this.pointIndice.filter(item => item !== index)
    }
    constructor(public annotation: SceneAnnotation.Annotation, public actionList: ActionList, public readonly: boolean) {
        super()
        let geo = (annotation.geometry || {}) as SceneAnnotation.Annotation.Points
        this.pointIndice = geo.pointIndice || []
        this.points.color = new THREE.Color("#aa0000")
        this.actionList.events.listenBy(this, "action", (action) => {
            this.startDraw(action)
        })
    }

    startDraw(action: string) {
        let rotatedPs = this.scene.points.getRotatedPoints()//获得旋转之后的点
        let ps = this.scene.points.getPoints()
        let proc = new RingDrawingProcedure(this.scene.layer2d)
        proc.getRing((err, ring) => {
            let index = 0
            for (let point of rotatedPs) {//将ring和旋转之后的points坐标匹配
                let p25d = point.clone()
                // map to 2D screen space
                let ratio = window.devicePixelRatio
                p25d.project(this.scene.camera)
                p25d.x = Math.round((p25d.x + 1) * this.scene.canvas.width / 2)
                p25d.y = Math.round((- p25d.y + 1) * this.scene.canvas.height / 2)
                p25d.z = 0
                let p2 = new THREE.Vector2(p25d.x, p25d.y)
                if (ring.contains(p2)) {
                    if (action === "add") {
                        this.addPointReference(index)
                    } else if (action === "substract") {
                        this.removePointReference(index)
                    }
                }
                index++
            }
            //根据旋转之后的点的index渲染对应index的mesh上的点
            this.syncPointReferences(ps)
        })
    }

    private syncPointReferences(ps) {
        this.points.setPoints(this.pointIndice.map(i => {
            return ps[i]
        }))
    }
    activate() {
        if (this.scene.points) {
            this.syncPointReferences(this.scene.points.getPoints())
        }
        this.startEdit()
    }
    deactivate() {
        this.endEdit()
    }
    hitTest(camera: THREE.Camera, position: THREE.Vector2) {

    }
    toJSON(): SceneAnnotation.Annotation {
        return {
            type: "points",
            // description: this.annotation.description,
            color: this.data.color,
            geometry: {
                type: "points",
                pointIndice: this.pointIndice
            }
        }
    }
    setMeta(meta: {
        color?: string
    }) {
        if (meta.color) {
            this.data.color = meta.color
        }
        this.redraw()
    }
    data = {
        visible: true,
        color: "#000000"
    }
    startEdit() {

    }
    show() {
        if (this.points.mesh.visible) return
        this.data.visible = true
        this.points.mesh.visible = true
        this.redraw()
    }
    hide() {
        if (!this.points.mesh.visible) return
        this.data.visible = false
        this.points.mesh.visible = false
        this.redraw()
    }
    endEdit() {
    }
    redraw() {
        this.points.mesh.visible = this.data.visible
        this.points.material.setValues({
            color: this.data.color
        } as any)
        this.points.material.needsUpdate = true

    }
    private scene: AnnotationScene
    attach(scene: AnnotationScene) {
        if (scene === this.scene) return
        this.scene = scene
        this.scene.scene.add(this.points.mesh)
        if (this.scene.points) {
            this.syncPointReferences(this.scene.points.getPoints())
        }
        this.startDraw("add")
    }
    detach() {
        this.deactivate()
        this.scene.scene.remove(this.points.mesh)
        this.scene = null
    }
}


type RectAngleInfo = {
    xDistance: number
    yDistance: number
    zDistance: number
    centerPosition: THREE.Vector3
    rotateYAngle: number
    cubeMaterial: {
        color: string,
        wireframe: boolean
    }
    pointIndice?: number[]
}
type ArrawInfo = {
    ringPoints: THREE.Vector2[]
    faceCenterPoint: {
        xNegative: THREE.Vector3
        xPositive: THREE.Vector3
        yNegative: THREE.Vector3
        yPositive: THREE.Vector3
    }
}


export class RectangleInteractable extends InteractableAnnotationGeometry {
    static type = "rectangle"
    type = "rectangle"
    points = SmartPoints.create()
    object = this.points.mesh
    cube: THREE.Mesh
    arrow: THREE.ArrowHelper
    pointIndice: number[] = []
    loadInitDraw = false;
    rectAngleInfo: RectAngleInfo
    arrawInfo: ArrawInfo
    private controller: THREE.TransformControls
    private scene: AnnotationScene

    hasFinishedDraw = true;

    constructor(public annotation: SceneAnnotation.Annotation, public actionList: ActionList, public readonly: boolean) {
        super()
        let geo = (annotation.geometry || {}) as SceneAnnotation.Annotation.Rectangle
        this.rectAngleInfo = geo.rectAngleInfo as RectAngleInfo || null
        this.arrawInfo = geo.arrawInfo as ArrawInfo || null
        this.points.color = new THREE.Color("#aa0000")
        this.actionList.events.listenBy(this, "action", (action) => {
            if (!this.hasFinishedDraw) return
            this.hasFinishedDraw = false;
            let cube = this.cube, arrow = this.arrow;
            //生成cube,arrow之后this变化,需传入新生成的cube,arrow
            this.startDraw({ cube, arrow, action })

        })
    }
    startDraw(option?: {
        cube?: THREE.Mesh,
        arrow?: THREE.ArrowHelper,
        action: string
    }) {
        let action;
        if (option) {
            action = option.action;
            this.scene.scene.remove(option.cube)
            this.scene.scene.remove(option.arrow)
            setTimeout(() => {
                this.hasFinishedDraw = true
            }, 500)
        }
        if (action && action !== "redraw" && action !== "delete") return
        //rotatedPs 获得旋转之后的点
        let rotatedPs = this.scene.points.getRotatedPoints()
        let ps = this.scene.points.getPoints()
        let proc = new RingDrawingProcedure(this.scene.layer2d, "rectangle", this.data.color)

        //firstTime loadInitDraw
        this.syncPointReferences(ps)
        if (!this.loadInitDraw) {
            if (this.rectAngleInfo) {
                this.cube = this.createRectangle(this.rectAngleInfo)
                this.scene.scene.add(this.cube)
                this.addArrow(this.rectAngleInfo, this.arrawInfo)
                this.loadInitDraw = true
                return
            } else {
                this.loadInitDraw = true
            }
        }

        //normalDraw
        this.pointIndice = []
        this.syncPointReferences(ps)
        if (action && action === "delete") return
        proc.getRing((err, ring) => {
            let index = 0
            for (let point of rotatedPs) {//将ring和旋转之后的points坐标匹配
                let p25d = point.clone()
                // map to 2D screen space
                let ratio = window.devicePixelRatio
                p25d.project(this.scene.camera)
                p25d.x = Math.round((p25d.x + 1) * this.scene.canvas.width / 2)
                p25d.y = Math.round((- p25d.y + 1) * this.scene.canvas.height / 2)
                p25d.z = 0
                let p2 = new THREE.Vector2(p25d.x, p25d.y)
                if (ring.contains(p2)) {
                    this.addPointReference(index)
                }
                index++
            }
            let rotateAngle = this.scene.controller.getAzimuthalAngle()
            //根据旋转之后的点的index渲染对应index的旋转前mesh上的点
            this.syncPointReferences(ps)
            this.addRectangle(ps, rotateAngle, ring.points)
        })
    }

    addRectangle(ps: THREE.Vector3[], rotateAngle: number, ringPoints: THREE.Vector2[], pointIndice?: number[]) {
        let xArray = [], yArray = [], zArray = [];
        //rotateAngle:由controller.getAzimuthalAngle()得出的角度即为实际旋转角度(此时-y轴朝向屏幕外),
        //旋转是为了相对摆正坐标轴
        let matrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), -rotateAngle),//转回初始位置(坐标水平竖直)
            reverseMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), rotateAngle);//再次转回最终位置
        //处理选中的点
        let rectPointIndice = pointIndice ? pointIndice : this.pointIndice
        rectPointIndice.forEach(i => {
            let psVec4 = new THREE.Vector4(ps[i].x, ps[i].y, ps[i].z, 1)
            let psResult = psVec4.applyMatrix4(matrix)
            xArray.push(psResult.x)
            yArray.push(psResult.y)
            zArray.push(psResult.z)
        })
        if (xArray.length == 0) {
            return
        }

        let maxX = Math.max.apply(Math, xArray), minX = Math.min.apply(Math, xArray),
            maxY = Math.max.apply(Math, yArray), minY = Math.min.apply(Math, yArray),
            maxZ = Math.max.apply(Math, zArray), minZ = Math.min.apply(Math, zArray);
        let xDistance = maxX - minX;
        let yDistance = maxY - minY;
        let zDistance = maxZ - minZ;
        let xPosition = (maxX + minX) / 2;
        let yPosition = (maxY + minY) / 2;
        let zPosition = (maxZ + minZ) / 2;

        let positionVec3 = new THREE.Vector3(xPosition, yPosition, zPosition)
        //cube中心反向旋转回原来位置
        let resultPosition = positionVec3.applyMatrix4(reverseMatrix)

        this.rectAngleInfo = {
            xDistance: xDistance,
            yDistance: yDistance,
            zDistance: zDistance,
            centerPosition: resultPosition,
            rotateYAngle: rotateAngle,
            cubeMaterial: {
                color: this.data.color,
                wireframe: true
            }
        }
        this.cube = this.createRectangle(this.rectAngleInfo)
        this.scene.scene.add(this.cube)

        //这些点为第一次矩阵变换后的cube的各个面的中点
        let faceCenterPoint = {
            xNegative: new THREE.Vector3(xPosition + xDistance / 2, yPosition, zPosition),
            xPositive: new THREE.Vector3(xPosition - xDistance / 2, yPosition, zPosition),
            yNegative: new THREE.Vector3(xPosition, yPosition, zPosition - zDistance / 2),
            yPositive: new THREE.Vector3(xPosition, yPosition, zPosition + zDistance / 2)
        }
        this.arrawInfo = {
            ringPoints: ringPoints,
            faceCenterPoint: faceCenterPoint
        }
        this.addArrow(this.rectAngleInfo, this.arrawInfo)
    }

    createRectangle(rectAngleInfo: RectAngleInfo): THREE.Mesh {
        let { xDistance, yDistance, zDistance, centerPosition, rotateYAngle, cubeMaterial } = rectAngleInfo
        let material = new THREE.MeshBasicMaterial({
            color: cubeMaterial.color,
            wireframe: cubeMaterial.wireframe
        });
        let geometry = new THREE.CubeGeometry(xDistance, yDistance, zDistance, 0, 0, 0)
        let cube = new THREE.Mesh(geometry, material)
        cube.position.set(centerPosition.x, centerPosition.y, centerPosition.z)
        //cube绕自己Y轴旋转回原来的位置
        if (rotateYAngle) cube.rotateY(rotateYAngle)
        return cube
    }

    addArrow(
        rectAngleInfo: RectAngleInfo,
        arrawInfo: ArrawInfo
    ) {
        let { xDistance, yDistance, zDistance, centerPosition, rotateYAngle, cubeMaterial } = rectAngleInfo
        let { faceCenterPoint, ringPoints } = arrawInfo
        let { xNegative, xPositive, yNegative, yPositive } = faceCenterPoint
        if (!ringPoints) return

        //用到了THREE.Vector3的applyMatrix4属性,需要生成
        let XNegative = new THREE.Vector3(xNegative.x, xNegative.y, xNegative.z),
            XPositive = new THREE.Vector3(xPositive.x, xPositive.y, xPositive.z),
            ZNegative = new THREE.Vector3(yNegative.x, yNegative.y, yNegative.z),
            ZPositive = new THREE.Vector3(yPositive.x, yPositive.y, yPositive.z)

        //旋转之后yz轴变换
        let pointStart = ringPoints[0],
            pointEnd = ringPoints[2];

        //再次转回最终位置
        let matrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), rotateYAngle)
        let rightDir = new THREE.Vector3(1, 0, 0).applyMatrix4(matrix),
            leftDir = new THREE.Vector3(-1, 0, 0).applyMatrix4(matrix),
            topDir = new THREE.Vector3(0, 0, 1).applyMatrix4(matrix),
            bottomDir = new THREE.Vector3(0, 0, -1).applyMatrix4(matrix);

        let arrowDir: THREE.Vector3;
        let arrowOrigin: THREE.Vector3;


        if (xDistance > zDistance) {//确定长短边，箭头在较短的面上
            if (pointEnd.x > pointStart.x) {//起手方向为矩形方向
                arrowDir = rightDir
                arrowOrigin = XNegative.applyMatrix4(matrix)
            } else {
                arrowDir = leftDir
                arrowOrigin = XPositive.applyMatrix4(matrix)
            }
        } else {
            if (pointEnd.y > pointStart.y) {//起手方向为矩形方向
                arrowDir = topDir
                arrowOrigin = ZPositive.applyMatrix4(matrix)
            } else {
                arrowDir = bottomDir
                arrowOrigin = ZNegative.applyMatrix4(matrix)
            }
        }

        let arrowLength = 3;
        let arrowHeadLength = 1;
        let arrowHeadWidth = 0.5;
        let arrowColor = parseInt(`0x${cubeMaterial.color.split("#")[1]}`, 16);
        this.arrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowLength, arrowColor, arrowHeadLength, arrowHeadWidth);
        this.scene.scene.add(this.arrow);
        let arrowObject = this.arrow as THREE.Object3D
        this.arrow.rotateY(rotateYAngle)

    }
    private addPointReference(index: number) {
        if (this.pointIndice.indexOf(index) < 0) {
            this.pointIndice.push(index)
        }
    }
    private removePointReference(index: number) {
        this.pointIndice = this.pointIndice.filter(item => item !== index)
    }
    private syncPointReferences(ps) {
        this.points.setPoints(this.pointIndice.map(i => {
            return ps[i]
        }))
    }
    activate() {
        if (this.scene && this.scene.points) {
            this.syncPointReferences(this.scene.points.getPoints())
        }
        this.startEdit()
    }
    deactivate() {
        this.endEdit()
    }
    hitTest(camera: THREE.Camera, position: THREE.Vector2) {

    }
    toJSON(): SceneAnnotation.Annotation {
        let rectAngleInfo = this.rectAngleInfo as SceneAnnotation.RectAngleInfo,
            arrawInfo = this.arrawInfo as SceneAnnotation.ArrawInfo
        let random = Math.random().toString().substr
        return {
            id: this.annotation.id,
            type: "rectangle",
            color: this.data.color,
            objectType: this.annotation.objectType,
            geometry: {
                type: "rectangle",
                rectAngleInfo: rectAngleInfo,
                arrawInfo: arrawInfo
            }
        }
    }
    setMeta(meta: {
        color?: string
    }) {
        if (meta.color) {
            this.data.color = meta.color
        }
        this.redraw()
    }
    data = {
        visible: true,
        color: "#000000"
    }
    startEdit() {
    }
    show() {
        if (this.points.mesh.visible) return
        this.data.visible = true
        this.points.mesh.visible = true
        if (this.cube) {
            this.cube.visible = true
            this.arrow.visible = true
        }
        this.redraw()
    }
    hide() {
        if (!this.points.mesh.visible) return
        this.data.visible = false
        this.points.mesh.visible = false
        if (this.cube) {
            this.cube.visible = false
            this.arrow.visible = false
        }
        this.redraw()
    }
    endEdit() {
    }
    redraw() {
        this.points.mesh.visible = this.data.visible
        this.points.material.setValues({
            color: this.data.color
        } as any)
        if (this.cube) {
            this.cube.material.setValues({
                color: this.data.color
            } as any)
        }
        if (this.rectAngleInfo) {
            this.rectAngleInfo.cubeMaterial.color = this.data.color
        }
        // this.arrow.setColor() has problem
        if (this.arrow) {
            this.arrow.line.material.setValues({
                color: this.data.color
            } as any)
            this.arrow.cone.material.setValues({
                color: this.data.color
            } as any)
        }

        this.points.material.needsUpdate = true
    }

    attach(scene: AnnotationScene) {
        if (scene === this.scene) return
        this.scene = scene
        this.scene.scene.add(this.points.mesh)
        if (this.scene.points) {
            this.syncPointReferences(this.scene.points.getPoints())
        }
        //初始加载
        // if (!this.loadInitDraw && this.rectAngleInfo) {
        //     this.startDraw()
        // } else {
        this.startDraw()
    }
    detach() {
        this.deactivate()
        this.scene.scene.remove(this.points.mesh)
        if (this.cube) {
            this.scene.scene.remove(this.cube)
            this.scene.scene.remove(this.arrow);
        }
        this.scene = null
    }
}
class Ring implements Drawable {
    constructor(public points: THREE.Vector2[], public color?: string) {
    }
    contains(p: THREE.Vector2): boolean {
        p = p.clone().multiplyScalar(1 / window.devicePixelRatio)
        if (this.points.length == 0) return false
        let tops: number = 0
        let bottoms: number = 0
        for (let i = 0; i < this.points.length; i++) {
            let start = this.points[i]
            let end = this.points[i + 1]
            if (!end) {
                end = this.points[0]
            }
            if ((end.x - p.x) * (p.x - start.x) >= 0 && start.x - p.x !== 0) {
                let iy = (p.x - end.x) / (start.x - end.x) * (start.y - end.y) + end.y
                if (iy > p.y) {
                    tops += 1
                } else {
                    bottoms += 1
                }
            }
        }
        if ((bottoms + tops) % 2 === 0 && bottoms % 2 === 1) {
            return true
        }
        return false
    }
    closed: boolean = true
    draw(context: CanvasRenderingContext2D) {
        if (this.points.length < 2) return
        let p0 = this.points[0]
        context.save()
        context.moveTo(p0.x, p0.y)
        for (let p of this.points) {
            context.lineTo(p.x, p.y)
        }
        if (this.closed) {
            context.lineTo(p0.x, p0.y)
        }

        context.strokeStyle = this.color ? this.color : "#00ff00"
        context.lineWidth = 1.5
        context.stroke()
        context.restore()
    }

}


class RingDrawingProcedure extends Leaf.States {
    constructor(private layer2d: Layer2d, private type?: string, private color?: string) {
        super()
        console.log("Are you ready?")
        this.debug()
    }
    private ring = new Ring([], this.color)
    getRing(callback: Callback<Ring>) {
        this.events.listenByOnce(this, "state/finish", () => {
            callback(null, this.ring)
        })
        if (this.state === "void")
            this.setState("init")
    }
    handler = (e: MouseEvent) => {
        if (e.type === "mousedown") {

            this.feed("start", new THREE.Vector2(e.clientX, e.clientY))
        }
        if (e.type === "mousemove") {
            this.feed("p", new THREE.Vector2(e.clientX, e.clientY))
        }
        if (e.type === "mouseup") {
            this.feed("last", new THREE.Vector2(e.clientX, e.clientY))
        }
    }
    private pts = this.ring.points
    atInit() {
        this.layer2d.node.addEventListener("mousedown", this.handler)
        this.layer2d.node.addEventListener("mouseup", this.handler)
        this.layer2d.node.addEventListener("mousemove", this.handler)
        this.layer2d.show()
        this.setState("handleFirstPoint")
        this.layer2d.drawables.push(this.ring)
    }
    atHandleFirstPoint() {
        this.consumeWhenAvailable("start", (v) => {
            this.pts.push(v)
            this.consumeAll("p")
            this.setState("handlePoint")
        })
    }
    atHandlePoint() {
        if (this.type) {
            switch (this.type) {
                case "rectangle":
                    this.consumeWhenAvailable("p", (v) => {
                        this.ring.points = this.resetPoints(this.pts, v)
                        this.setState("handlePoint")
                    })
                    this.consumeWhenAvailable("last", (v) => {
                        this.ring.points = this.resetPoints(this.pts, v)
                        this.setState("finish")
                    })
                    break;
            }
        } else {
            this.consumeWhenAvailable("p", (v) => {
                this.pts.push(v)
                this.setState("handlePoint")
            })
            this.consumeWhenAvailable("last", (v) => {
                this.pts.push(v)
                this.setState("finish")
            })
        }

    }
    resetPoints(pts, v) {
        let resultPoints: THREE.Vector2[] = []
        resultPoints.push(pts[0])
        resultPoints.push(new THREE.Vector2(v.x, pts[0].y))
        resultPoints.push(v)
        resultPoints.push(new THREE.Vector2(pts[0].x, v.y))
        return resultPoints
    }
    atFinish() {
        this.layer2d.node.removeEventListener("mousedown", this.handler)
        this.layer2d.node.removeEventListener("mouseup", this.handler)
        this.layer2d.node.removeEventListener("mousemove", this.handler)
        this.layer2d.hide()
        this.layer2d.drawables = this.layer2d.drawables.filter(item => item != this.ring)
    }
}
