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
///<reference path="../../main.ts"/>
var annotationList_1 = require("./annotationList");
var dict_1 = require("../../dict");
var annotationTypeList_1 = require("./annotationTypeList");
var previewList_1 = require("./previewList");
var layer2d_1 = require("./layer2d");
var AnnotationScene = /** @class */ (function (_super) {
    __extends(AnnotationScene, _super);
    function AnnotationScene(option, callback) {
        var _this = _super.call(this) || this;
        _this.option = option;
        _this.callback = callback;
        _this.scene = new THREE.Scene();
        _this.layer2d = new layer2d_1.Layer2d();
        // //PerspectiveCamera:
        // camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);
        _this.camera = new THREE.OrthographicCamera(-50, 50, 25, -25, 0.01, 1000);
        _this.renderer = new THREE.WebGLRenderer({ alpha: true, canvas: _this.UI.canvas });
        _this.canvas = _this.UI.canvas;
        _this.hotkey = new HotkeyManager();
        // interactives = new InteractManager(this.scene, this.camera, this.UI.canvas)
        _this.light = new THREE.DirectionalLight(0xffffff, 1.1);
        _this.ambient = new THREE.AmbientLight(0xffffff, 0.1);
        _this.lockView = false;
        _this.updateState = "annotated";
        _this.events = new Leaf.EventEmitter();
        _this.step = 0;
        _this.renderer.setClearColor(0x000000, 0);
        _this.renderer.setPixelRatio(window.devicePixelRatio);
        _this.renderer.setSize(window.innerWidth, window.innerHeight);
        _this.layer2d.appendTo(_this.node);
        _this.layer2d.hide();
        _this.camera.position.x = 0;
        _this.camera.position.y = 0;
        _this.camera.position.z = 500;
        _this.camera.rotateZ(Math.PI / 2);
        _this.camera.up.set(0, 0, 1);
        //PerspectiveCamera:
        // this.camera.position.x = 0
        // this.camera.position.y = 180
        // this.camera.position.z = 0
        _this.light.target.position.set(-1, -1, -1);
        _this.scene.add(_this.light.target);
        _this.scene.add(_this.light);
        _this.scene.add(_this.ambient);
        _this.gridHelper = new THREE.GridHelper(1000, 200, 0x38d3f5, 0x000000);
        _this.gridHelper.rotateX(Math.PI / 2);
        _this.scene.add(_this.gridHelper);
        //在camera之后初始化
        _this.controller = new THREE.OrbitControls(_this.camera, _this.UI.canvas);
        _this.lockChangeView();
        // this.initPreviewList()
        _this.initAnnotationList();
        _this.readonly(_this.option.readonly);
        _this.loadCloud();
        return _this;
    }
    AnnotationScene.prototype.readonly = function (readonly) {
        if (readonly) {
            this.VM.readonly = true;
        }
        else {
            this.VM.readonly = false;
        }
    };
    AnnotationScene.prototype.initAnnotationList = function () {
        var _this = this;
        this.createList = new annotationTypeList_1.AnnotationTypeList(dict_1.ObjectTypesDict);
        this.annotationList = new annotationList_1.AnnotationList(this, "", false);
        this.annotationList.events.listenBy(this, "initialized", function () {
            _this.initAnnotations = _this.annotationList.getAnnotations();
        });
    };
    AnnotationScene.prototype.initPreviewList = function () {
        this.previewList = new previewList_1.PreviewList(233, 2333);
        this.previewList.events.listenBy(this, "click", function (index) {
            console.log(index);
        });
    };
    AnnotationScene.prototype.save = function (callback) {
        callback();
    };
    AnnotationScene.prototype.submit = function (callback) {
        callback();
    };
    //返回按钮
    AnnotationScene.prototype.onClickBack = function () {
        document.body.removeChild(document.querySelector(".annotating-scene"));
        this.callback();
    };
    AnnotationScene.prototype.onClickSave = function () {
        var _this = this;
        this.save(function () {
            _this.notification("save success!");
        });
    };
    AnnotationScene.prototype.onClickSubmit = function () {
        var _this = this;
        this.submit(function () {
            _this.notification("submit success!");
        });
    };
    AnnotationScene.prototype.onClickChangeView = function () {
        this.lockChangeView();
    };
    AnnotationScene.prototype.lockChangeView = function () {
        if (!this.lockView) {
            this.controller.maxPolarAngle = 0;
            this.controller.minPolarAngle = 0;
            // this.scene.add(this.gridHelper);
            // this.camera.position.y = 150
            // this.camera.position.z = 0
            // this.camera.position.x = 0
            this.lockView = true;
            this.controller.update();
            this.VM.lockView = "unlockView";
        }
        else {
            this.controller.maxPolarAngle = Math.PI;
            this.controller.minPolarAngle = 0;
            // this.camera.position.y = 150 / (Math.sqrt(2))
            // this.camera.position.z = 150 / (Math.sqrt(2))
            // this.camera.position.x = 0
            // this.scene.remove(this.gridHelper);
            this.lockView = false;
            this.controller.update();
            this.VM.lockView = "lockView";
        }
    };
    AnnotationScene.prototype.loadCloud = function () {
        var _this = this;
        var loader = new THREE.PCDLoader();
        loader.load("/resource/test.pcd", function (mesh) {
            _this.points = SmartPoints.createFramePoints(SmartPoints.fromPointsCloud(mesh));
            _this.scene.add(_this.points.mesh);
        });
        //random points
        // this.points = SmartPoints.createFramePoints(SmartPoints.createRandomPoints())
        // this.scene.add(this.points.mesh)
    };
    AnnotationScene.prototype.render = function () {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.layer2d.render();
        this.light.target.position.set(-this.camera.position.x, -this.camera.position.y, -this.camera.position.z);
    };
    AnnotationScene.prototype.notification = function (info) {
        Notification.requestPermission().then(function () {
            var notification = new Notification("new message", {
                body: info
            });
            setTimeout(function () {
                notification.close();
            }, 1000);
        });
    };
    return AnnotationScene;
}(R.AnnotationScene.AnnotationScene));
exports.AnnotationScene = AnnotationScene;
var InteractManager = /** @class */ (function () {
    function InteractManager(scene, camera, listeningElement) {
        this.scene = scene;
        this.camera = camera;
        this.listeningElement = listeningElement;
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
        if (this.current === item)
            return;
        if (this.current)
            this.current.endEdit();
        this.current = item;
        item.startEdit();
    };
    return InteractManager;
}());
exports.InteractManager = InteractManager;
var HotkeyManager = /** @class */ (function () {
    function HotkeyManager() {
        var _this = this;
        this.isActive = true;
        this.events = new Leaf.EventEmitter();
        window.addEventListener("keydown", function (e) {
            if (!_this.isActive)
                return;
            if (e.which == Leaf.Key.c) {
                _this.events.emit("create");
            }
        });
    }
    return HotkeyManager;
}());
var SmartPoints = /** @class */ (function () {
    function SmartPoints() {
        this.isRotatedPoints = false;
        this.color = new THREE.Color(0, 255, 255);
    }
    SmartPoints.createRandomPoints = function () {
        var minZ = -5, maxZ = 100, xRange = 500, yRange = 500, count = 100000, points = [];
        for (var i = 0; i < count; i++) {
            var x = (Math.random() - 0.5) * xRange, y = (Math.random() - 0.5) * yRange, z = (1 - Math.random()) * (maxZ - minZ);
            points.push({ x: x, y: y, z: z });
        }
        return points;
    };
    SmartPoints.fromPointsCloud = function (cloud) {
        var bg = cloud.geometry;
        var attrs = bg.getAttribute("position");
        var counter = 0, resultPoints = [];
        while (counter < attrs.count) {
            resultPoints.push({ x: attrs.getX(counter), y: attrs.getY(counter), z: attrs.getZ(counter) });
            counter++;
        }
        return resultPoints;
    };
    SmartPoints.createFramePoints = function (points) {
        //使用BufferGeometry,可单独处理每一个点的position和color,
        //同时mesh和points位置和旋转一直,不用在单独做处理
        var sp = new SmartPoints();
        sp.rotatedPoints = [];
        sp.bufferGeometry = new THREE.BufferGeometry();
        var positions = new Float32Array(points.length * 3), 
        //colors rgb的值为0-1
        colors = new Float32Array(points.length * 3), zPositions = [];
        for (var i = 0, l = points.length; i < l; i++) {
            //y轴,z轴做转换,即this.points.mesh.rotateX(-Math.PI / 2)
            //由于使用的是BufferGeometry,mesh和points同时旋转
            sp.rotatedPoints.push(new THREE.Vector3(points[i].x, points[i].y, points[i].z));
            positions[i * 3] = points[i].x;
            positions[i * 3 + 1] = points[i].y;
            positions[i * 3 + 2] = points[i].z;
            zPositions.push(points[i].z);
        }
        var heightest = Math.max.apply(Math, zPositions), lowest = Math.min.apply(Math, zPositions);
        var lowestColorZ = -3, heightestColorZ = 3, //100
        lowestColorH = 0, heightestColorH = 120; //350
        for (var i = 0, l = zPositions.length; i < l; i++) {
            var rgb = void 0;
            if (zPositions[i] < lowestColorZ) {
                rgb = SmartPoints.hsvtorgb(lowestColorH, 100, 100);
            }
            else if (zPositions[i] > heightestColorZ) {
                rgb = SmartPoints.hsvtorgb(heightestColorH, 100, 100);
            }
            else {
                rgb = SmartPoints.hsvtorgb(lowestColorH + (heightestColorH - lowestColorH) * ((zPositions[i] - lowestColorZ) / (heightestColorZ - lowestColorZ)), 100, 100);
            }
            colors[i * 3] = rgb[0] / 255;
            colors[i * 3 + 1] = rgb[1] / 255;
            colors[i * 3 + 2] = rgb[2] / 255;
        }
        sp.bufferGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        sp.bufferGeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
        sp.bufferGeometry.computeBoundingBox();
        var material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: THREE.VertexColors,
            transparent: true,
            opacity: 1,
            sizeAttenuation: false
        });
        sp.mesh = new THREE.Points(sp.bufferGeometry, material);
        return sp;
    };
    SmartPoints.hsvtorgb = function (h, s, v) {
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
    };
    SmartPoints.create = function () {
        var sp = new SmartPoints();
        sp.geometry = new THREE.Geometry();
        sp.material = new THREE.PointsMaterial({
            size: 2,
            transparent: true,
            opacity: 1,
            // vertexColors: 0x000000,
            sizeAttenuation: false,
        });
        sp.geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        //sp.geometry.colors.push(new THREE.Color(0x000000))
        sp.mesh = new THREE.Points(sp.geometry, sp.material);
        return sp;
    };
    SmartPoints.prototype.setFramePoints = function (points, color) {
        //该方法可以设置points颜色无效,只能通过material设置整体颜色
        this.geometry = new THREE.Geometry();
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var p = points_1[_i];
            this.geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z));
            this.geometry.colors.push(new THREE.Color(0, 0, 255));
        }
        this.geometry.verticesNeedUpdate = true;
        this.geometry.colorsNeedUpdate = true;
        this.material.needsUpdate = true;
        this.mesh.geometry = this.geometry;
    };
    SmartPoints.prototype.setPoints = function (points, colors) {
        if (colors === void 0) { colors = []; }
        this.geometry = new THREE.Geometry();
        (_a = this.geometry.vertices).push.apply(_a, points);
        this.mesh.geometry = this.geometry;
        this.geometry.verticesNeedUpdate = true;
        var _a;
    };
    SmartPoints.prototype.getPoints = function () {
        //使用BufferGeometry,从新获得points
        return this.rotatedPoints;
    };
    SmartPoints.prototype.getRotatedPoints = function () {
        return this.rotatedPoints;
    };
    // return indexes
    SmartPoints.prototype.getPoints2D = function (option) {
        return [];
    };
    SmartPoints.prototype.forPoints = function (indexes, handler) {
        if (indexes === void 0) { indexes = null; }
    };
    return SmartPoints;
}());
exports.SmartPoints = SmartPoints;
