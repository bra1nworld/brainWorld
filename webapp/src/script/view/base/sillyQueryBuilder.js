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
var SillyQueryBuilder = /** @class */ (function (_super) {
    __extends(SillyQueryBuilder, _super);
    function SillyQueryBuilder(option) {
        var _this = _super.call(this) || this;
        _this.option = option;
        _this.form = new sillyForm_1.SillyForm(_this.option);
        _this.events = new Leaf.EventEmitter();
        _this.VM.collapsed = true;
        return _this;
    }
    SillyQueryBuilder.prototype.onClickConfirm = function () {
        var value = this.form.getValue();
        this.events.emit("query", value);
    };
    SillyQueryBuilder.prototype.onClickReset = function () {
        this.form.clear();
        this.events.emit("query", {});
    };
    SillyQueryBuilder.prototype.onClickCollapse = function () {
        this.VM.collapsed = !this.VM.collapsed;
        if (this.VM.collapsed) {
            this.VM.collapseButtonText = "展开";
        }
        else {
            this.VM.collapseButtonText = "收起";
        }
    };
    SillyQueryBuilder.prototype.getQuery = function () {
        return this.form.getValue();
    };
    return SillyQueryBuilder;
}(R.Base.SillyQueryBuilder));
exports.SillyQueryBuilder = SillyQueryBuilder;
var sillyForm_1 = require("./sillyForm");
