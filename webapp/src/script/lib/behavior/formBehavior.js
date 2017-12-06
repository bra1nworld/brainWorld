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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var FormBehavior = /** @class */ (function () {
    function FormBehavior(widget) {
        this.widget = widget;
        this.definition = new FormDataDefinition(this.widget, this);
    }
    FormBehavior.prototype.getData = function () {
        return this.definition.getData();
    };
    FormBehavior.prototype.validate = function () {
        return this.definition.validate();
    };
    return FormBehavior;
}());
exports.FormBehavior = FormBehavior;
var ValidatorRule = Leaf.ValidatorRule;
var FormDataDefinition = /** @class */ (function (_super) {
    __extends(FormDataDefinition, _super);
    function FormDataDefinition(widget, formBehavior) {
        var _this = _super.call(this) || this;
        _this.widget = widget;
        _this.formBehavior = formBehavior;
        return _this;
    }
    FormDataDefinition.prototype.input = function (name) {
        return {
            type: "input",
            annotation: true,
            name: name
        };
    };
    FormDataDefinition.prototype.getData = function () {
        var result = {};
        for (var name_1 in this.fields) {
            var input = this.getInputName(name_1);
            var el = this.widget.UI[input];
            if (!el)
                continue;
            var value = el.value.trim();
            result[name_1] = value;
        }
        return result;
    };
    FormDataDefinition.prototype.validate = function () {
        this.check(this.getData());
    };
    FormDataDefinition.prototype.getInputName = function (field) {
        if (!this.fields[field])
            return null;
        var info = this.fields[field];
        for (var _i = 0, _a = info.rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (rule.type == "input") {
                return rule["name"];
            }
        }
        return field + "Input";
    };
    __decorate([
        ValidatorRule
    ], FormDataDefinition.prototype, "input", null);
    return FormDataDefinition;
}(Leaf.DataDefinition));
exports.FormDataDefinition = FormDataDefinition;
