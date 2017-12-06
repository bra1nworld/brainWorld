///<reference path="../main.ts"/>
import { AnnotationList } from "./annotationList"
import { ObjectTypesDict } from "../dict"
import { AnnotationTypeList } from "./annotationTypeList"
import { PreviewList } from "./previewList"
import { Layer2d } from "./layer2d"
import { App } from "../app"
import { arrayEquals } from "../helpers"
import { FrameTaskList } from "./frameTaskManager"
import { retry } from "async";
export class AnnotationScene extends R.AnnotationScene {
    scene = new THREE.Scene()
    layer2d = new Layer2d()
    // //PerspectiveCamera:
    // camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera = new THREE.OrthographicCamera(-50, 50, 25, -25, 0.01, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, canvas: this.UI.canvas })
    canvas = this.UI.canvas
    controller = new THREE.OrbitControls(this.camera, this.UI.canvas)
    hotkey = new HotkeyManager()
    // interactives = new InteractManager(this.scene, this.camera, this.UI.canvas)
    light = new THREE.DirectionalLight(0xffffff, 1.1)
    ambient = new THREE.AmbientLight(0xffffff, 0.1)
    annotationList
    createList
    previewList
    lockView = false
    updateState: FrameState = "annotated"
    paddingSize: number
    previewPoints
    initAnnotations: SceneAnnotation.Annotation[]
    //gui.add(this, 'size', 0, 10).onChange(this.redraw.bind(this));
    //gui.add(this, 'transparent').onChange(this.redraw.bind(this));
    //gui.add(this, 'opacity', 0, 1).onChange(this.redraw.bind(this));
    //gui.add(this, 'vertexColors').onChange(this.redraw.bind(this));
    //gui.addColor(this, 'color').onChange(this.redraw.bind(this));
    //gui.add(this, 'sizeAttenuation').onChange(this.redraw.bind(this));
    //gui.add(this, 'rotateSystem');
    constructor(public option: {
        frameId: string,//保存annotations
        readonly: boolean//是否只读(详情)
    }, public callback: Callback<null>) {
        super()
        this.renderer.setClearColor(0x000000, 0)
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.layer2d.appendTo(this.node)
        this.layer2d.hide()
        this.camera.position.x = 0
        this.camera.position.y = 0
        this.camera.position.z = 500
        //PerspectiveCamera:
        // this.camera.position.x = 0
        // this.camera.position.y = 180
        // this.camera.position.z = 0
        this.controller.minPolarAngle = 0; // radians
        this.controller.update()
        this.lockChangeView()
        this.light.target.position.set(-1, -1, -1)
        this.scene.add(this.light.target)
        this.scene.add(this.light)
        this.scene.add(this.ambient)
        let gridHelper = new THREE.GridHelper(1000, 200, 0x38d3f5, 0x000000)
        this.scene.add(gridHelper);
        this.initPreviewList()
        this.initAnnotationList()
        this.readonly(this.option.readonly)
        this.loadCloud()
    }

    readonly(readonly: boolean) {
        if (readonly) {
            this.VM.readonly = true
        } else {
            this.VM.readonly = false
        }
    }

    initAnnotationList() {
        this.createList = new AnnotationTypeList(ObjectTypesDict)

        this.annotationList = new AnnotationList(this, this.option.frameId, this.option.readonly)
        this.annotationList.events.listenBy(this, "initialized", () => {
            this.initAnnotations = this.annotationList.getAnnotations()
        })
    }
    initPreviewList() {
        //查询当前帧数
        App.api.getFrameTaskById({ id: this.option.frameId }, (err, result) => {
            if (err) {
                console.error(err)
                return
            }
            App.api.getAnnotatingTaskById({ id: result.taskId }, (taskErr, annotatingTask) => {
                if (taskErr) {
                    console.error(taskErr)
                    return
                }
                this.paddingSize = annotatingTask.paddingSize
                this.VM.taskId = result.taskId;
                this.VM.frameIndex = result.frameIndex.toString();
                App.api.getBagInfo({
                    filePath: result.videoPath
                }, (err, bagInfo) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    this.previewList = new PreviewList(result.frameIndex, bagInfo.frameCount)
                    this.previewList.events.listenBy(this, "click", (index) => {
                        this.previewFrame(result.videoPath, index, Number(result.frameIndex))
                    })
                })
            })
        })
    }

    previewFrame(videoPath: string, targetFrameIndex: number, currentAnnotationIndex: number) {
        App.api.getFramePoints({
            filePath: videoPath,
            frameIndex: targetFrameIndex
        }, (err, result) => {
            if (this.points) this.scene.remove(this.points.mesh)
            if (this.previewPoints) this.scene.remove(this.previewPoints.mesh)
            this.previewPoints = SmartPoints.createFramePoints(result)
            this.scene.add(this.previewPoints.mesh)
            if (targetFrameIndex != currentAnnotationIndex) {
                this.readonly(true)
            } else {
                this.readonly(this.option.readonly)
            }
        })
    }

    checkDataChanged(): boolean {
        console.log(this.initAnnotations)
        let annotations: SceneAnnotation.Annotation[] = this.annotationList.getAnnotations()
        console.log(annotations)
        return !(arrayEquals(this.initAnnotations, annotations))
    }

    onClickNextSavePage() {
        let jumpString = "确定提交该帧数据并跳转到下一帧?"
        if (this.checkDataChanged()) {
            if (window.confirm(jumpString)) {
                this.jumpAnnotationFrame(1)
            }
        } else {
            this.jumpAnnotationFrame(1, true)
        }
    }

    onClickPreSavePage() {
        let jumpString = "确定提交该帧数据并跳转到上一帧?"
        if (this.checkDataChanged()) {
            if (window.confirm(jumpString)) {
                this.jumpAnnotationFrame(-1)
            }
        } else {
            this.jumpAnnotationFrame(-1, true)
        }
    }

    jumpAnnotationFrame(jump: number, readonly?: boolean) {
        let isReadonly = readonly ? true : false
        App.api.getFrameTaskById({
            id: this.option.frameId
        }, (err, result) => {
            if (err) {
                console.error(err)
                return
            }
            let query = {
                taskId: result.taskId,
                frameIndex: result.frameIndex + this.paddingSize * jump
            }
            App.api.findFrameTasks({
                query: query
            }, (err, nextFrame) => {
                if (err) {
                    console.error(err)
                    return
                }
                if (nextFrame.length > 0) {
                    let scene = this.createNewScene({
                        frameId: nextFrame[0].id,
                        readonly: this.option.readonly
                    })
                    if (!isReadonly) {
                        this.submit()
                    }
                    this.replaceScene(scene)
                } else {
                    alert("已是最后一帧,或者无法跳转到下一帧,请返回列表并手动选择.")
                }
            })
        })
    }

    replaceScene(newScene) {
        document.body.removeChild(document.querySelector(".annotating-scene"))
        newScene.appendTo(document.body)
        newScene.render()
    }

    createNewScene(option: {
        frameId: ID,
        readonly: boolean
    }) {
        return new AnnotationScene({
            frameId: option.frameId,
            readonly: option.readonly
        }, this.callback)
    }

    events = new Leaf.EventEmitter<{
        saving
        saved
        submitting
        submitted
        initialized
    }>()
    save(callback?: Callback) {
        let annotations: SceneAnnotation.Annotation[] = this.annotationList.getAnnotations()
        this.events.emit("saving")
        App.api.updateFrameTask({
            id: this.option.frameId,
            updates: {
                annotations: annotations
            }
        }, () => {
            this.events.emit("saved")
            callback()
        })
    }
    submit(callback?: Callback) {
        let annotations: SceneAnnotation.Annotation[] = this.annotationList.getAnnotations()
        this.events.emit("submitting")
        App.api.updateFrameTask({
            id: this.option.frameId,
            updates: {
                annotations: annotations,
                state: this.updateState
            }
        }, () => {
            this.events.emit("submitted")
            callback()
        })
    }

    //返回按钮
    onClickBack() {
        if (this.option.readonly) {
            document.body.removeChild(document.querySelector(".annotating-scene"))
            this.callback()
        } else {
            if (this.checkDataChanged()) {
                if (window.confirm("确认返回?")) {
                    document.body.removeChild(document.querySelector(".annotating-scene"))
                    this.callback()
                }
            } else {
                document.body.removeChild(document.querySelector(".annotating-scene"))
                this.callback()
            }
        }
    }

    onClickSave() {
        this.save(() => {
            this.notification("保存成功!")
        })
    }

    onClickSubmit() {
        this.submit(() => {
            this.notification("提交成功!")
        })
    }

    onClickChangeView() {
        this.lockChangeView()
    }

    lockChangeView() {
        if (!this.lockView) {
            this.controller.maxPolarAngle = 0;
            // this.camera.position.y = 150
            // this.camera.position.z = 0
            // this.camera.position.x = 0
            this.lockView = true
            this.controller.update()
            this.VM.lockView = "解锁俯视角"
        } else {
            this.controller.maxPolarAngle = Math.PI;
            // this.camera.position.y = 150 / (Math.sqrt(2))
            // this.camera.position.z = 150 / (Math.sqrt(2))
            // this.camera.position.x = 0
            this.lockView = false
            this.controller.update()
            this.VM.lockView = "锁定俯视角"
        }
    }
    public step = 0
    public points: SmartPoints

    loadCloud() {
        App.api.getFrameTaskById({ id: this.option.frameId }, (err, frameTask) => {
            if (err) {
                console.error(err)
                return
            }
            App.api.getFramePoints({
                filePath: frameTask.videoPath,
                frameIndex: frameTask.frameIndex
            }, (err, result) => {
                //使用BufferGeometry
                this.points = SmartPoints.createFramePoints(result)

                // this.points = SmartPoints.create()
                // this.points.setFramePoints(result, new THREE.Color(0, 255, 255))
                //旋转mesh，同时camera position为（0,50,0）,但实际points并未旋转
                //旋转后-y轴朝屏幕外
                // this.points.mesh.rotateX(-Math.PI / 2)

                this.scene.add(this.points.mesh)
                this.annotationList.provider.refresh()
            })
        })


        // let loader = new THREE.PCDLoader()
        // loader.load("/resource/test.pcd", (mesh) => {
        //     this.points = SmartPoints.fromPointsCloud(mesh)
        //     //旋转mesh，同时camera position为（0,50,0）,但实际points并未旋转
        //     //旋转后-y轴朝屏幕外
        //     this.points.mesh.rotateX(-Math.PI / 2)
        //     this.scene.add(this.points.mesh)
        //     this.annotationList.provider.refresh()
        // })
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.layer2d.render()
        this.light.target.position.set(-this.camera.position.x, -this.camera.position.y, -this.camera.position.z)
    }

    notification(info: string) {
        Notification.requestPermission().then(() => {
            let notification = new Notification("信息", {
                body: info
            })
            setTimeout(() => {
                notification.close()
            }, 1000)
        })
    }
}


class Controls {
    constructor(public scene: THREE.Scene) {
        this.redraw();
    }
    size = 0.2;
    transparent = true;
    opacity = 1;
    vertexColors = true;
    color = 0xffffff;
    sizeAttenuation = true;
    rotateSystem = false;
    redraw() {
        //if (this.scene.getObjectByName("particles")) {
        //    this.scene.remove(this.scene.getObjectByName("particles"));
        //}
        //this.createParticles(this.size, this.transparent, this.opacity, this.vertexColors, this.sizeAttenuation, this.color);
    }
    cloud: THREE.Points
    createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {
        var geom = new THREE.Geometry();
        var material = new THREE.PointsMaterial({
            size: this.size,
            transparent: this.transparent,
            opacity: this.opacity,
            vertexColors: this.vertexColors,
            sizeAttenuation: this.sizeAttenuation,
            color: this.color
        });
        var range = 500;
        for (var i = 0; i < 15000; i++) {
            var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
            geom.vertices.push(particle);
            //color = new THREE.Color(0x00ff00);
            //color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
            geom.colors.push(color);
        }
        this.cloud = new THREE.Points(geom, material);
        this.cloud.name = "particles";
        this.scene.add(this.cloud);
    }
}

export class InteractManager {
    constructor(public scene: THREE.Scene, public camera: THREE.Camera, public listeningElement: HTMLElement) {
    }
    add(item: Interactable) {
        if (this.items.indexOf(item) >= 0) return
        if (!item.inScene) {
            item.inScene = true
            this.items.push(item)
        }
        this.scene.add(item.object)
    }
    attach(item: Interactable) {
        if (this.current === item) return
        if (this.current) this.current.endEdit()
        this.current = item
        item.startEdit()
    }
    current: Interactable = null
    items: Interactable[] = []
}

export interface Interactable {
    inScene: boolean
    object: THREE.Object3D
    startEdit()
    endEdit()
    attach(scene: AnnotationScene)
    show()
    hide()
}

class HotkeyManager {
    isActive = true
    constructor() {
        window.addEventListener("keydown", (e) => {
            if (!this.isActive) return
            if (e.which == Leaf.Key.c) {
                this.events.emit("create")
            }
        })
    }
    events = new Leaf.EventEmitter<{
        create
    }>()
}

export class SmartPoints {
    public geometry: THREE.Geometry
    public bufferGeometry: THREE.BufferGeometry
    public material: THREE.PointsMaterial
    public mesh: THREE.Points
    public rotatedPoints: THREE.Vector3[]
    private isRotatedPoints = false
    static fromPointsCloud(cloud: THREE.Points) {
        let bg = cloud.geometry as THREE.BufferGeometry
        let attrs = bg.getAttribute("position")
        let counter = 0
        let geo = new THREE.Geometry()
        while (counter < attrs.count) {
            let p = new THREE.Vector3(attrs.getX(counter), attrs.getY(counter), attrs.getZ(counter))
            counter++
            geo.vertices.push(p)
            geo.colors.push(new THREE.Color(0x000000))
        }
        let sp = new SmartPoints()
        sp.geometry = geo
        sp.material = new THREE.PointsMaterial({
            size: 1,
            transparent: true,
            opacity: 1,
            vertexColors: 0x000000,
            sizeAttenuation: false,
            color: 0x000000
        })
        sp.mesh = new THREE.Points(sp.geometry, sp.material)
        return sp
    }

    static create() {
        let sp = new SmartPoints()
        sp.geometry = new THREE.Geometry()
        sp.material = new THREE.PointsMaterial({
            size: 2,
            transparent: true,
            opacity: 1,
            // vertexColors: 0x000000,
            sizeAttenuation: false,
            // color: 0x000000
        })
        sp.geometry.vertices.push(new THREE.Vector3(0, 0, 0))
        //sp.geometry.colors.push(new THREE.Color(0x000000))
        sp.mesh = new THREE.Points(sp.geometry, sp.material)
        return sp
    }
    static fromPoints(points: THREE.Points) {
        let bg = points.geometry as THREE.BufferGeometry
        let attrs = bg.getAttribute("position")
        let counter = 0
        let geo = new THREE.Geometry()
        while (counter < attrs.count) {
            let p = new THREE.Vector3(attrs.getX(counter), attrs.getY(counter), attrs.getZ(counter))
            counter++
            geo.vertices.push(p)
            geo.colors.push(new THREE.Color(0x000000))
        }
        let sp = new SmartPoints()
        sp.geometry = geo
        sp.material = new THREE.PointsMaterial({
            size: 0.2,
            transparent: true,
            opacity: 1,
            vertexColors: 0x000000,
            sizeAttenuation: false,
        })
        sp.mesh = new THREE.Points(sp.geometry, sp.material)
        return sp

    }

    static createFramePoints(points: Point[]) {
        //使用BufferGeometry,可单独处理每一个点的position和color,
        //同时mesh和points位置和旋转一直,不用在单独做处理
        let sp = new SmartPoints()
        sp.rotatedPoints = []
        sp.bufferGeometry = new THREE.BufferGeometry()
        let positions = new Float32Array(points.length * 3),
            //colors rgb的值为0-1
            colors = new Float32Array(points.length * 3),
            zPositions = [];

        for (let i = 0, l = points.length; i < l; i++) {
            //y轴,z轴做转换,即this.points.mesh.rotateX(-Math.PI / 2)
            //由于使用的是BufferGeometry,mesh和points同时旋转
            sp.rotatedPoints.push(new THREE.Vector3(points[i].x, points[i].z, -points[i].y))
            positions[i * 3] = points[i].x
            positions[i * 3 + 1] = points[i].z
            positions[i * 3 + 2] = -points[i].y

            zPositions.push(points[i].z)
        }
        let heightest = Math.max.apply(Math, zPositions),
            lowest = Math.min.apply(Math, zPositions);
        let lowestColorZ = -3,
            heightestColorZ = 3,
            lowestColorH = 0,
            heightestColorH = 120;
        for (let i = 0, l = zPositions.length; i < l; i++) {
            let rgb;
            if (zPositions[i] < lowestColorZ) {
                rgb = SmartPoints.hsvtorgb(lowestColorH, 100, 100)
            } else if (zPositions[i] > heightestColorZ) {
                rgb = SmartPoints.hsvtorgb(heightestColorH, 100, 100)
            } else {
                rgb = SmartPoints.hsvtorgb(lowestColorH + (heightestColorH - lowestColorH) * ((zPositions[i] - lowestColorZ) / (heightestColorZ - lowestColorZ)), 100, 100)
            }
            colors[i * 3] = rgb[0] / 255
            colors[i * 3 + 1] = rgb[1] / 255
            colors[i * 3 + 2] = rgb[2] / 255
        }
        sp.bufferGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        sp.bufferGeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
        sp.bufferGeometry.computeBoundingBox();
        let material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: THREE.VertexColors,
            transparent: true,
            opacity: 1,
            sizeAttenuation: false
        });
        sp.mesh = new THREE.Points(sp.bufferGeometry, material)
        return sp
    }

    static hsvtorgb(h, s, v) {
        s = s / 100;
        v = v / 100;
        var h1 = Math.floor(h / 60) % 6;
        var f = h / 60 - h1;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        var r, g, b;
        switch (h1) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    setFramePoints(points: Point[], color?: THREE.Color) {
        //该方法可以设置points颜色无效,只能通过material设置整体颜色
        this.geometry = new THREE.Geometry()
        console.log(color)
        for (let p of points) {
            this.geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z))
            this.geometry.colors.push(new THREE.Color(0, 0, 255))
        }

        this.geometry.verticesNeedUpdate = true
        this.geometry.colorsNeedUpdate = true
        this.material.needsUpdate = true
        this.mesh.geometry = this.geometry
    }

    setPoints(points: THREE.Vector3[], colors: THREE.Color[] = []) {
        this.geometry = new THREE.Geometry()
        this.geometry.vertices.push(...points)
        this.mesh.geometry = this.geometry
        this.geometry.verticesNeedUpdate = true
        //this.geometry.colorsNeedUpdate = true
        //this.material.needsUpdate = true
        //this.mesh.geometry = this.geometry
    }
    getPoints(): THREE.Vector3[] {
        //使用BufferGeometry,从新获得points
        return this.rotatedPoints

        // return this.geometry.vertices.slice()
    }
    getRotatedPoints(): THREE.Vector3[] {
        //使用BufferGeometry,不用单独获得rotatedPoints,所以代码和getPoints一样
        return this.rotatedPoints

        // let points = this.geometry.vertices.slice();
        //this.geometry.vertices旋转点只能执行一次
        // if (!this.isRotatedPoints) {
        // points.map(point => {
        //     let t = point.y;
        //     point.y = point.z;
        //     point.z = -t;
        // })
        // console.log(123)
        // this.isRotatedPoints = true
        // }
        // return points
    }
    public color: THREE.Color = new THREE.Color(0, 255, 255);
    // return indexes
    getPoints2D(option: {
        camera: THREE.Camera,
        leftTop: THREE.Vector2,
        rightBottom: THREE.Vector2
    }): number[] {
        return []
    }
    forPoints(indexes: number[] = null, handler: ((p: THREE.Vector3, index) => void)) {
    }
}
