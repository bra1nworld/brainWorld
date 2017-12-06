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
var pathModule = require("path");
var fs = require("fs");
var RouteSpec = require("../spec/route");
var SceneFrameAPIService = /** @class */ (function (_super) {
    __extends(SceneFrameAPIService, _super);
    function SceneFrameAPIService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SceneFrameAPIService.prototype.initialize = function () {
        this.api("getSceneFrame", function (ctx) {
            var sf = {
                sceneId: "testScene",
                index: 0,
                pcd: fs.readFileSync(pathModule.join(__dirname, "../../../webapp/src/resource/test.pcd"), "utf8")
            };
            ctx.success(sf);
        });
        this.api("getUnannotatedSceneFrame", function (ctx) {
            ctx.success([{
                    sceneId: "testScene",
                    index: 1
                }]);
        });
        this.installTo(this.services.ExpressService.server);
    };
    return SceneFrameAPIService;
}(RouteSpec.SceneFrameAPIServiceSpec));
exports.SceneFrameAPIService = SceneFrameAPIService;
//# sourceMappingURL=api.frame.js.map