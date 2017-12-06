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
function GenerateEchoAPIService(factory, Base) {
    if (factory === void 0) { factory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }); }
    if (Base === void 0) { Base = /** @class */ (function () {
        function class_1() {
        }
        return class_1;
    }()); }
    return /** @class */ (function (_super) {
        __extends(class_2, _super);
        function class_2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.factory = factory;
            _this.echo = factory.createAPIFunction({
                method: "POST",
                path: "echo/:name/GET"
            });
            return _this;
        }
        return class_2;
    }(Base));
}
exports.GenerateEchoAPIService = GenerateEchoAPIService;
function GenerateAnnotationAPIService(factory, Base) {
    if (factory === void 0) { factory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }); }
    if (Base === void 0) { Base = /** @class */ (function () {
        function class_3() {
        }
        return class_3;
    }()); }
    return /** @class */ (function (_super) {
        __extends(class_4, _super);
        function class_4() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.factory = factory;
            _this.getSceneFrameAnnotations = factory.createAPIFunction({
                method: "POST",
                path: "annotation/:sceneId/:frameIndex/GET"
            });
            _this.saveFrameAnnotation = factory.createAPIFunction({
                method: "PUT",
                path: "annotation/:sceneId/:frameIndex"
            });
            return _this;
        }
        return class_4;
    }(Base));
}
exports.GenerateAnnotationAPIService = GenerateAnnotationAPIService;
function GenerateSceneFrameAPIService(factory, Base) {
    if (factory === void 0) { factory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }); }
    if (Base === void 0) { Base = /** @class */ (function () {
        function class_5() {
        }
        return class_5;
    }()); }
    return /** @class */ (function (_super) {
        __extends(class_6, _super);
        function class_6() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.factory = factory;
            _this.getSceneFrame = factory.createAPIFunction({
                method: "POST",
                path: "frame/:sceneId/:frameIndex"
            });
            _this.getUnannotatedSceneFrame = factory.createAPIFunction({
                method: "POST",
                path: "frame"
            });
            return _this;
        }
        return class_6;
    }(Base));
}
exports.GenerateSceneFrameAPIService = GenerateSceneFrameAPIService;
function GenerateAnnotatingTaskAPIService(factory, Base) {
    if (factory === void 0) { factory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }); }
    if (Base === void 0) { Base = /** @class */ (function () {
        function class_7() {
        }
        return class_7;
    }()); }
    return /** @class */ (function (_super) {
        __extends(class_8, _super);
        function class_8() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.factory = factory;
            _this.queryAnnotatingTasks = factory.createAPIFunction({
                method: "POST",
                path: "annotatingTask/paginate"
            });
            _this.getAnnotatingTaskById = factory.createAPIFunction({
                method: "POST",
                path: "annotatingTask/:id/get"
            });
            _this.applyAnnotatingTask = factory.createAPIFunction({
                method: "POST",
                path: "annotatingTask/apply"
            });
            _this.pendingAnnotatingTask = factory.createAPIFunction({
                method: "POST",
                path: "annotatingTask/:id/pending"
            });
            _this.confirmAnnotatingTask = factory.createAPIFunction({
                method: "POST",
                path: "annotatingTask/:id/confirm"
            });
            _this.createTestData = factory.createAPIFunction({
                method: "POST",
                path: "annotatingTask/testData"
            });
            return _this;
        }
        return class_8;
    }(Base));
}
exports.GenerateAnnotatingTaskAPIService = GenerateAnnotatingTaskAPIService;
function GenerateCheckingTaskAPIService(factory, Base) {
    if (factory === void 0) { factory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }); }
    if (Base === void 0) { Base = /** @class */ (function () {
        function class_9() {
        }
        return class_9;
    }()); }
    return /** @class */ (function (_super) {
        __extends(class_10, _super);
        function class_10() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.factory = factory;
            _this.queryCheckingTasks = factory.createAPIFunction({
                method: "POST",
                path: "checkingTask/paginate"
            });
            _this.applyCheckingTask = factory.createAPIFunction({
                method: "POST",
                path: "checkingTask/apply"
            });
            _this.confirmCheckingTask = factory.createAPIFunction({
                method: "POST",
                path: "checkingTask/:id/confirm"
            });
            return _this;
        }
        return class_10;
    }(Base));
}
exports.GenerateCheckingTaskAPIService = GenerateCheckingTaskAPIService;
function GenerateFrameTaskAPIService(factory, Base) {
    if (factory === void 0) { factory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }); }
    if (Base === void 0) { Base = /** @class */ (function () {
        function class_11() {
        }
        return class_11;
    }()); }
    return /** @class */ (function (_super) {
        __extends(class_12, _super);
        function class_12() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.factory = factory;
            _this.queryFrameTasks = factory.createAPIFunction({
                method: "POST",
                path: "frameTask/paginate"
            });
            _this.updateFrameTask = factory.createAPIFunction({
                method: "POST",
                path: "frameTask/:id/update"
            });
            _this.getFrameAnnotatesById = factory.createAPIFunction({
                method: "POST",
                path: "frameTask/:id/getById"
            });
            _this.getFrameTaskById = factory.createAPIFunction({
                method: "POST",
                path: "frameTask/:id/getFrame"
            });
            _this.findFrameTasks = factory.createAPIFunction({
                method: "POST",
                path: "frameTask/find"
            });
            _this.getFramePoints = factory.createAPIFunction({
                method: "POST",
                path: "frameTask/getPoints"
            });
            _this.getBagInfo = factory.createAPIFunction({
                method: "POST",
                path: "frameTask/bagInfo"
            });
            return _this;
        }
        return class_12;
    }(Base));
}
exports.GenerateFrameTaskAPIService = GenerateFrameTaskAPIService;
function GenerateUserAPIService(factory, Base) {
    if (factory === void 0) { factory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }); }
    if (Base === void 0) { Base = /** @class */ (function () {
        function class_13() {
        }
        return class_13;
    }()); }
    return /** @class */ (function (_super) {
        __extends(class_14, _super);
        function class_14() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.factory = factory;
            _this.getUserById = factory.createAPIFunction({
                method: "POST",
                path: "user/:id/getUser"
            });
            _this.getUser = factory.createAPIFunction({
                method: "POST",
                path: "user/getUser"
            });
            _this.login = factory.createAPIFunction({
                method: "POST",
                path: "user/login"
            });
            _this.logout = factory.createAPIFunction({
                method: "DELETE",
                path: "user/logout"
            });
            _this.getEnvironmentInformation = factory.createAPIFunction({
                method: "POST",
                path: "user/environment"
            });
            return _this;
        }
        return class_14;
    }(Base));
}
exports.GenerateUserAPIService = GenerateUserAPIService;
