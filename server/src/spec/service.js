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
///<reference path="../typings/index.d.ts"/>
///<reference path="type.d.ts"/>
var service_1 = require("root-ts/lib/service");
var BuiltIn = require("root-ts/lib/builtInService");
var Service = /** @class */ (function (_super) {
    __extends(Service, _super);
    function Service() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Service;
}(service_1.Service));
exports.Service = Service;
var MongodbService = /** @class */ (function (_super) {
    __extends(MongodbService, _super);
    function MongodbService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MongodbService;
}(BuiltIn.MongodbService));
exports.MongodbService = MongodbService;
var VideoService = /** @class */ (function (_super) {
    __extends(VideoService, _super);
    function VideoService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "VideoService";
        return _this;
    }
    return VideoService;
}(Service));
exports.VideoService = VideoService;
var AnnotatingTaskService = /** @class */ (function (_super) {
    __extends(AnnotatingTaskService, _super);
    function AnnotatingTaskService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "AnnotatingTaskService";
        return _this;
    }
    return AnnotatingTaskService;
}(Service));
exports.AnnotatingTaskService = AnnotatingTaskService;
var CheckingTaskService = /** @class */ (function (_super) {
    __extends(CheckingTaskService, _super);
    function CheckingTaskService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "CheckingTaskService";
        return _this;
    }
    return CheckingTaskService;
}(Service));
exports.CheckingTaskService = CheckingTaskService;
var FrameTaskService = /** @class */ (function (_super) {
    __extends(FrameTaskService, _super);
    function FrameTaskService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "FrameTaskService";
        return _this;
    }
    return FrameTaskService;
}(Service));
exports.FrameTaskService = FrameTaskService;
var UserService = /** @class */ (function (_super) {
    __extends(UserService, _super);
    function UserService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UserService;
}(Service));
exports.UserService = UserService;
//# sourceMappingURL=service.js.map