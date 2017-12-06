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
var Color = /** @class */ (function (_super) {
    __extends(Color, _super);
    function Color(option) {
        var _this = _super.call(this) || this;
        _this.name = option.name;
        _this.displayName = option.displayName;
        _this.VM.displayName = option.displayName;
        console.log("create?");
        return _this;
    }
    Color.prototype.getValue = function () {
        return this.UI.input.value;
    };
    Color.prototype.setValue = function (str) {
        console.log("set value", str, "???");
        this.UI.input.value = str;
    };
    return Color;
}(R.Form.Color));
exports.Color = Color;
