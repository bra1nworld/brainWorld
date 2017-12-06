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
var RouteSpec = require("../spec/route");
var AnnotatingTaskAPIService = /** @class */ (function (_super) {
    __extends(AnnotatingTaskAPIService, _super);
    function AnnotatingTaskAPIService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnnotatingTaskAPIService.prototype.initialize = function () {
        var _this = this;
        this.api("createTestData", function (ctx) {
            // this.services.AnnotatingTaskService.createTestData()
            // this.services.FrameTaskService.createTestData()
            _this.services.UserService.createTestData(function (err, result) {
                ctx.done(err, result);
            });
            // let filePath = "/home/dhy/tianjin_2017-09-28-13-49-18.bag"
            // let backProvider = new BagProvider()
            // let bagRender = backProvider.get(filePath)
            // let length = bagRender.getLength()
            // this.services.VideoService.createTask({ filePath: filePath, frameTotalCount: length }, (err, result) => {
            //     ctx.done(err, result)
            // })
        });
        this.api("queryAnnotatingTasks", function (ctx) {
            _this.services.AnnotatingTaskService.queryAnnotatingTasks(ctx.body, function (err, result) {
                ctx.done(err, result);
            });
        });
        this.api("getAnnotatingTaskById", function (ctx) {
            _this.services.AnnotatingTaskService.getAnnotatingTaskById(ctx.params, function (err, result) {
                ctx.done(err, result);
            });
        });
        this.api("applyAnnotatingTask", function (ctx) {
            _this.services.AnnotatingTaskService.applyAnnotatingTask(ctx.body, function (err, result) {
                ctx.done(err, result);
            });
        });
        this.api("pendingAnnotatingTask", function (ctx) {
            var updates = { state: "pending", workerId: "" };
            var option = {
                "id": ctx.params.id,
                "updates": updates
            };
            _this.services.AnnotatingTaskService.updateAnnotatingTaskById(option, function (err, result) {
                ctx.done(err, result);
            });
        });
        this.api("confirmAnnotatingTask", function (ctx) {
            _this.services.FrameTaskService.findFrameTasks({
                taskId: ctx.params.id,
                states: ["pending", "annotating", "hasError"]
            }, function (err, result) {
                if (result.length > 0) {
                    console.log(">>>>00000");
                    ctx.done(err, null);
                    return;
                }
                var updates = { state: "annotated" };
                var option = {
                    "id": ctx.params.id,
                    "updates": updates
                };
                _this.services.AnnotatingTaskService.updateAnnotatingTaskById(option, function (err, result) {
                    ctx.done(err, result);
                });
            });
        });
        this.installTo(this.services.ExpressService.server);
    };
    return AnnotatingTaskAPIService;
}(RouteSpec.AnnotatingTaskAPIServiceSpec));
exports.AnnotatingTaskAPIService = AnnotatingTaskAPIService;
//# sourceMappingURL=api.annotatingTask.js.map