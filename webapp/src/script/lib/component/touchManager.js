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
var TouchManager = /** @class */ (function (_super) {
    __extends(TouchManager, _super);
    function TouchManager(node) {
        var _this = _super.call(this) || this;
        _this.node = node;
        _this.lifeCircle = new TouchLifeCircle();
        _this.attach(_this.node);
        return _this;
    }
    TouchManager.prototype.attach = function (node) {
        var _this = this;
        if (!node)
            return;
        this.node = node;
        for (var _i = 0, _a = ["touchstart", "touchmove", "touchcancel", "touchend"]; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            this.node.addEventListener(name_1, function (e) {
                _this.lifeCircle.feed("touchSignal", e);
            });
        }
    };
    return TouchManager;
}(Leaf.EventEmitter));
exports.TouchManager = TouchManager;
var TouchLifeCircle = /** @class */ (function (_super) {
    __extends(TouchLifeCircle, _super);
    function TouchLifeCircle() {
        var _this = _super.call(this) || this;
        _this.debug();
        _this.setState("waitTouchStart");
        return _this;
    }
    TouchLifeCircle.prototype.atWaitTouchStart = function () {
        var _this = this;
        this.consumeWhenAvailableMergeToLast("touchSignal", function (e) {
            if (e.type !== "touchstart") {
                _this.setState("waitTouchStart");
                return;
            }
            _this.setState("touchStart", e);
            _this.events.emit("start", _this.data.session);
        });
    };
    TouchLifeCircle.prototype.atTouchStart = function (stale, e) {
        var session = this.data.session = new TouchSession();
        session.decoration(e);
        session.start = e;
        this.setState("waitTouchContinue");
    };
    TouchLifeCircle.prototype.atWaitTouchContinue = function () {
        var _this = this;
        this.consumeWhenAvailableMergeToLast("touchSignal", function (e) {
            if (e.type === "touchend" || e.type === "touchcancel") {
                _this.setState("touchEnd", e);
                return;
            }
            else if (e.type === "touchmove") {
                _this.setState("touchMove", e);
            }
            else {
                _this.error(new Error("Unexpected touch sequence"));
            }
        });
    };
    TouchLifeCircle.prototype.atTouchMove = function (stale, e) {
        this.data.session.add(e);
        this.events.emit("update", this.data.session);
        this.setState("waitTouchContinue");
    };
    TouchLifeCircle.prototype.atTouchEnd = function (stale, e) {
        if (e.type == "touchcancel") {
            this.data.session.end = e;
            this.events.emit("cancel", this.data.session);
            this.setState("waitTouchStart");
        }
        if (e.touches.length == 0) {
            this.data.session.end = e;
            this.setState("touchFinish");
        }
        else {
            this.data.session.add(e);
            this.events.emit("change", this.data.session);
            this.setState("waitTouchContinue");
        }
    };
    TouchLifeCircle.prototype.atTouchFinish = function (stale) {
        this.events.emit("finish", this.data.session);
        this.setState("waitTouchStart");
    };
    TouchLifeCircle.prototype.atPanic = function () {
        this.reset();
        this.setState("waitTouchStart");
    };
    return TouchLifeCircle;
}(Leaf.States));
exports.TouchLifeCircle = TouchLifeCircle;
var TouchSession = /** @class */ (function () {
    function TouchSession() {
        this.moves = [];
    }
    TouchSession.prototype.getMovementVector = function () {
        var move;
        if (this.moves.length > 0) {
            move = this.moves[this.moves.length - 1];
        }
        else {
            move = this.end || this.start;
        }
        if (!move) {
            return {
                x: 0, y: 0
            };
        }
        var end = this.getEventCenterPoint(move, "client");
        var start = this.getEventCenterPoint(this.start, "client");
        return {
            x: end.x - start.x,
            y: end.y - start.y
        };
    };
    TouchSession.prototype.getEventCenterPoint = function (e, value) {
        if (value === void 0) { value = "client"; }
        if (e["savedPoint"]) {
            console.error("GETPOPP", e, e["savedPoint"]);
            return e["savedPoint"];
        }
        var p = {
            x: 0,
            y: 0
        };
        for (var index = 0; index < e.touches.length; index += 1) {
            var touch = e.touches[index];
            p.x += touch[value + "X"];
            p.y += touch[value + "Y"];
        }
        p.x /= e.touches.length;
        p.y /= e.touches.length;
        return p;
    };
    TouchSession.prototype.decoration = function (e) {
        var point = this.getEventCenterPoint(e);
        e["savedPoint"] = point;
    };
    TouchSession.prototype.add = function (e) {
        var point = this.getEventCenterPoint(e);
        e["savedPoint"] = point;
        console.error(point);
        this.moves.push(e);
    };
    return TouchSession;
}());
exports.TouchSession = TouchSession;
