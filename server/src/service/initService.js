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
var ServiceSpec = require("../spec/service");
var InitService = /** @class */ (function (_super) {
    __extends(InitService, _super);
    function InitService(option) {
        var _this = _super.call(this, option) || this;
        _this.option = option;
        _this.name = "InitService";
        _this.befores = ["ExpressService"];
        _this.dependencies = [
            "VideoService", "UserService"
        ];
        return _this;
    }
    InitService.prototype.initialize = function () {
    };
    InitService.prototype.exit = function () {
        process.exit();
    };
    return InitService;
}(ServiceSpec.Service));
exports.InitService = InitService;
//# sourceMappingURL=initService.js.map