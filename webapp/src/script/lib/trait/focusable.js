"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListFocusManager = /** @class */ (function () {
    function ListFocusManager(list) {
        this.list = list;
        this.events = new Leaf.EventEmitter();
    }
    ListFocusManager.prototype.focusAt = function (target) {
        var _this = this;
        this.list.forEach(function (item) {
            if (item === target) {
                if (item.asFocusable.focus())
                    _this.events.emit("focus", item);
            }
            else {
                if (item.asFocusable.blur())
                    _this.events.emit("blur", item);
            }
        });
    };
    return ListFocusManager;
}());
exports.ListFocusManager = ListFocusManager;
var Focusable = /** @class */ (function () {
    function Focusable(owner) {
        this.owner = owner;
        this.events = new Leaf.EventEmitter();
    }
    Focusable.prototype.focus = function () {
        if (this.isFocus)
            return false;
        this.isFocus = true;
        if (this.owner.onFocus)
            this.owner.onFocus();
        if (this.owner.onFocusChange)
            this.owner.onFocusChange(this.isFocus);
        return true;
    };
    Focusable.prototype.blur = function () {
        if (!this.isFocus)
            return false;
        this.isFocus = false;
        if (this.owner.onBlur)
            this.owner.onBlur();
        if (this.owner.onFocusChange)
            this.owner.onFocusChange(this.isFocus);
        return true;
    };
    return Focusable;
}());
exports.Focusable = Focusable;
