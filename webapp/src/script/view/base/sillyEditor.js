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
var SillyEditor = /** @class */ (function (_super) {
    __extends(SillyEditor, _super);
    function SillyEditor(definition) {
        var _this = _super.call(this) || this;
        _this.definition = definition;
        _this.form = new sillyForm_1.SillyForm(_this.definition);
        _this.asModal = new sillyModal_1.SillyModal(_this);
        console.log(_this.definition);
        if (_this.definition.readonly === true) {
            _this.VM.readonly = true;
        }
        if (_this.definition.name) {
            _this.asModal.VM.name = _this.definition.name;
        }
        return _this;
    }
    SillyEditor.prototype.edit = function (callback) {
        this.callback = callback;
        if (this.definition.title) {
            var title = "";
            if (typeof this.definition.title == "string") {
                title = this.definition.title;
            }
            else {
                console.log(this.definition.data);
                title = this.definition.title(this.definition.data);
            }
            if (title && title != "") {
                this.asModal.VM.title = title;
            }
        }
        this.asModal.show();
    };
    SillyEditor.prototype.onClickConfirm = function () {
        if (this.definition.readonly === true) {
            this.onClickCancel();
            return;
        }
        var value = this.form.getValue();
        if (this.definition.confirm) {
            var result = this.definition.confirm(value);
            if (!result)
                return;
        }
        this.asModal.hide();
        this.callback(null, value);
    };
    SillyEditor.prototype.onClickCancel = function () {
        this.asModal.hide();
        this.callback(new Error("Abort"));
    };
    return SillyEditor;
}(R.Base.SillyEditor));
exports.SillyEditor = SillyEditor;
var sillyForm_1 = require("./sillyForm");
var sillyModal_1 = require("./sillyModal");
