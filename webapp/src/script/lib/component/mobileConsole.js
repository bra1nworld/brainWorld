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
var inspector_1 = require("./inspector");
var continuousCounter_1 = require("./continuousCounter");
var MobileConsole = /** @class */ (function (_super) {
    __extends(MobileConsole, _super);
    function MobileConsole() {
        var _this = _super.call(this, "<div data-id='container'></div>") || this;
        _this.inspect = new inspector_1.Inspector();
        _this.node.style.whiteSpace = "pre-wrap";
        _this.node.style.width = "100%";
        _this.node.style.height = "50%";
        _this.node.style.position = "absolute";
        _this.node.style.left = "0";
        _this.node.style.bottom = "0";
        _this.node.style.overflowY = "auto";
        _this.node.style.background = "rgba(0,0,0,.7)";
        _this.node.style.color = "white";
        _this.node.style["webkitOverflowScrolling"] = "touch";
        return _this;
    }
    MobileConsole.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.content(args, "white");
    };
    MobileConsole.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.content(args, "red");
    };
    MobileConsole.prototype.content = function (args, color) {
        var _this = this;
        var allString = args.every(function (item) {
            return typeof item === "string";
        });
        var content;
        if (allString) {
            content = args.join(" ");
        }
        else {
            content = args.map(function (item) { return _this.inspect.inspect(item, 8); }).join(" ");
        }
        var span = document.createElement("div");
        span.textContent = content;
        this.node.appendChild(span);
        this.node.scrollTop = this.node.clientHeight;
        span.style.color = color;
    };
    MobileConsole.prototype.show = function () {
        if (this.isShow)
            return;
        this.isShow = true;
        document.body.appendChild(this.node);
        this.node.scrollTop = this.node.clientHeight;
    };
    MobileConsole.prototype.hide = function () {
        if (!this.isShow)
            return;
        this.isShow = false;
        document.body.removeChild(this.node);
    };
    MobileConsole.prototype.toggle = function () {
        if (this.isShow) {
            this.hide();
        }
        else {
            this.show();
        }
    };
    MobileConsole.initialize = function () {
        var _this = this;
        if (this.console)
            return this.console;
        this.console = new MobileConsole();
        var counter = new continuousCounter_1.ContinuousCounter({
            count: 5,
            during: 1500
        });
        counter.events.listenBy(this, "trigger", function () {
            _this.console.toggle();
            _this.console.log("Log start:");
        });
        window.onerror = function (err) {
            _this.console.error(err);
        };
        document.body.addEventListener("touchstart", function () {
            counter.trigger();
        }, true);
        return this.console;
    };
    return MobileConsole;
}(Leaf.Widget));
exports.MobileConsole = MobileConsole;
