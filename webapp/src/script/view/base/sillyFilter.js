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
var SillyFilter = /** @class */ (function (_super) {
    __extends(SillyFilter, _super);
    function SillyFilter(option) {
        var _this = _super.call(this) || this;
        _this.option = option;
        _this.events = new Leaf.EventEmitter();
        _this.form = new sillyForm_1.SillyForm(_this.option);
        _this.VM.collapsed = true;
        _this.VM.collapseButtonText = "展开";
        return _this;
    }
    SillyFilter.prototype.onClickConfirm = function () {
        var value = this.form.getValue();
        this.events.emit("query", value);
    };
    SillyFilter.prototype.onClickReset = function () {
        this.form.clear();
        this.events.emit("query", {});
    };
    SillyFilter.prototype.onClickCollapse = function () {
        this.VM.collapsed = !this.VM.collapsed;
        if (this.VM.collapsed) {
            this.VM.collapseButtonText = "展开";
        }
        else {
            this.VM.collapseButtonText = "收起";
        }
    };
    SillyFilter.prototype.getValue = function () {
        return this.form.getValue();
    };
    return SillyFilter;
}(R.Base.SillyFilter));
exports.SillyFilter = SillyFilter;
var sillyForm_1 = require("./sillyForm");
