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
var APIService = /** @class */ (function (_super) {
    __extends(APIService, _super);
    function APIService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "APIService";
        _this.states = [];
        _this.Echo = new Echo;
        return _this;
    }
    return APIService;
}(Leaf.Service));
exports.APIService = APIService;
