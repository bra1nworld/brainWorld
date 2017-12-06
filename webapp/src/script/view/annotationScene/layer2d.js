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
var Layer2d = /** @class */ (function (_super) {
    __extends(Layer2d, _super);
    function Layer2d() {
        var _this = _super.call(this) || this;
        _this.drawables = [];
        _this.canvas = _this.node;
        return _this;
    }
    Layer2d.prototype.render = function () {
        this.canvas.width = this.node.clientWidth; //* window.devicePixelRatio
        this.canvas.height = this.node.clientHeight; //* window.devicePixelRatio
        var context = this.canvas.getContext("2d");
        for (var _i = 0, _a = this.drawables; _i < _a.length; _i++) {
            var drawable = _a[_i];
            if (drawable.hidden)
                continue;
            drawable.draw(context);
        }
    };
    Layer2d.prototype.show = function () {
        this.node.style.display = "block";
    };
    Layer2d.prototype.hide = function () {
        this.node.style.display = "none";
    };
    return Layer2d;
}(R.AnnotationScene.Layer2d));
exports.Layer2d = Layer2d;
