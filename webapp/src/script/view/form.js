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
var formTemplate_1 = require("../lib/component/formTemplate");
var popupable_1 = require("../lib/trait/popupable");
var input_1 = require("./form/input");
var selection_1 = require("./form/selection");
var text_1 = require("./form/text");
var color_1 = require("./form/color");
var tags_1 = require("./form/tags");
var items_1 = require("./form/items");
var span_1 = require("./form/span");
var boolean_1 = require("./form/boolean");
exports.Form = new formTemplate_1.FormTemplate({
    "input": input_1.Input,
    "selection": selection_1.Selection,
    "color": color_1.Color,
    "text": text_1.Text,
    "tags": tags_1.Tags,
    "items": items_1.Items,
    "span": span_1.Span,
    "boolean": boolean_1.Boolean,
});
var PopupEditor = /** @class */ (function (_super) {
    __extends(PopupEditor, _super);
    function PopupEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.asPopup = new popupable_1.Popupable(_this);
        return _this;
    }
    PopupEditor.prototype.edit = function (value, callback) {
        this.callback = callback;
        this.setValue(value || {});
        this.asPopup.show();
        this.asPopup.center();
    };
    PopupEditor.prototype.onClickCancel = function () {
        this.asPopup.hide();
        this.callback(new Error("Abort"));
    };
    PopupEditor.prototype.onClickOk = function () {
        var value = this.getValue();
        this.asPopup.hide();
        this.callback(null, value);
    };
    return PopupEditor;
}(R.PopupEditor));
exports.PopupEditor = PopupEditor;
