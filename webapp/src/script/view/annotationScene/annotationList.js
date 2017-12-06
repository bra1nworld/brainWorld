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
var editors_1 = require("./editors");
var helpers_1 = require("../../helpers");
var dict_1 = require("../../dict");
var actionList_1 = require("./actionList");
var interactable_1 = require("./interactable");
var AnnotationList = /** @class */ (function (_super) {
    __extends(AnnotationList, _super);
    function AnnotationList(scene, frameId, readonly, checkingList) {
        var _this = _super.call(this) || this;
        _this.scene = scene;
        _this.frameId = frameId;
        _this.readonly = readonly;
        _this.checkingList = checkingList;
        _this.events = new Leaf.EventEmitter();
        _this.init();
        return _this;
    }
    AnnotationList.prototype.init = function () {
        var _this = this;
        //处理annotation-list-item数据
        this.scene.createList.events.listenBy(this, "click", function (value) {
            _this.createItem(value);
        });
    };
    AnnotationList.prototype.onChildAddAnnotationList = function (child) {
        var _this = this;
        child.events.listenBy(this, "activate", function () {
            _this.choose(child);
        });
        child.events.listenBy(this, "remove", function () {
            _this.annotationList.removeItem(child);
        });
        child.attach(this.scene);
        child.show();
    };
    AnnotationList.prototype.onChildRemoveAnnotationList = function (child) {
        child.events.stopListenBy(this);
    };
    AnnotationList.prototype.choose = function (child) {
        child.show();
        if (this.current == child)
            return;
        if (this.current)
            this.current.deactivate();
        this.current = child;
        child.show();
        child.activate();
    };
    AnnotationList.prototype.createItem = function (objectType) {
        var editor = new editors_1.AnnotationCreateEditor();
        var id = helpers_1.uuid();
        var result = {
            id: id,
            objectType: objectType,
            type: objectType,
            geometry: null,
            color: "#" + this.createRandomColor()
        };
        result.objectType = dict_1.ObjectTypes[result.objectType];
        var item = new AnnotationListItem(result, objectType);
        this.annotationList.push(item);
        this.choose(item);
    };
    AnnotationList.prototype.createRandomColor = function () {
        var color = Math.floor((Math.random() * 256 * 256 * 256)).toString(16);
        while (color.length < 6) {
            color += Math.floor((Math.random() * 16)).toString(16);
        }
        return color;
    };
    AnnotationList.prototype.getAnnotations = function () {
        return this.annotationList.map(function (item) { return item.toAnnotation(); });
    };
    return AnnotationList;
}(R.AnnotationScene.AnnotationList));
exports.AnnotationList = AnnotationList;
var AnnotationListItem = /** @class */ (function (_super) {
    __extends(AnnotationListItem, _super);
    function AnnotationListItem(annotation, type) {
        var _this = _super.call(this) || this;
        _this.annotation = annotation;
        _this.type = type;
        _this.events = new Leaf.EventEmitter();
        _this.isShow = false;
        _this.actionList = new actionList_1.ActionList(type);
        _this.sphere = interactable_1.InteractableAnnotationGeometry.fromJSON(_this.annotation, _this.actionList, false);
        _this.render();
        return _this;
    }
    AnnotationListItem.prototype.render = function () {
        this.sphere.setMeta({ color: this.annotation.color });
        this.sphere.redraw();
        this.UI.colorBlock.style.background = this.sphere.data.color;
        this.VM.objectTypeIndex = dict_1.ObjectTypesMap[dict_1.ObjectTypes[this.annotation.objectType]];
    };
    AnnotationListItem.prototype.onClickEdit = function () {
        this.edit();
    };
    AnnotationListItem.prototype.onClickRemove = function () {
        if (window.confirm("confirm delete?")) {
            this.detach(this.scene);
            this.events.emit("remove");
        }
    };
    AnnotationListItem.prototype.edit = function () {
        var _this = this;
        var editor = new editors_1.AnnotationCreateEditor();
        var info = this.annotation;
        info.objectType = dict_1.ObjectTypes[info.objectType];
        editor.edit(info, function (err, result) {
            console.log("Finishe dtir,result", result);
            if (result) {
                result.objectType = dict_1.ObjectTypes[result.objectType];
                _this.annotation = result;
                _this.render();
                _this.events.emit("change");
            }
        });
    };
    AnnotationListItem.prototype.attach = function (scene) {
        this.scene = scene;
        this.sphere.attach(scene);
    };
    AnnotationListItem.prototype.detach = function (scene) {
        if (this.scene !== scene)
            return;
        this.sphere.detach();
    };
    AnnotationListItem.prototype.deactivate = function () {
        if (!this.VM.active)
            return;
        this.VM.active = false;
        this.actionList.VM.active = false;
        this.events.emit("deactivate");
        this.sphere.deactivate();
    };
    AnnotationListItem.prototype.activate = function () {
        if (this.VM.active)
            return;
        this.VM.active = true;
        this.actionList.VM.active = true;
        this.render();
        this.events.emit("activate");
        this.sphere.activate();
    };
    AnnotationListItem.prototype.onClickShow = function () {
        var value = this.VM.show;
        if (value) {
            this.hide();
        }
        else {
            this.show();
        }
    };
    AnnotationListItem.prototype.show = function () {
        if (this.isShow)
            return;
        this.isShow = true;
        this.VM.show = true;
        this.sphere.show();
        this.events.emit("show");
    };
    AnnotationListItem.prototype.hide = function () {
        if (!this.isShow)
            return;
        this.isShow = false;
        this.VM.show = false;
        this.sphere.hide();
        this.events.emit("hide");
    };
    AnnotationListItem.prototype.onClickNode = function () {
        if (!this.VM.active) {
            console.log("activate?");
            this.activate();
        }
    };
    AnnotationListItem.prototype.toAnnotation = function () {
        var ann = this.sphere.toJSON();
        ann.objectType = this.annotation.objectType;
        return ann;
    };
    return AnnotationListItem;
}(R.AnnotationScene.AnnotationList.AnnotationListItem));
exports.AnnotationListItem = AnnotationListItem;
