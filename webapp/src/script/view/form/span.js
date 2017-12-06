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
var Span = /** @class */ (function (_super) {
    __extends(Span, _super);
    function Span(option) {
        var _this = _super.call(this) || this;
        _this.name = option.name;
        _this.displayName = option.displayName;
        _this.VM.displayName = option.displayName;
        return _this;
    }
    Span.prototype.getValue = function () {
        return this.VM.value;
    };
    Span.prototype.setValue = function (str) {
        this.VM.value = str;
    };
    return Span;
}(R.Form.Span));
exports.Span = Span;
