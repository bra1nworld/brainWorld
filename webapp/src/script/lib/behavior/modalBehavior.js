"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var popupBehavior_1 = require("./popupBehavior");
var ModalBehavior = /** @class */ (function () {
    function ModalBehavior(option, widget) {
        if (widget === void 0) { widget = new ModalBehavior.TemplateWidget; }
        this.option = option;
        this.widget = widget;
        this.asPopup = new popupBehavior_1.PopupBehavior(this.widget);
        this.widget.UI.container.appendChild(this.option.node);
        ModalBehavior.events.emit("create", this);
    }
    ModalBehavior.prototype.onClickClose = function () {
        this.asPopup.hide();
    };
    ModalBehavior.prototype.show = function () {
        this.asPopup.show();
    };
    ModalBehavior.prototype.hide = function () {
        this.asPopup.hide();
    };
    ModalBehavior.prototype.onClickCloseButton = function () {
        this.hide();
    };
    ModalBehavior.setTemplate = function (template) {
        this.TemplateWidget = template;
    };
    ModalBehavior.events = new Leaf.EventEmitter();
    return ModalBehavior;
}());
exports.ModalBehavior = ModalBehavior;
