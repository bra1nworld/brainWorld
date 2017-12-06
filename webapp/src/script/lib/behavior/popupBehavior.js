"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PopupStack = /** @class */ (function () {
    function PopupStack(base) {
        if (base === void 0) { base = 10000; }
        this.base = base;
        this.index = 0;
        this.popups = [];
    }
    PopupStack.prototype.add = function (p) {
        if (this.popups.indexOf(p) >= 0) {
            return false;
        }
        this.popups.push(p);
        p.zIndex = ++this.index + this.base;
        return true;
    };
    PopupStack.prototype.remove = function (p) {
        var change = false;
        this.popups = this.popups.filter(function (old) {
            if (old === p) {
                change = true;
                return false;
            }
            return true;
        });
        var last = this.popups[this.popups.length - 1];
        if (last) {
            this.index = last.zIndex - this.base;
        }
        else {
            this.index = 0;
        }
        return change;
    };
    return PopupStack;
}());
exports.PopupStack = PopupStack;
var PopupBehavior = /** @class */ (function () {
    function PopupBehavior(widget, manager) {
        if (manager === void 0) { manager = PopupBehavior.globalManager; }
        this.widget = widget;
        this.manager = manager;
        this.isShow = false;
    }
    PopupBehavior.prototype.show = function () {
        if (this.isShow)
            return;
        this.isShow = true;
        this.manager.add(this);
        var node = this.widget.node;
        node.style.position = "absolute";
        node.style.zIndex = this.zIndex.toString();
        document.body.appendChild(this.widget.node);
    };
    PopupBehavior.prototype.hide = function () {
        this.manager.remove(this);
        if (!this.isShow)
            return;
        this.isShow = false;
        this.manager.remove(this);
        document.body.removeChild(this.widget.node);
    };
    PopupBehavior.prototype.center = function () {
        if (!this.isShow)
            return null;
        var rect = this.widget.node.getBoundingClientRect();
        var winWidth = window.document.body.offsetWidth;
        var winHeight = window.document.body.offsetHeight;
        var left = (winWidth - rect.width) / 2;
        var top = (winHeight - rect.height) / 2;
        this.widget.node.style.top = top + "px";
        this.widget.node.style.left = left + "px";
        return {
            x: left,
            y: top
        };
    };
    PopupBehavior.globalManager = new PopupStack();
    return PopupBehavior;
}());
exports.PopupBehavior = PopupBehavior;
