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
// HistoryLogicalState: ...raw(none) - hijacked - void
//
var TITLE_HOLDER = null;
var HistoryState = /** @class */ (function (_super) {
    __extends(HistoryState, _super);
    function HistoryState(history) {
        var _this = _super.call(this) || this;
        _this.history = history;
        _this.events = new Leaf.EventEmitter();
        _this.browserHistory = window.history;
        _this.data = {};
        _this.debug();
        _this.setState("initActivating");
        return _this;
    }
    HistoryState.prototype.atInitActivating = function () {
        this.browserHistory.pushState({
            fromWhere: "none"
        }, TITLE_HOLDER, this.history.getLocation());
        this.setState("hijacking");
    };
    HistoryState.prototype.atHijacking = function () {
        // push checking state into history and thus we are now at hijacked state
        this.browserHistory.pushState({
            fromWhere: "hijacked"
        }, TITLE_HOLDER, this.history.getLocation());
        this.setState("appendVoid");
    };
    HistoryState.prototype.atAppendVoid = function () {
        this.browserHistory.pushState({
            fromWhere: "void"
        }, TITLE_HOLDER, this.history.getLocation());
        this.setState("waiting");
    };
    HistoryState.prototype.atWaiting = function (stale) {
        var _this = this;
        // waiting state is guaranteed to be at solving
        this.consumeWhenAvailable("popstate", function (e) {
            if (!e.state) {
                _this.error(new Error("EmptyState likely get out of our history session"));
                return;
            }
            var state = e.state;
            if (state.fromWhere === "hijacked") {
                if (_this.data.goto) {
                    _this.history.popAll();
                    _this.setState("goto");
                    return;
                }
                else if (_this.history.stack.length > 0) {
                    _this.history.pop();
                    _this.setState("appendVoid");
                    return;
                }
                else {
                    // really go back
                    _this.setState("back");
                    return;
                }
            }
            else if (state.fromWhere === "none") {
                console.error("broken state", state);
                _this.error(new Error("broken none"));
            }
            else {
                console.error("Unknown state", state);
                _this.error(new Error("Unknown state"));
                _this.browserHistory.back();
            }
        });
        if (stale())
            return;
        this.consumeWhenAvailable("goto", function (info) {
            // preventing further consuming
            _this.clearConsumers();
            _this.data.goto = info;
            _this.browserHistory.back();
            _this.setState("waiting");
        });
    };
    HistoryState.prototype.atGoto = function (stale) {
        var _this = this;
        if (!this.data.goto) {
            this.error(new Error("Invalid goto state without goto"));
            return;
        }
        this.consumeWhenAvailable("popstate", function (e) {
            if (stale())
                return;
            if (!e.state) {
                _this.error(new Error("Invalid goto state"));
                return;
            }
            _this.setState("applyGotoUrl");
        });
        this.browserHistory.back();
    };
    HistoryState.prototype.atApplyGotoUrl = function () {
        var _this = this;
        var info = this.data.goto;
        if (!info) {
            this.error(new Error("Invalid apply goto url"));
            return;
        }
        this.browserHistory.pushState({
            fromWhere: "none"
        }, TITLE_HOLDER, this.data.goto.url);
        this.data.goto = null;
        setTimeout(function () {
            if (!info.silent) {
                _this.history.events.emit("goto", _this.history.getLocation());
            }
        }, 0);
        this.setState("hijacking");
    };
    HistoryState.prototype.atBack = function () {
        var _this = this;
        this.consumeWhenAvailable("popstate", function (e) {
            if (!e.state || e.state.fromWhere !== "none") {
                _this.setState("retire");
                return;
            }
            _this.setState("applyBack");
        });
        this.browserHistory.back();
    };
    HistoryState.prototype.atApplyBack = function () {
        var _this = this;
        this.consumeWhenAvailable("popstate", function (e) {
            if (!e.state || e.state.fromWhere !== "none") {
                _this.setState("retire");
                return;
            }
            setTimeout(function () {
                _this.history.events.emit("goto", _this.history.getLocation());
            }, 0);
            _this.setState("hijacking");
        });
        this.browserHistory.back();
    };
    HistoryState.prototype.atRetire = function () {
        // really go back
        this.browserHistory.back();
    };
    return HistoryState;
}(Leaf.States));
exports.HistoryState = HistoryState;
var History = /** @class */ (function () {
    function History() {
        var _this = this;
        this.stack = [];
        this.events = new Leaf.EventEmitter();
        this.state = null;
        if (History.instance)
            return History.instance;
        this.state = new HistoryState(this);
        window.addEventListener("popstate", function (e) {
            _this.state.feed("popstate", e);
        });
        History.instance = this;
    }
    History.prototype.goto = function (url, silent) {
        if (silent === void 0) { silent = false; }
        this.state.feed("goto", {
            url: url, silent: silent
        });
    };
    History.prototype.registerBackButton = function (id, handler) {
        this.stack.push({
            id: id, handler: handler
        });
    };
    History.prototype.removeBackButton = function (id) {
        this.stack = this.stack.filter(function (item) { return item.id !== id; });
    };
    History.prototype.getLocation = function () {
        return window.location.toString();
    };
    History.prototype.pop = function () {
        var item = this.stack.pop();
        if (!item) {
            return false;
        }
        try {
            item.handler();
        }
        catch (e) {
            console.error(e);
        }
        return true;
    };
    History.prototype.popAll = function () {
        while (this.pop())
            ;
    };
    History.instance = null;
    return History;
}());
exports.History = History;
