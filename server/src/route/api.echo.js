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
var EchoAPIService = /** @class */ (function (_super) {
    __extends(EchoAPIService, _super);
    function EchoAPIService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EchoAPIService.prototype.initialize = function () {
        this.api("echo", function () {
            this.success({
                name: this.params.name,
                content: this.body.content
            });
        });
        this.installTo(this.services.ExpressService.server);
    };
    return EchoAPIService;
}(RouteSpec.EchoAPIServiceSpec));
exports.EchoAPIService = EchoAPIService;
//# sourceMappingURL=api.echo.js.map