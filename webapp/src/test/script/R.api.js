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
