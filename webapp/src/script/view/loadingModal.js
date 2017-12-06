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
var popupable_1 = require("../lib/trait/popupable");
var LoadingModal = /** @class */ (function (_super) {
    __extends(LoadingModal, _super);
    function LoadingModal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.asPopup = new popupable_1.Popupable(_this);
        return _this;
    }
    LoadingModal.prototype.show = function () {
        this.asPopup.zIndex = 9999;
        this.asPopup.show();
    };
    LoadingModal.prototype.hide = function () {
        this.asPopup.hide();
    };
    return LoadingModal;
}(R.LoadingModal));
exports.LoadingModal = LoadingModal;
