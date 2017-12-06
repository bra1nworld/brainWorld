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
var popupBehavior_1 = require("../../lib/behavior/popupBehavior");
var SillyModal = /** @class */ (function (_super) {
    __extends(SillyModal, _super);
    function SillyModal(option) {
        var _this = _super.call(this) || this;
        _this.option = option;
        _this.asPopup = new popupBehavior_1.PopupBehavior(_this);
        _this.UI.dialog.appendChild(_this.option.node);
        _this.option.node.className = _this.option.node.className + " content-area";
        return _this;
    }
    SillyModal.prototype.onClickClose = function () {
        this.asPopup.hide();
    };
    SillyModal.prototype.show = function () {
        this.asPopup.show();
    };
    SillyModal.prototype.hide = function () {
        this.asPopup.hide();
    };
    return SillyModal;
}(R.Base.SillyModal));
exports.SillyModal = SillyModal;
