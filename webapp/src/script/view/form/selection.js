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
var Selection = /** @class */ (function (_super) {
    __extends(Selection, _super);
    function Selection(option) {
        var _this = _super.call(this) || this;
        _this.defaultHint = "please choose";
        _this.name = option.name;
        _this.displayName = option.displayName;
        _this.VM.displayName = option.displayName;
        return _this;
    }
    Selection.prototype.getValue = function () {
        for (var _i = 0, _a = this.selectionList.toArray(); _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.node["selected"])
                return item.value;
        }
        var option = this.UI.selection.selectedOptions;
        console.log(option, "??");
        return option["widget"].value;
    };
    Selection.prototype.setValue = function (value) {
        this.currentValue = value;
        for (var _i = 0, _a = this.selectionList.toArray(); _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.value === value) {
                item.select();
            }
        }
    };
    Selection.prototype.setMeta = function (meta) {
        this.selectionList.length = 0;
        if (!meta.noDefault) {
            var def = new Option({
                displayText: meta.defaultHint || this.defaultHint,
                value: null
            });
            this.selectionList.push(def);
            def.select();
        }
        for (var _i = 0, _a = meta.options; _i < _a.length; _i++) {
            var item = _a[_i];
            var option = new Option(item);
            this.selectionList.push(option);
            if (meta.default && option.value === meta.default) {
                option.select();
            }
            if (this.currentValue === option.value) {
                option.select();
            }
        }
    };
    return Selection;
}(R.Form.Selection));
exports.Selection = Selection;
var Option = /** @class */ (function (_super) {
    __extends(Option, _super);
    function Option(option) {
        var _this = _super.call(this) || this;
        _this.VM.displayName = option.displayText;
        _this.value = option.value;
        return _this;
    }
    Option.prototype.select = function () {
        var select = this.node;
        select.selected = true;
    };
    return Option;
}(R.Form.Selection.SelectionListItem));
