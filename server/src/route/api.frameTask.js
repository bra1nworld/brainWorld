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
var FrameTaskAPIService = /** @class */ (function (_super) {
    __extends(FrameTaskAPIService, _super);
    function FrameTaskAPIService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FrameTaskAPIService.prototype.initialize = function () {
        var _this = this;
        this.api("getFramePoints", function (ctx) {
            ctx.done(null, null);
        });
        this.api("getBagInfo", function (ctx) {
            ctx.done(null, null);
        });
        this.api("queryFrameTasks", function (ctx) {
            _this.services.FrameTaskService.queryFrames(ctx.body, function (err, result) {
                ctx.done(err, result);
            });
        });
        this.api("findFrameTasks", function (ctx) {
            _this.services.FrameTaskService.findFrameTasks(ctx.body.query, function (err, result) {
                ctx.done(err, result);
            });
        });
        this.api("updateFrameTask", function (ctx) {
            _this.services.FrameTaskService.updateFrame({
                id: ctx.params.id,
                updates: ctx.body.updates
            }, function (err, result) {
                ctx.done(err, result);
            });
        });
        this.api("getFrameAnnotatesById", function (ctx) {
            _this.services.FrameTaskService.getFrameById({ id: ctx.params.id }, function (err, result) {
                ctx.done(err, result.annotations);
            });
        });
        this.api("getFrameTaskById", function (ctx) {
            _this.services.FrameTaskService.getFrameById({ id: ctx.params.id }, function (err, result) {
                ctx.done(err, result);
            });
        });
        this.installTo(this.services.ExpressService.server);
    };
    return FrameTaskAPIService;
}(RouteSpec.FrameTaskAPIServiceSpec));
exports.FrameTaskAPIService = FrameTaskAPIService;
//# sourceMappingURL=api.frameTask.js.map