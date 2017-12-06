"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../main.ts"/>
var dat = require("../lib/dat.gui");
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    //gui.add(this, 'size', 0, 10).onChange(this.redraw.bind(this));
    //gui.add(this, 'transparent').onChange(this.redraw.bind(this));
    //gui.add(this, 'opacity', 0, 1).onChange(this.redraw.bind(this));
    //gui.add(this, 'vertexColors').onChange(this.redraw.bind(this));
    //gui.addColor(this, 'color').onChange(this.redraw.bind(this));
    //gui.add(this, 'sizeAttenuation').onChange(this.redraw.bind(this));
    //gui.add(this, 'rotateSystem');
    function Scene() {
        var _this = _super.call(this) || this;
        _this.scene = new THREE.Scene();
        _this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        _this.renderer = new THREE.WebGLRenderer({ alpha: true, canvas: _this.UI.canvas });
        _this.controls = new Controls(_this.scene);
        _this.controller = new THREE.OrbitControls(_this.camera, _this.UI.canvas);
        _this.hotkey = new HotkeyManager();
        _this.interactives = new InteractManager(_this.scene, _this.camera, _this.UI.canvas);
        _this.light = new THREE.DirectionalLight(0xffffff, 0.9);
        _this.ambient = new THREE.AmbientLight(0xffffff, 0.2);
        _this.step = 0;
        _this.renderer.setClearColor(0x000000, 0);
        _this.renderer.setSize(window.innerWidth, window.innerHeight);
        _this.camera.position.x = 20;
        _this.camera.position.y = 0;
        _this.camera.position.z = 50;
        _this.controller.update();
        _this.hotkey.events.listenBy(_this, "create", function () {
            var box = new BoxInteractable();
            _this.interactives.add(box);
            _this.interactives.attach(box);
            _this.setMode("meshMove");
        });
        _this.light.target.position.set(-1, -1, -1);
        _this.scene.add(_this.light.target);
        _this.scene.add(_this.light);
        _this.scene.add(_this.ambient);
        _this.scene.add(new THREE.GridHelper(1000, 100, 0xff0000));
        return _this;
    }
    Scene.prototype.setMode = function (mode) {
        if (mode === "meshMove") {
            //this.controller.enabled = false
        }
        else if (mode === "sceneMove") {
            this.controller.enabled = true;
            this.interactives.currentObjectController.detach();
        }
    };
    Scene.prototype.render = function () {
        if (this.controls.rotateSystem) {
            this.step += 0.01;
            this.controls.cloud.rotation.x = this.step;
            this.controls.cloud.rotation.z = this.step;
        }
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.light.target.position.set(-this.camera.position.x, -this.camera.position.y, -this.camera.position.z);
    };
    return Scene;
}(R.Scene));
exports.Scene = Scene;
var Controls = /** @class */ (function () {
    function Controls(scene) {
        this.scene = scene;
        this.size = 0.08;
        this.transparent = true;
        this.opacity = 1;
        this.vertexColors = true;
        this.color = 0xffffff;
        this.sizeAttenuation = true;
        this.rotateSystem = false;
        this.loadCloud();
        this.redraw();
    }
    Controls.prototype.redraw = function () {
        //if (this.scene.getObjectByName("particles")) {
        //    this.scene.remove(this.scene.getObjectByName("particles"));
        //}
        //this.createParticles(this.size, this.transparent, this.opacity, this.vertexColors, this.sizeAttenuation, this.color);
    };
    Controls.prototype.loadCloud = function () {
        var _this = this;
        var loader = new THREE.PCDLoader();
        loader.load("/resource/test.pcd", function (mesh) {
            var material = new THREE.PointCloudMaterial({
                size: _this.size,
                //transparent: this.transparent,
                //opacity: this.opacity,
                vertexColors: _this.vertexColors,
                sizeAttenuation: _this.sizeAttenuation,
                color: _this.color
            });
            mesh.material = material;
            _this.scene.add(mesh);
        });
    };
    Controls.prototype.createParticles = function (size, transparent, opacity, vertexColors, sizeAttenuation, color) {
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
    };
    return Controls;
}());
var InteractManager = /** @class */ (function () {
    function InteractManager(scene, camera, listeningElement) {
        this.scene = scene;
        this.camera = camera;
        this.listeningElement = listeningElement;
        this.currentObjectController = new THREE.TransformControls(this.camera, this.listeningElement);
        this.current = null;
        this.items = [];
    }
    InteractManager.prototype.add = function (item) {
        if (this.items.indexOf(item) >= 0)
            return;
        if (!item.inScene) {
            item.inScene = true;
            this.items.push(item);
        }
        this.scene.add(item.object);
    };
    InteractManager.prototype.attach = function (item) {
        if (this.current)
            this.current.endEdit();
        this.currentObjectController.attach(item.object);
        this.current = item;
        this.scene.add(this.currentObjectController);
        item.startEdit();
    };
    return InteractManager;
}());
var Interactable = /** @class */ (function () {
    function Interactable() {
        this.inScene = false;
        this.events = new Leaf.EventEmitter();
    }
    return Interactable;
}());
var HotkeyManager = /** @class */ (function () {
    function HotkeyManager() {
        var _this = this;
        this.isActive = true;
        this.events = new Leaf.EventEmitter();
        console.log("Add?");
        window.addEventListener("keydown", function (e) {
            if (!_this.isActive)
                return;
            if (e.which == Leaf.Key.c) {
                console.log("je?");
                _this.events.emit("create");
            }
        });
    }
    return HotkeyManager;
}());
var BoxInteractable = /** @class */ (function (_super) {
    __extends(BoxInteractable, _super);
    function BoxInteractable() {
        var _this = _super.call(this) || this;
        _this._length = 2;
        _this.defaultSize = {
            x: _this._length,
            y: _this._length,
            z: _this._length
        };
        _this.geometry = new THREE.BoxGeometry(_this.defaultSize.x, _this.defaultSize.y, _this.defaultSize.z);
        _this.currentScale = new THREE.Vector3(1, 1, 1);
        _this.data = {
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            visible: true
        };
        var mat = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            opacity: 1,
            transparent: true
        });
        _this.object = new THREE.Mesh(_this.geometry, mat);
        return _this;
    }
    BoxInteractable.prototype.resizeTo = function (v3) {
        var cs = this.currentScale;
        this.geometry.scale(1 / cs.x, 1 / cs.y, 1 / cs.z);
        this.geometry.scale(v3.x, v3.y, v3.z);
        this.currentScale = v3;
        this.geometry.verticesNeedUpdate = true;
    };
    BoxInteractable.prototype.startEdit = function () {
        var _this = this;
        if (this.configer)
            return;
        this.configer = new dat.GUI();
        [this.configer.add(this.data, "scaleX", 1, 10).name("红轴"),
            this.configer.add(this.data, "scaleY", 1, 10).name("绿轴"),
            this.configer.add(this.data, "scaleZ", 1, 10).name("蓝轴"),
            this.configer.add(this.data, "visible")
        ].forEach(function (item) {
            item.onChange(function () {
                _this.update();
            });
        });
    };
    BoxInteractable.prototype.endEdit = function () {
        if (!this.configer)
            return;
        this.configer.destroy();
    };
    BoxInteractable.prototype.update = function () {
        this.resizeTo(new THREE.Vector3(this.data.scaleX, this.data.scaleY, this.data.scaleZ));
        this.object.visible = this.data.visible;
    };
    return BoxInteractable;
}(Interactable));
exports.BoxInteractable = BoxInteractable;
