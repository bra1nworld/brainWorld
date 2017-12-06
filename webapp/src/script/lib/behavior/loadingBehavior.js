"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoadingBehavior = /** @class */ (function () {
    function LoadingBehavior(widget) {
        this.widget = widget;
        this.isLoading = false;
    }
    LoadingBehavior.prototype.start = function () {
        this.widget.VM.loading = true;
        this.isLoading = true;
    };
    LoadingBehavior.prototype.finish = function () {
        this.widget.VM.loading = false;
        this.isLoading = false;
    };
    LoadingBehavior.prototype.reset = function () {
        this.finish();
    };
    return LoadingBehavior;
}());
exports.LoadingBehavior = LoadingBehavior;
