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
var Dict = require("../../dict");
var SillyDropdown = /** @class */ (function (_super) {
    __extends(SillyDropdown, _super);
    function SillyDropdown(selectHint, placement) {
        if (placement === void 0) { placement = "bottom"; }
        var _this = _super.call(this) || this;
        _this.selectHint = selectHint;
        _this.events = new Leaf.EventEmitter();
        _this.isReadonly = false;
        _this.options.empty();
        _this.options.push(new DropdownOption(_this, { value: null, displayText: "请选择" + _this.selectHint, placeholder: true }));
        _this.select(_this.options[0]);
        _this.VM.placement = placement;
        return _this;
    }
    SillyDropdown.prototype.readonly = function () {
        this.isReadonly = true;
        this.VM.readonly = true;
        this.node.addEventListener("mousedown", function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }, true);
    };
    SillyDropdown.prototype.getValue = function () {
        if (this.current.config.value === false)
            return false;
        return this.current.config.value;
    };
    SillyDropdown.prototype.setValue = function (value) {
        for (var _i = 0, _a = this.options.toArray(); _i < _a.length; _i++) {
            var option = _a[_i];
            var v = option.config.value;
            if (v && v.value) {
                v = v.value;
            }
            if (v === value) {
                this.select(option);
                return;
            }
        }
    };
    SillyDropdown.prototype.clear = function () {
        this.select(this.options[0]);
    };
    SillyDropdown.prototype.select = function (option) {
        this.current = option;
        this.VM.currentDisplayText = option.config.displayText;
        if (SillyDropdown.current = this) {
            SillyDropdown.current = null;
        }
        this.VM.active = false;
        this.events.emit("change");
    };
    SillyDropdown.prototype.setOptionDict = function (dict) {
        if (typeof dict == "string") {
            dict = Dict[dict];
        }
        this.options.empty();
        this.options.push(new DropdownOption(this, { value: null, displayText: "请选择" + this.selectHint, placeholder: true }));
        if (!dict)
            return;
        for (var _i = 0, dict_1 = dict; _i < dict_1.length; _i++) {
            var item = dict_1[_i];
            var op = new DropdownOption(this, item);
            this.options.push(op);
        }
    };
    SillyDropdown.prototype.onClickCurrentSelect = function () {
        console.log(SillyDropdown.current);
        if (this.isReadonly)
            return;
        if (!this.VM.active) {
            if (SillyDropdown.current) {
                SillyDropdown.current.VM.active = false;
            }
            SillyDropdown.current = this;
        }
        else {
            SillyDropdown.current = null;
        }
        this.VM.active = !this.VM.active;
    };
    return SillyDropdown;
}(R.Base.SillyDropdown));
exports.SillyDropdown = SillyDropdown;
var DropdownOption = /** @class */ (function (_super) {
    __extends(DropdownOption, _super);
    function DropdownOption(parent, config) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.config = config;
        _this.VM.displayText = _this.config.displayText;
        return _this;
    }
    DropdownOption.prototype.onClick = function () {
        this.parent.select(this);
    };
    return DropdownOption;
}(R.Base.SillyDropdown.Option));
exports.DropdownOption = DropdownOption;
window.addEventListener("click", function (e) {
    var target = e.srcElement || e.target;
    if (SillyDropdown.current) {
        if (SillyDropdown.current.node.contains(target)) {
            return;
        }
        SillyDropdown.current.VM.active = false;
        SillyDropdown.current = null;
        e.stopImmediatePropagation();
        e.preventDefault();
    }
}, false);
