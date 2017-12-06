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
var API = require("../R.api");
var Echo = API.GenerateEchoAPIService();
var SceneFrame = API.GenerateSceneFrameAPIService();
var Annotation = API.GenerateAnnotationAPIService();
var AnnotatingTask = API.GenerateAnnotatingTaskAPIService();
var factory = new Leaf.APIFactory({
    prefix: "/api/",
    bodyType: "json",
    errorMapper: function (err) {
        return err;
    },
});
var APIService = /** @class */ (function (_super) {
    __extends(APIService, _super);
    // AnnotatingTask = new AnnotatingTask
    function APIService() {
        var _this = _super.call(this) || this;
        _this.name = "APIService";
        _this.states = [];
        _this.Echo = new Echo;
        _this.SceneFrame = new SceneFrame;
        _this.Annotation = new Annotation;
        //AnnotatingTask
        _this.queryAnnotatingTasks = factory.createAPIFunction({
            method: "POST",
            path: "annotatingTask/paginate"
        });
        _this.applyAnnotatingTask = factory.createAPIFunction({
            method: "POST",
            path: "annotatingTask/apply"
        });
        _this.getAnnotatingTaskById = factory.createAPIFunction({
            method: "POST",
            path: "annotatingTask/:id/get"
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
        //FrameTask
        _this.queryFrameTasks = factory.createAPIFunction({
            method: "POST",
            path: "frameTask/paginate"
        });
        _this.findFrameTasks = factory.createAPIFunction({
            method: "POST",
            path: "frameTask/find"
        });
        _this.annotateFrameTask = factory.createAPIFunction({
            method: "POST",
            path: "frameTask/:id/complete"
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
        _this.getFramePoints = factory.createAPIFunction({
            method: "POST",
            path: "frameTask/getPoints"
        });
        _this.getBagInfo = factory.createAPIFunction({
            method: "POST",
            path: "frameTask/bagInfo"
        });
        //CheckingTasks
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
        //user
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
    return APIService;
}(Leaf.Service));
exports.APIService = APIService;
