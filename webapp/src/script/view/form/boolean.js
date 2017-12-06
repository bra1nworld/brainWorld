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
var Boolean = /** @class */ (function (_super) {
    __extends(Boolean, _super);
    function Boolean(option) {
        var _this = _super.call(this) || this;
        _this.name = option.name;
        _this.displayName = option.displayName;
        _this.VM.displayName = option.displayName;
        return _this;
    }
    Boolean.prototype.getValue = function () {
        return this.UI.input.checked;
    };
    Boolean.prototype.setValue = function (value) {
        this.UI.input.checked = value;
    };
    return Boolean;
}(R.Form.Boolean));
exports.Boolean = Boolean;
