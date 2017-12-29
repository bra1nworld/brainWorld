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
var annotationScene_1 = require("./annotationScene");
var InteractableAnnotationGeometry = /** @class */ (function () {
    function InteractableAnnotationGeometry() {
    }
    return InteractableAnnotationGeometry;
}());
exports.InteractableAnnotationGeometry = InteractableAnnotationGeometry;
(function (InteractableAnnotationGeometry) {
    function fromJSON(data, actionList, readonly) {
        switch (data.type) {
            case "rectangle":
                return new RectangleInteractable(data, actionList, readonly);
            case "points":
                return new PointsInteractable(data, actionList, readonly);
        }
    }
    InteractableAnnotationGeometry.fromJSON = fromJSON;
})(InteractableAnnotationGeometry = exports.InteractableAnnotationGeometry || (exports.InteractableAnnotationGeometry = {}));
exports.InteractableAnnotationGeometry = InteractableAnnotationGeometry;
var PointsInteractable = /** @class */ (function (_super) {
    __extends(PointsInteractable, _super);
    function PointsInteractable(annotation, actionList, readonly) {
        var _this = _super.call(this) || this;
        _this.annotation = annotation;
        _this.actionList = actionList;
        _this.readonly = readonly;
        _this.type = "points";
        _this.points = annotationScene_1.SmartPoints.create();
        _this.object = _this.points.mesh;
        _this.pointIndice = [];
        _this.data = {
            visible: true,
            color: "#000000"
        };
        var geo = (annotation.geometry || {});
        _this.pointIndice = geo.pointIndice || [];
        _this.points.color = new THREE.Color("#aa0000");
        _this.actionList.events.listenBy(_this, "action", function (action) {
            _this.startDraw(action);
        });
        return _this;
    }
    PointsInteractable.prototype.addPointReference = function (index) {
        if (this.pointIndice.indexOf(index) < 0) {
            this.pointIndice.push(index);
        }
    };
    PointsInteractable.prototype.removePointReference = function (index) {
        this.pointIndice = this.pointIndice.filter(function (item) { return item !== index; });
    };
    PointsInteractable.prototype.startDraw = function (action) {
        var _this = this;
        var rotatedPs = this.scene.points.getRotatedPoints(); //获得旋转之后的点
        var ps = this.scene.points.getPoints();
        var proc = new RingDrawingProcedure(this.scene.layer2d);
        proc.getRing(function (err, ring) {
            var index = 0;
            for (var _i = 0, rotatedPs_1 = rotatedPs; _i < rotatedPs_1.length; _i++) {
                var point = rotatedPs_1[_i];
                var p25d = point.clone();
                // map to 2D screen space
                var ratio = window.devicePixelRatio;
                p25d.project(_this.scene.camera);
                p25d.x = Math.round((p25d.x + 1) * _this.scene.canvas.width / 2);
                p25d.y = Math.round((-p25d.y + 1) * _this.scene.canvas.height / 2);
                p25d.z = 0;
                var p2 = new THREE.Vector2(p25d.x, p25d.y);
                if (ring.contains(p2)) {
                    if (action === "add") {
                        _this.addPointReference(index);
                    }
                    else if (action === "substract") {
                        _this.removePointReference(index);
                    }
                }
                index++;
            }
            //根据旋转之后的点的index渲染对应index的mesh上的点
            _this.syncPointReferences(ps);
        });
    };
    PointsInteractable.prototype.syncPointReferences = function (ps) {
        this.points.setPoints(this.pointIndice.map(function (i) {
            return ps[i];
        }));
    };
    PointsInteractable.prototype.activate = function () {
        if (this.scene.points) {
            this.syncPointReferences(this.scene.points.getPoints());
        }
        this.startEdit();
    };
    PointsInteractable.prototype.deactivate = function () {
        this.endEdit();
    };
    PointsInteractable.prototype.hitTest = function (camera, position) {
    };
    PointsInteractable.prototype.toJSON = function () {
        return {
            type: "points",
            // description: this.annotation.description,
            color: this.data.color,
            geometry: {
                type: "points",
                pointIndice: this.pointIndice
            }
        };
    };
    PointsInteractable.prototype.setMeta = function (meta) {
        if (meta.color) {
            this.data.color = meta.color;
        }
        this.redraw();
    };
    PointsInteractable.prototype.startEdit = function () {
    };
    PointsInteractable.prototype.show = function () {
        if (this.points.mesh.visible)
            return;
        this.data.visible = true;
        this.points.mesh.visible = true;
        this.redraw();
    };
    PointsInteractable.prototype.hide = function () {
        if (!this.points.mesh.visible)
            return;
        this.data.visible = false;
        this.points.mesh.visible = false;
        this.redraw();
    };
    PointsInteractable.prototype.endEdit = function () {
    };
    PointsInteractable.prototype.redraw = function () {
        this.points.mesh.visible = this.data.visible;
        this.points.material.setValues({
            color: this.data.color
        });
        this.points.material.needsUpdate = true;
    };
    PointsInteractable.prototype.attach = function (scene) {
        if (scene === this.scene)
            return;
        this.scene = scene;
        this.scene.scene.add(this.points.mesh);
        if (this.scene.points) {
            this.syncPointReferences(this.scene.points.getPoints());
        }
        this.startDraw("add");
    };
    PointsInteractable.prototype.detach = function () {
        this.deactivate();
        this.scene.scene.remove(this.points.mesh);
        this.scene = null;
    };
    PointsInteractable.type = "points";
    return PointsInteractable;
}(InteractableAnnotationGeometry));
exports.PointsInteractable = PointsInteractable;
var RectangleInteractable = /** @class */ (function (_super) {
    __extends(RectangleInteractable, _super);
    function RectangleInteractable(annotation, actionList, readonly) {
        var _this = _super.call(this) || this;
        _this.annotation = annotation;
        _this.actionList = actionList;
        _this.readonly = readonly;
        _this.type = "rectangle";
        _this.points = annotationScene_1.SmartPoints.create();
        _this.object = _this.points.mesh;
        _this.pointIndice = [];
        _this.loadInitDraw = false;
        _this.hasFinishedDraw = true;
        _this.data = {
            visible: true,
            color: "#000000"
        };
        var geo = (annotation.box || {});
        _this.rectAngleInfo = geo.rectAngleInfo || null;
        _this.arrawInfo = geo.arrawInfo || null;
        _this.points.color = new THREE.Color("#aa0000");
        _this.actionList.events.listenBy(_this, "action", function (action) {
            if (!_this.hasFinishedDraw)
                return;
            _this.hasFinishedDraw = false;
            var cube = _this.cube, arrow = _this.arrow;
            //生成cube,arrow之后this变化,需传入新生成的cube,arrow
            _this.startDraw({ cube: cube, arrow: arrow, action: action });
        });
        return _this;
    }
    RectangleInteractable.prototype.startDraw = function (option) {
        var _this = this;
        var action;
        if (option) {
            action = option.action;
            this.scene.scene.remove(option.cube);
            this.scene.scene.remove(option.arrow);
            setTimeout(function () {
                _this.hasFinishedDraw = true;
            }, 500);
        }
        if (action && action !== "redraw" && action !== "delete")
            return;
        //rotatedPs 获得旋转之后的点
        var rotatedPs = this.scene.points.getRotatedPoints();
        var ps = this.scene.points.getPoints();
        var proc = new RingDrawingProcedure(this.scene.layer2d, "rectangle", this.data.color);
        //firstTime loadInitDraw
        this.syncPointReferences(ps);
        if (!this.loadInitDraw) {
            if (this.rectAngleInfo) {
                this.cube = this.createRectangle(this.rectAngleInfo);
                this.scene.scene.add(this.cube);
                this.addArrow(this.rectAngleInfo, this.arrawInfo);
                this.loadInitDraw = true;
                return;
            }
            else {
                this.loadInitDraw = true;
            }
        }
        //normalDraw
        this.pointIndice = [];
        this.syncPointReferences(ps);
        if (action && action === "delete")
            return;
        proc.getRing(function (err, ring) {
            var index = 0;
            for (var _i = 0, rotatedPs_2 = rotatedPs; _i < rotatedPs_2.length; _i++) {
                var point = rotatedPs_2[_i];
                var p25d = point.clone();
                // map to 2D screen space
                var ratio = window.devicePixelRatio;
                p25d.project(_this.scene.camera);
                p25d.x = Math.round((p25d.x + 1) * _this.scene.canvas.width / 2);
                p25d.y = Math.round((-p25d.y + 1) * _this.scene.canvas.height / 2);
                p25d.z = 0;
                var p2 = new THREE.Vector2(p25d.x, p25d.y);
                if (ring.contains(p2)) {
                    _this.addPointReference(index);
                }
                index++;
            }
            var rotateAngle = _this.scene.controller.getAzimuthalAngle();
            //根据旋转之后的点的index渲染对应index的旋转前mesh上的点
            _this.syncPointReferences(ps);
            _this.addRectangle(ps, rotateAngle, ring.points);
        });
    };
    RectangleInteractable.prototype.addRectangle = function (ps, rotateAngle, ringPoints, pointIndice) {
        var xArray = [], yArray = [], zArray = [];
        //rotateAngle:由controller.getAzimuthalAngle()得出的角度,
        //旋转是为了相对摆正坐标轴
        //从当前位置转到与坐标水平竖直位置
        // let matrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), -rotateAngle);
        //从与坐标水平竖直位置转到当前位置(即标注之前坐标轴旋转角度)
        //let reverseMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), rotateAngle);
        //四元数表示矩阵
        var quaternion = new THREE.Quaternion();
        //从当前位置转到与坐标水平竖直位置
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -rotateAngle);
        var reverseQuaternion = new THREE.Quaternion();
        //从与坐标水平竖直位置转到当前位置(即标注之前坐标轴旋转角度)
        reverseQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rotateAngle);
        //处理选中的点
        var rectPointIndice = pointIndice ? pointIndice : this.pointIndice;
        rectPointIndice.forEach(function (i) {
            var psVec3 = new THREE.Vector3(ps[i].x, ps[i].y, ps[i].z);
            var psResult = psVec3.applyQuaternion(quaternion);
            xArray.push(psResult.x);
            yArray.push(psResult.y);
            zArray.push(psResult.z);
        });
        if (xArray.length == 0) {
            return;
        }
        var maxX = Math.max.apply(Math, xArray), minX = Math.min.apply(Math, xArray), maxY = Math.max.apply(Math, yArray), minY = Math.min.apply(Math, yArray), maxZ = Math.max.apply(Math, zArray), minZ = Math.min.apply(Math, zArray);
        var xDistance = maxX - minX;
        var yDistance = maxY - minY;
        var zDistance = maxZ - minZ;
        var xPosition = (maxX + minX) / 2;
        var yPosition = (maxY + minY) / 2;
        var zPosition = (maxZ + minZ) / 2;
        var positionVec3 = new THREE.Vector3(xPosition, yPosition, zPosition);
        //cube中心反向旋转回原来位置
        var resultPosition = positionVec3.applyQuaternion(reverseQuaternion);
        this.rectAngleInfo = {
            dims: [xDistance, yDistance, zDistance],
            pose: [resultPosition.x, resultPosition.y, resultPosition.z, reverseQuaternion.w, reverseQuaternion.x, reverseQuaternion.y, reverseQuaternion.z],
            cubeMaterial: {
                color: this.data.color,
                wireframe: true
            }
        };
        this.cube = this.createRectangle(this.rectAngleInfo);
        this.scene.scene.add(this.cube);
        //这些点为第一次矩阵变换后(转回到与坐标轴垂直时)的cube的各个面的中点
        var faceCenterPoint = {
            xNegative: new THREE.Vector3(xPosition + xDistance / 2, yPosition, zPosition),
            xPositive: new THREE.Vector3(xPosition - xDistance / 2, yPosition, zPosition),
            yNegative: new THREE.Vector3(xPosition, yPosition - yDistance / 2, zPosition),
            yPositive: new THREE.Vector3(xPosition, yPosition + yDistance / 2, zPosition)
        };
        this.arrawInfo = {
            ringPoints: ringPoints,
            faceCenterPoint: faceCenterPoint
        };
        this.addArrow(this.rectAngleInfo, this.arrawInfo);
    };
    RectangleInteractable.prototype.createRectangle = function (rectAngleInfo) {
        var dims = rectAngleInfo.dims, pose = rectAngleInfo.pose, cubeMaterial = rectAngleInfo.cubeMaterial;
        var material = new THREE.MeshBasicMaterial({
            color: cubeMaterial.color,
            wireframe: cubeMaterial.wireframe
        });
        var geometry = new THREE.CubeGeometry(dims[0], dims[1], dims[2], 0, 0, 0);
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(pose[0], pose[1], pose[2]);
        //cube绕自己Y轴旋转回原来的位置
        var quaternion = new THREE.Quaternion();
        quaternion.set(pose[4], pose[5], pose[6], pose[3]);
        cube.setRotationFromQuaternion(quaternion);
        return cube;
    };
    RectangleInteractable.prototype.addArrow = function (rectAngleInfo, arrawInfo) {
        var dims = rectAngleInfo.dims, pose = rectAngleInfo.pose, cubeMaterial = rectAngleInfo.cubeMaterial;
        var faceCenterPoint = arrawInfo.faceCenterPoint, ringPoints = arrawInfo.ringPoints;
        var xNegative = faceCenterPoint.xNegative, xPositive = faceCenterPoint.xPositive, yNegative = faceCenterPoint.yNegative, yPositive = faceCenterPoint.yPositive;
        if (!ringPoints)
            return;
        //用到了THREE.Vector3的applyMatrix4属性,需要生成
        var XNegative = new THREE.Vector3(xNegative.x, xNegative.y, xNegative.z), XPositive = new THREE.Vector3(xPositive.x, xPositive.y, xPositive.z), YNegative = new THREE.Vector3(yNegative.x, yNegative.y, yNegative.z), YPositive = new THREE.Vector3(yPositive.x, yPositive.y, yPositive.z);
        //旋转之后yz轴变换
        var pointStart = ringPoints[0], pointEnd = ringPoints[2];
        //从与坐标轴垂直位置转到最终位置
        // let matrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), rotateYAngle)
        //四元数表示
        var quaternion = new THREE.Quaternion();
        quaternion.set(pose[4], pose[5], pose[6], pose[3]);
        var rightDir = new THREE.Vector3(1, 0, 0), leftDir = new THREE.Vector3(-1, 0, 0), topDir = new THREE.Vector3(0, 1, 0), bottomDir = new THREE.Vector3(0, -1, 0);
        var arrowDir;
        var arrowOrigin;
        //ArrowHelper无法用矩阵或四元数来位移旋转
        if (dims[0] > dims[1]) {
            if (pointEnd.x > pointStart.x) {
                arrowDir = rightDir.applyQuaternion(quaternion);
                arrowOrigin = XNegative.applyQuaternion(quaternion);
            }
            else {
                arrowDir = leftDir.applyQuaternion(quaternion);
                arrowOrigin = XPositive.applyQuaternion(quaternion);
            }
        }
        else {
            if (pointEnd.y < pointStart.y) {
                arrowDir = topDir.applyQuaternion(quaternion);
                arrowOrigin = YPositive.applyQuaternion(quaternion);
            }
            else {
                arrowDir = bottomDir.applyQuaternion(quaternion);
                arrowOrigin = YNegative.applyQuaternion(quaternion);
            }
        }
        var arrowLength = 3;
        var arrowHeadLength = 1;
        var arrowHeadWidth = 0.5;
        var arrowColor = parseInt("0x" + cubeMaterial.color.split("#")[1], 16);
        this.arrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowLength, arrowColor, arrowHeadLength, arrowHeadWidth);
        this.scene.scene.add(this.arrow);
    };
    RectangleInteractable.prototype.addPointReference = function (index) {
        if (this.pointIndice.indexOf(index) < 0) {
            this.pointIndice.push(index);
        }
    };
    RectangleInteractable.prototype.removePointReference = function (index) {
        this.pointIndice = this.pointIndice.filter(function (item) { return item !== index; });
    };
    RectangleInteractable.prototype.syncPointReferences = function (ps) {
        this.points.setPoints(this.pointIndice.map(function (i) {
            return ps[i];
        }));
    };
    RectangleInteractable.prototype.activate = function () {
        if (this.scene && this.scene.points) {
            this.syncPointReferences(this.scene.points.getPoints());
        }
        this.startEdit();
    };
    RectangleInteractable.prototype.deactivate = function () {
        this.endEdit();
    };
    RectangleInteractable.prototype.hitTest = function (camera, position) {
    };
    RectangleInteractable.prototype.toJSON = function () {
        var rectAngleInfo = this.rectAngleInfo, arrawInfo = this.arrawInfo;
        var random = Math.random().toString().substr;
        return {
            id: this.annotation.id,
            type: "box",
            color: this.data.color,
            label: this.annotation.label,
            box: {
                rectAngleInfo: rectAngleInfo,
                arrawInfo: arrawInfo
            }
        };
    };
    RectangleInteractable.prototype.setMeta = function (meta) {
        if (meta.color) {
            this.data.color = meta.color;
        }
        this.redraw();
    };
    RectangleInteractable.prototype.startEdit = function () {
    };
    RectangleInteractable.prototype.show = function () {
        if (this.points.mesh.visible)
            return;
        this.data.visible = true;
        this.points.mesh.visible = true;
        if (this.cube) {
            this.cube.visible = true;
            this.arrow.visible = true;
        }
        this.redraw();
    };
    RectangleInteractable.prototype.hide = function () {
        if (!this.points.mesh.visible)
            return;
        this.data.visible = false;
        this.points.mesh.visible = false;
        if (this.cube) {
            this.cube.visible = false;
            this.arrow.visible = false;
        }
        this.redraw();
    };
    RectangleInteractable.prototype.endEdit = function () {
    };
    RectangleInteractable.prototype.redraw = function () {
        this.points.mesh.visible = this.data.visible;
        this.points.material.setValues({
            color: this.data.color
        });
        if (this.cube) {
            this.cube.material.setValues({
                color: this.data.color
            });
        }
        if (this.rectAngleInfo) {
            this.rectAngleInfo.cubeMaterial.color = this.data.color;
        }
        // this.arrow.setColor() has problem
        if (this.arrow) {
            this.arrow.line.material.setValues({
                color: this.data.color
            });
            this.arrow.cone.material.setValues({
                color: this.data.color
            });
        }
        this.points.material.needsUpdate = true;
    };
    RectangleInteractable.prototype.attach = function (scene) {
        if (scene === this.scene)
            return;
        this.scene = scene;
        this.scene.scene.add(this.points.mesh);
        if (this.scene.points) {
            this.syncPointReferences(this.scene.points.getPoints());
        }
        //初始加载
        // if (!this.loadInitDraw && this.rectAngleInfo) {
        //     this.startDraw()
        // } else {
        this.startDraw();
    };
    RectangleInteractable.prototype.detach = function () {
        this.deactivate();
        this.scene.scene.remove(this.points.mesh);
        if (this.cube) {
            this.scene.scene.remove(this.cube);
            this.scene.scene.remove(this.arrow);
        }
        this.scene = null;
    };
    RectangleInteractable.type = "rectangle";
    return RectangleInteractable;
}(InteractableAnnotationGeometry));
exports.RectangleInteractable = RectangleInteractable;
var Ring = /** @class */ (function () {
    function Ring(points, color) {
        this.points = points;
        this.color = color;
        this.closed = true;
    }
    Ring.prototype.contains = function (p) {
        p = p.clone().multiplyScalar(1 / window.devicePixelRatio);
        if (this.points.length == 0)
            return false;
        var tops = 0;
        var bottoms = 0;
        for (var i = 0; i < this.points.length; i++) {
            var start = this.points[i];
            var end = this.points[i + 1];
            if (!end) {
                end = this.points[0];
            }
            if ((end.x - p.x) * (p.x - start.x) >= 0 && start.x - p.x !== 0) {
                var iy = (p.x - end.x) / (start.x - end.x) * (start.y - end.y) + end.y;
                if (iy > p.y) {
                    tops += 1;
                }
                else {
                    bottoms += 1;
                }
            }
        }
        if ((bottoms + tops) % 2 === 0 && bottoms % 2 === 1) {
            return true;
        }
        return false;
    };
    Ring.prototype.draw = function (context) {
        if (this.points.length < 2)
            return;
        var p0 = this.points[0];
        context.save();
        context.beginPath();
        context.moveTo(p0.x, p0.y);
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var p = _a[_i];
            context.lineTo(p.x, p.y);
        }
        if (this.closed) {
            context.lineTo(p0.x, p0.y);
        }
        context.closePath();
        context.strokeStyle = this.color ? this.color : "#00ff00";
        context.lineWidth = 1.5;
        context.stroke();
        context.restore();
    };
    return Ring;
}());
var RingDrawingProcedure = /** @class */ (function (_super) {
    __extends(RingDrawingProcedure, _super);
    function RingDrawingProcedure(layer2d, type, color) {
        var _this = _super.call(this) || this;
        _this.layer2d = layer2d;
        _this.type = type;
        _this.color = color;
        _this.ring = new Ring([], _this.color);
        _this.handler = function (e) {
            if (e.type === "mousedown") {
                _this.feed("start", new THREE.Vector2(e.clientX, e.clientY));
            }
            if (e.type === "mousemove") {
                _this.feed("p", new THREE.Vector2(e.clientX, e.clientY));
            }
            if (e.type === "mouseup") {
                _this.feed("last", new THREE.Vector2(e.clientX, e.clientY));
            }
        };
        _this.pts = _this.ring.points;
        console.log("Are you ready?");
        _this.debug();
        return _this;
    }
    RingDrawingProcedure.prototype.getRing = function (callback) {
        var _this = this;
        this.events.listenByOnce(this, "state/finish", function () {
            callback(null, _this.ring);
        });
        if (this.state === "void")
            this.setState("init");
    };
    RingDrawingProcedure.prototype.atInit = function () {
        this.layer2d.node.addEventListener("mousedown", this.handler);
        this.layer2d.node.addEventListener("mouseup", this.handler);
        this.layer2d.node.addEventListener("mousemove", this.handler);
        this.layer2d.show();
        this.setState("handleFirstPoint");
        this.layer2d.drawables.push(this.ring);
    };
    RingDrawingProcedure.prototype.atHandleFirstPoint = function () {
        var _this = this;
        this.consumeWhenAvailable("start", function (v) {
            _this.pts.push(v);
            _this.consumeAll("p");
            _this.setState("handlePoint");
        });
    };
    RingDrawingProcedure.prototype.atHandlePoint = function () {
        var _this = this;
        if (this.type) {
            switch (this.type) {
                case "rectangle":
                    this.consumeWhenAvailable("p", function (v) {
                        _this.ring.points = _this.resetPoints(_this.pts, v);
                        _this.setState("handlePoint");
                    });
                    this.consumeWhenAvailable("last", function (v) {
                        _this.ring.points = _this.resetPoints(_this.pts, v);
                        _this.setState("finish");
                    });
                    break;
            }
        }
        else {
            this.consumeWhenAvailable("p", function (v) {
                _this.pts.push(v);
                _this.setState("handlePoint");
            });
            this.consumeWhenAvailable("last", function (v) {
                _this.pts.push(v);
                _this.setState("finish");
            });
        }
    };
    RingDrawingProcedure.prototype.resetPoints = function (pts, v) {
        var resultPoints = [];
        resultPoints.push(pts[0]);
        resultPoints.push(new THREE.Vector2(v.x, pts[0].y));
        resultPoints.push(v);
        resultPoints.push(new THREE.Vector2(pts[0].x, v.y));
        return resultPoints;
    };
    RingDrawingProcedure.prototype.atFinish = function () {
        var _this = this;
        this.layer2d.node.removeEventListener("mousedown", this.handler);
        this.layer2d.node.removeEventListener("mouseup", this.handler);
        this.layer2d.node.removeEventListener("mousemove", this.handler);
        this.layer2d.hide();
        this.layer2d.drawables = this.layer2d.drawables.filter(function (item) { return item != _this.ring; });
    };
    return RingDrawingProcedure;
}(Leaf.States));
