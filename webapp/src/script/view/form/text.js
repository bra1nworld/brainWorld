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
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(option) {
        var _this = _super.call(this) || this;
        _this.name = option.name;
        _this.displayName = option.displayName;
        _this.VM.displayName = option.displayName;
        return _this;
    }
    Text.prototype.getValue = function () {
        return this.UI.textarea.value;
    };
    Text.prototype.setValue = function (str) {
        this.UI.textarea.value = str;
    };
    return Text;
}(R.Form.Text));
exports.Text = Text;
