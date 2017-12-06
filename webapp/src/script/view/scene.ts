///<reference path="../main.ts"/>
import * as dat from "../lib/dat.gui"
export class Scene extends R.Scene {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, canvas: this.UI.canvas })
    controls = new Controls(this.scene)
    controller = new THREE.OrbitControls(this.camera, this.UI.canvas)
    hotkey = new HotkeyManager()
    interactives = new InteractManager(this.scene, this.camera, this.UI.canvas)
    light = new THREE.DirectionalLight(0xffffff, 0.9)
    ambient = new THREE.AmbientLight(0xffffff, 0.2)
    //gui.add(this, 'size', 0, 10).onChange(this.redraw.bind(this));
    //gui.add(this, 'transparent').onChange(this.redraw.bind(this));
    //gui.add(this, 'opacity', 0, 1).onChange(this.redraw.bind(this));
    //gui.add(this, 'vertexColors').onChange(this.redraw.bind(this));
    //gui.addColor(this, 'color').onChange(this.redraw.bind(this));
    //gui.add(this, 'sizeAttenuation').onChange(this.redraw.bind(this));
    //gui.add(this, 'rotateSystem');
    constructor() {
        super()
        this.renderer.setClearColor(0x000000, 0)
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.camera.position.x = 20
        this.camera.position.y = 0
        this.camera.position.z = 50
        this.controller.update()
        this.hotkey.events.listenBy(this, "create", () => {
            let box = new BoxInteractable()
            this.interactives.add(box)
            this.interactives.attach(box)
            this.setMode("meshMove")
        })
        this.light.target.position.set(-1, -1, -1)
        this.scene.add(this.light.target)
        this.scene.add(this.light)
        this.scene.add(this.ambient)
        this.scene.add(new THREE.GridHelper(1000, 100, 0xff0000));
    }
    setMode(mode: "meshMove" | "sceneMove") {
        if (mode === "meshMove") {
            //this.controller.enabled = false
        } else if (mode === "sceneMove") {
            this.controller.enabled = true
            this.interactives.currentObjectController.detach()
        }
    }
    private step = 0
    render() {
        if (this.controls.rotateSystem) {
            this.step += 0.01;
            this.controls.cloud.rotation.x = this.step;
            this.controls.cloud.rotation.z = this.step;
        }
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.light.target.position.set(-this.camera.position.x, -this.camera.position.y, -this.camera.position.z)
    }
}
class Controls {
    constructor(public scene: THREE.Scene) {
        this.loadCloud()
        this.redraw();
    }
    size = 0.08;
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
    cloud: THREE.PointCloud
    loadCloud() {
        let loader = new THREE.PCDLoader()
        loader.load("/resource/test.pcd", (mesh) => {
            const material = new THREE.PointCloudMaterial({
                size: this.size,
                //transparent: this.transparent,
                //opacity: this.opacity,
                vertexColors: this.vertexColors,
                sizeAttenuation: this.sizeAttenuation,
                color: this.color
            });
            mesh.material = material
            this.scene.add(mesh)
        })
    }
    createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {
        var geom = new THREE.Geometry();
        var material = new THREE.PointCloudMaterial({
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
        this.cloud = new THREE.PointCloud(geom, material);
        this.cloud.name = "particles";
        this.scene.add(this.cloud);
    }
}



class InteractManager {
    currentObjectController = new THREE.TransformControls(this.camera, this.listeningElement)
    current: Interactable
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
        if (this.current) this.current.endEdit()
        this.currentObjectController.attach(item.object)
        this.current = item
        this.scene.add(this.currentObjectController)
        item.startEdit()
    }
    current: Interactable = null
    items: Interactable[] = []
}
abstract class Interactable {
    inScene: boolean = false
    abstract object: THREE.Object3D
    abstract startEdit()
    abstract endEdit()
    events = new Leaf.EventEmitter<{
        mousedown
    }>()
}
class HotkeyManager {
    isActive = true
    constructor() {
        console.log("Add?")
        window.addEventListener("keydown", (e) => {
            if (!this.isActive) return
            if (e.which == Leaf.Key.c) {
                console.log("je?")
                this.events.emit("create")
            }
        })
    }
    events = new Leaf.EventEmitter<{
        create
    }>()
}

export class BoxInteractable extends Interactable {
    _length = 2
    defaultSize = {
        x: this._length,
        y: this._length,
        z: this._length
    }
    geometry = new THREE.BoxGeometry(this.defaultSize.x, this.defaultSize.y, this.defaultSize.z)
    constructor() {
        super()
        let mat = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            opacity: 1,
            transparent: true
        })
        this.object = new THREE.Mesh(this.geometry, mat)
    }
    currentScale: THREE.Vector3 = new THREE.Vector3(1, 1, 1)
    resizeTo(v3: THREE.Vector3) {
        let cs = this.currentScale
        this.geometry.scale(1 / cs.x, 1 / cs.y, 1 / cs.z)
        this.geometry.scale(v3.x, v3.y, v3.z)
        this.currentScale = v3
        this.geometry.verticesNeedUpdate = true
    }
    data = {
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        visible: true
    }
    object: THREE.Mesh
    configer: dat.GUI
    startEdit() {
        if (this.configer) return
        this.configer = new dat.GUI();
        [this.configer.add(this.data, "scaleX", 1, 10).name("红轴"),
        this.configer.add(this.data, "scaleY", 1, 10).name("绿轴"),
        this.configer.add(this.data, "scaleZ", 1, 10).name("蓝轴"),
        this.configer.add(this.data, "visible")
        ].forEach((item: dat.GUIController) => {
            item.onChange(() => {
                this.update()
            })
        })
    }
    endEdit() {
        if (!this.configer) return
        this.configer.destroy();

    }
    update() {
        this.resizeTo(new THREE.Vector3(this.data.scaleX, this.data.scaleY, this.data.scaleZ))
        this.object.visible = this.data.visible
    }
}
