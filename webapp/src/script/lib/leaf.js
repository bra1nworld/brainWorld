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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/// <reference path="leaf.ts"/>
var Leaf;
(function (Leaf) {
    var Property = /** @class */ (function () {
        function Property() {
        }
        Property.define = function (who, name, def) {
            var cache = {};
            if (who[name])
                cache.value = who[name];
            if (def.value)
                cache.value = def.value;
            var getFn = function (cache) {
                return cache.value;
            };
            var setFn = function (value, cache) {
                cache.value = value;
                return cache.value;
            };
            var getIt = def.get || getFn;
            var setIt = def.set || setFn;
            Object.defineProperty(who, name, {
                get: function () {
                    return getIt(cache);
                },
                set: function (v) {
                    return setIt(v, cache);
                }
            });
            return def.value || null;
        };
        // For IE using with will cause problem
        Property.withProps = function (who) {
            return new WithProperty(who);
        };
        return Property;
    }());
    Leaf.Property = Property;
    var WithProperty = /** @class */ (function () {
        function WithProperty(who) {
            this.who = who;
        }
        WithProperty.prototype.define = function (name, def) {
            Property.define(this.who, name, def);
            return this;
        };
        return WithProperty;
    }());
    Leaf.WithProperty = WithProperty;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts" />
var Leaf;
(function (Leaf) {
    var Util = /** @class */ (function () {
        function Util() {
        }
        Util.clone = function (obj) {
            if (!obj)
                return obj;
            if (obj instanceof Array) {
                return obj.map(function (item) {
                    return Util.clone(item);
                });
            }
            if (obj instanceof Date) {
                return obj;
            }
            if (obj instanceof RegExp) {
                var i = obj.ignoreCase && "i" || "";
                var g = obj.global && "g" || "";
                var m = obj.multiline && "m" || "";
                return new RegExp(obj.source, i + g + m);
            }
            if (obj
                instanceof String) {
                return new String(obj);
            }
            if (typeof obj === "object") {
                var result = {};
                for (var prop in obj) {
                    result[prop] = this.clone(obj[prop]);
                }
                return result;
            }
            // for RegExp/Function we left it as is.
            return obj;
        };
        Util.capitalize = function (str) {
            if (!str)
                return str;
            return str.charAt(0).toUpperCase() + str.slice(1);
        };
        Util.uncapitalize = function (str) {
            if (!str)
                return str;
            return str.charAt(0).toLowerCase() + str.slice(1);
        };
        Util.camelToSlug = function (str) {
            if (!str)
                return str;
            return str.replace(/[a-z][A-Z]/g, function (match) {
                return match[0] + "-" + match[1].toLowerCase();
            }).toLowerCase();
        };
        Util.slugToCamel = function (str) {
            if (!str)
                return str;
            return str.replace(/-[a-z]/ig, function (match) {
                return match.slice(1).toUpperCase();
            });
        };
        Util.deepEqual = function (a, b) {
            if (a === b)
                return true;
            if (typeof a !== typeof b)
                return false;
            if (typeof a !== "object")
                return false;
            if (a instanceof Array) {
                if (a.length != b.length)
                    return false;
                for (var i = 0; i < a.length; i++) {
                    if (a[i] != b[i])
                        return false;
                    return true;
                }
            }
            else {
                var pas = Object.getOwnPropertyNames(a);
                var pbs = Object.getOwnPropertyNames(b);
                if (pas.length != pbs.length) {
                    return false;
                }
                for (var i = 0; i < pas.length; i++) {
                    var key = pas[i];
                    if (a[key] != b[key])
                        return false;
                }
                return true;
            }
        };
        Util.dictDiff = function (d1, d2, identical) {
            var left = Object.keys(d1).map(function (name) { return { name: name, value: d1[name] }; });
            var right = Object.keys(d2).map(function (name) { return { name: name, value: d2[name] }; });
            if (!identical) {
                identical = function (a, b) {
                    return a === b;
                };
            }
            var result = this.arrayDiff(left, right, function (a, b) {
                return identical(a.value, b.value);
            });
            return {
                left: result.left.map(function (item) { return item.name; }),
                right: result.right.map(function (item) { return item.name; }),
                interact: result.interact.map(function (item) { return item.name; })
            };
        };
        Util.arrayDiff = function (arr1, arr2, identical) {
            if (arr1 === void 0) { arr1 = []; }
            if (arr2 === void 0) { arr2 = []; }
            if (!identical) {
                identical = function (a, b) {
                    return a === b;
                };
            }
            arr1 = arr1.slice();
            arr2 = arr2.slice();
            var interact = [];
            for (var i = 0; i < arr1.length; i++) {
                for (var j = 0; j < arr2.length; j++) {
                    if (identical(arr2[j], arr1[i])) {
                        i--;
                        interact.push(arr1[i]);
                        arr1.splice(i, 1);
                        arr2.splice(j, 1);
                        break;
                    }
                }
                if (!arr1[i])
                    break;
            }
            return {
                left: arr1,
                right: arr2,
                interact: interact
            };
        };
        Util.buildOption = function (defaultOption, option) {
            if (option === void 0) { option = {}; }
            if (typeof defaultOption !== "undefined" && (typeof option === "undefined" || option === null)) {
                return defaultOption;
            }
            var result = {};
            if (option instanceof Array) {
                return option;
            }
            if (defaultOption instanceof Array) {
                if (!option) {
                    return defaultOption.slice();
                }
                else {
                    return option;
                }
            }
            if (typeof option === "object") {
                for (var name_1 in defaultOption) {
                    if (typeof option[name_1] !== "undefined") {
                        result[name_1] = this.buildOption(defaultOption[name_1], option[name_1]);
                    }
                    else {
                        result[name_1] = defaultOption[name_1];
                    }
                }
                return result;
            }
            return option;
        };
        Util.getBrowserInfo = function () {
            if (typeof navigator === "undefined") {
                return {
                    name: "None",
                    version: "None",
                    mobile: false
                };
            }
            var N = navigator.appName;
            var ua = navigator.userAgent;
            var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            var tem = ua.match(/version\/([\.\d]+)/i);
            if (M && tem != null) {
                M[2] = tem[1];
            }
            M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
            return { name: M[0], version: M[1], mobile: Util.isMobile() };
        };
        Util.isMobile = function () {
            if (navigator && navigator.userAgent) {
                return (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) && true;
            }
            else {
                return false;
            }
        };
        return Util;
    }());
    Leaf.Util = Util;
    Leaf.Property.define(Util, "browser", {
        get: function (cache) {
            if (!cache.value) {
                cache.value = Util.getBrowserInfo();
            }
            return cache.value;
        }
    });
    Leaf.SharedCallbacks = {
        create: function () {
            var fn = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var cbs = fn.callbacks.slice(0);
                fn.clear();
                cbs.forEach(function (callback) {
                    callback.apply(void 0, args);
                });
            };
            fn.callbacks = [];
            fn.push = function (callback) {
                fn.callbacks.push(callback);
                fn.count = fn.callbacks.length;
            };
            fn.clear = function () {
                fn.callbacks.length = 0;
                fn.count = 0;
            };
            return fn;
        },
    };
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts"/>
var Leaf;
(function (Leaf) {
    var reg = /{{([a-zA-Z0-9]+)(:[^}]*)?}}/g;
    function renderString(str, actions) {
        reg.lastIndex = 0;
        return str.replace(reg, function (match, name, content) {
            if (content) {
                content = content.slice(1) || null;
            }
            if (typeof actions[name] === "function") {
                var fn = actions[name];
                return fn[name](content);
            }
            else if (typeof actions[name] === "string" || typeof actions[name] === "number") {
                return actions[name].toString();
            }
            else {
                return match;
            }
        });
    }
    Leaf.renderString = renderString;
    function render(obj, actions) {
        if (typeof obj === "string") {
            return renderString(obj, actions);
        }
        else if (obj instanceof String) {
            return renderString(obj.toString(), actions);
        }
        else if (!obj) {
            return obj;
        }
        else if (obj instanceof Array) {
            return obj.map(function (item) {
                return render(item, actions);
            });
        }
        else if (obj instanceof Date) {
            return obj;
        }
        else if (typeof obj === "object") {
            var result = {};
            for (var key in obj) {
                var value = render(obj[key], actions);
                result[key] = value;
            }
            return result;
        }
        return obj;
    }
    Leaf.render = render;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts" />
var Leaf;
(function (Leaf) {
    var EventEmitter = /** @class */ (function () {
        function EventEmitter() {
            this.events = {};
        }
        EventEmitter.prototype.addEventListener = function (event, handler) {
            this.on(event, handler);
            return this;
        };
        EventEmitter.prototype.on = function (event, handler) {
            var ehs = this.getOrCreateEventHandlers(event);
            ehs.push({
                once: false,
                handler: handler
            });
            return this;
        };
        EventEmitter.prototype.once = function (event, handler) {
            var ehs = this.getOrCreateEventHandlers(event);
            ehs.push({
                once: true,
                handler: handler
            });
            return this;
        };
        EventEmitter.prototype.listenByOnce = function (who, event, handler) {
            var ehs = this.getOrCreateEventHandlers(event);
            ehs.push({
                owner: who,
                once: true,
                handler: handler
            });
            return this;
        };
        EventEmitter.prototype.listenBy = function (who, event, handler) {
            if (event instanceof Array) {
                for (var _i = 0, event_1 = event; _i < event_1.length; _i++) {
                    var e = event_1[_i];
                    this.listenBy(who, e, handler);
                }
                return this;
            }
            var ehs = this.getOrCreateEventHandlers(event);
            ehs.push({
                owner: who,
                once: false,
                handler: handler
            });
            return this;
        };
        EventEmitter.prototype.stopListenBy = function (who, event, handler) {
            if (event) {
                var ehs = this.getOrCreateEventHandlers(event);
                ehs = ehs.filter(function (eh) {
                    if (eh.owner === who && (!handler || handler === eh.handler))
                        return false;
                    return true;
                });
                this.events[event] = ehs;
            }
            else {
                if (!who) {
                    return;
                }
                var _loop_1 = function (name_2) {
                    var ehs = this_1.events[name_2];
                    var change = false;
                    ehs = ehs.filter(function (eh) {
                        if (eh.owner === who && (!handler || handler === eh.handler)) {
                            change = true;
                            return false;
                        }
                        return true;
                    });
                    if (change) {
                        this_1.events[name_2] = ehs;
                    }
                };
                var this_1 = this;
                for (var name_2 in this.events) {
                    _loop_1(name_2);
                }
            }
            return this;
        };
        EventEmitter.prototype.removeEventListener = function (event, handler) {
            if (!event) {
                this.events = {};
            }
            if (!handler) {
                this.events[event] = [];
                return this;
            }
            var ehs = this.getOrCreateEventHandlers(event);
            var change = false;
            ehs = ehs.filter(function (eh) {
                if (!eh.owner && (!handler || handler === eh.handler)) {
                    change = true;
                    return false;
                }
                return true;
            });
            if (change) {
                this.events[event] = ehs;
            }
            return this;
        };
        EventEmitter.prototype.emit = function (event) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            var todo = [];
            var ehs = this.getOrCreateEventHandlers(event);
            var change = false;
            ehs = ehs.filter(function (eh) {
                if (eh.owner)
                    todo.push(eh.handler.bind(eh.owner));
                else
                    todo.push(eh.handler);
                if (eh.once) {
                    change = true;
                    return false;
                }
                return true;
            });
            if (change) {
                this.events[event] = ehs;
            }
            todo.forEach(function (handler) {
                handler.apply(void 0, values);
            });
            return this;
        };
        EventEmitter.prototype.getOrCreateEventHandlers = function (event) {
            var ehs = this.events[event];
            if (!ehs) {
                ehs = this.events[event] = [];
            }
            return ehs;
        };
        return EventEmitter;
    }());
    Leaf.EventEmitter = EventEmitter;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts" />
var Leaf;
(function (Leaf) {
    var States = /** @class */ (function () {
        function States() {
            this.events = new Leaf.EventEmitter();
            this.state = "void";
            this.sole = 1;
            this.soleEmitted = 1;
            this.lastException = null;
            this.rescues = [];
            this.data = {};
            this.feeds = {};
            this.isDebugging = false;
            this.clearHandler = null;
            this.name = this.constructor && this.constructor["name"] || null;
            this.panicError = null;
            this.panicState = null;
            this._assertingStateSequence = null;
            this._assertingStateCallback = null;
            this._assertingStateIndex = 0;
            this.reset();
        }
        States.prototype.reset = function () {
            this.data = {};
            this.feeds = {};
            this.respawn();
            this.events.emit("reset");
        };
        States.prototype.setState = function (state) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._setState.apply(this, [state].concat(args));
        };
        States.prototype._stateFinish = function () {
            this.events.emit("state", this.state);
            this.events.emit("state/" + this.state);
            this.soleEmitted = this.sole;
            this._updateStateAssertion(this.state);
        };
        States.prototype.clearConsumers = function () {
            if (this.feeds) {
                for (var prop in this.feeds) {
                    var feed = this.feeds[prop];
                    feed.feedListener = null;
                }
            }
        };
        States.prototype._setState = function (state) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.state === "panic" && state !== "void") {
                return;
            }
            // set state syncly from previous state
            // so we emit the previous state here
            // That is, all state/${state} is guaranteed to be emitted
            // after the state finish and before the next state start.
            this.clear();
            if (this.soleEmitted < this.sole) {
                this._stateFinish();
            }
            // clear all consumers
            this.clearConsumers();
            // new sole
            this.sole += 1;
            this.previousState = this.state;
            this.state = state;
            if (this.isDebugging) {
                this.debugStateHandler();
            }
            var stateHandler = "at" + state[0].toUpperCase() + state.substring(1);
            if (this[stateHandler]) {
                var sole_1 = this.sole;
                this[stateHandler].apply(this, [function () {
                        return sole_1 !== this.sole;
                    }.bind(this)].concat(args));
                // didn't set state during the process, we can safely emit state here
                if (sole_1 === this.sole) {
                    this._stateFinish();
                }
            }
            else if (state !== "void") {
                this.error(new Error("InvalidState " + state));
            }
        };
        States.prototype.error = function (err) {
            this.panicError = err;
            this.panicState = this.state;
            if (this.panicError) {
                this.setState("panic");
            }
        };
        States.prototype.atPanic = function () {
            console.error(this.panicState, this.panicError);
            this.events.emit("panic", this.panicError, this.panicState);
        };
        States.prototype.recover = function (recoverState) {
            var error = this.panicError;
            var state = this.panicState;
            this.respawn();
            if (!recoverState) {
                recoverState = ("void");
            }
            this.setState(recoverState);
            return { error: error, state: state };
        };
        States.prototype.respawn = function () {
            this.sole = this.sole || 1;
            this.sole += 1;
            this.panicError = null;
            this.panicState = null;
            this.setState("void");
            this.clear();
        };
        States.prototype.clear = function (handler) {
            if (handler) {
                if (this.clearHandler) {
                    throw new Error("Already clearing with a handler");
                }
                this.clearHandler = handler;
            }
            else {
                handler = this.clearHandler;
                this.clearHandler = null;
                if (handler) {
                    handler();
                }
            }
        };
        States.prototype.ensureFeed = function (name) {
            if (this.feeds[name])
                return this.feeds[name];
            var feed = this.feeds[name] = {
                feedListener: null,
                signals: [],
                name: name
            };
            return feed;
        };
        States.prototype.feed = function (name, signal) {
            if (!this.feeds[name]) {
                this.feeds[name] = {
                    feedListener: null,
                    signals: [],
                    name: name
                };
            }
            var feed = this.feeds[name];
            feed.signals.push(signal);
            var listener = feed.feedListener;
            if (listener) {
                feed.feedListener = null;
                listener();
            }
        };
        States.prototype.consumeAll = function (name) {
            var feed = this.feeds[name];
            if (feed) {
                var length_1 = feed.signals.length;
                feed.signals.length = 0;
                return length_1;
            }
            return 0;
        };
        States.prototype.hasFeed = function (name) {
            return this.feeds[name] && this.feeds[name].signals.length > 0;
        };
        States.prototype.consume = function (name) {
            if (!this.hasFeed(name))
                return null;
            var feed = this.feeds[name];
            if (feed) {
                return feed.signals.shift() || true;
            }
            return null;
        };
        States.prototype.consumeWhenAvailableMergeToLast = function (name, callback) {
            var _this = this;
            this.consumeWhenAvailable(name, function (detail) {
                var last = null;
                while (true) {
                    last = _this.consume(name);
                    if (!last)
                        break;
                }
                if (last) {
                    callback(last);
                }
                else {
                    callback(detail);
                }
            });
        };
        States.prototype.isConsuming = function (name) {
            return this.feeds[name] && this.feeds[name].feedListener && true || false;
        };
        States.prototype.consumeWhenAvailable = function (name, callback) {
            var _this = this;
            var feed = this.feeds[name];
            if (!feed) {
                feed = this.ensureFeed(name);
            }
            if (feed.signals.length > 0) {
                callback(this.consume(name));
            }
            else {
                feed.feedListener = function () { return callback(_this.consume(name)); };
                this.events.emit("starve", name);
                this.events.emit("starve/" + name);
            }
        };
        States.prototype.debug = function (option) {
            this.isDebugging = true;
        };
        States.prototype.debugStateHandler = function (option, message) {
            option = option || {};
            var name = option.name || this.name || "Anonymous";
            var log = console.debug || console.log;
            log.call(console, name + ": state - " + this.state);
        };
        States.prototype.assertStateSequence = function (states, callback) {
            if (this._assertingStateSequence) {
                callback(new Error("Already asserting"));
                return;
            }
            this._assertingStateSequence = states;
            this._assertingStateCallback = callback;
            this._assertingStateIndex = 0;
        };
        States.prototype._endStateAssertion = function (err) {
            var cb = this._assertingStateCallback;
            if (!cb)
                return;
            this._assertingStateSequence = null;
            this._assertingStateIndex = 0;
            this._assertingStateCallback = null;
            cb(err);
        };
        States.prototype._updateStateAssertion = function (state) {
            var _this = this;
            if (!this._assertingStateSequence)
                return;
            var should = this._assertingStateSequence[this._assertingStateIndex];
            if (should !== state) {
                this._endStateAssertion(new Error("State at index " + this._assertingStateIndex + " should be " + should + " but is " + state + " during sequence " + this._assertingStateSequence.map(function (s, index) { if (index === _this._assertingStateIndex)
                    return "->" + s; return s; }).join("\n")));
            }
        };
        return States;
    }());
    Leaf.States = States;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts" />
var Leaf;
(function (Leaf) {
    var ErrorDoc = /** @class */ (function () {
        function ErrorDoc() {
            this.errors = {};
        }
        ErrorDoc.create = function () {
            return new ErrorDoc();
        };
        ErrorDoc.build = function (info) {
            var result = {};
            for (var name_3 in info) {
                result[name_3] = createError(name_3, Error, info[name_3] || {});
            }
            return result;
        };
        ErrorDoc.prototype.define = function (name, base, defaultProperty) {
            var Base = Error;
            if (typeof base === "string") {
                var _ = this[base];
                if (typeof _ === "function") {
                    Base = _;
                }
            }
            else if (typeof base === "function") {
                Base = base;
            }
            else if (base) {
                console.warn("Unknown base error", base);
            }
            var E = createError(name, Base, defaultProperty);
            this.errors[name] = E;
            return this;
        };
        ErrorDoc.prototype.generate = function () {
            return this.errors;
        };
        return ErrorDoc;
    }());
    Leaf.ErrorDoc = ErrorDoc;
    function createError(name, base, defaultProperty) {
        var E = function (message, detail) {
            if (typeof message === "object") {
                if (!detail) {
                    detail = message;
                    message = name;
                }
                else {
                    try {
                        message = JSON.stringify(message, null, 4);
                    }
                    catch (e) {
                        message = name + "Warning: recursive error property" + e.toString();
                    }
                }
            }
            this.name = name;
            this.message = message || name;
            if (typeof defaultProperty === "function") {
                var _ = base;
                base = defaultProperty;
                defaultProperty = _;
            }
            if (!detail)
                detail = {};
            if (!defaultProperty)
                defaultProperty = {};
            for (var prop in defaultProperty) {
                this[prop] = defaultProperty[prop];
            }
            if (!this.detail) {
                this.detail = {};
            }
            for (var prop in detail) {
                this.detail[prop] = detail[prop];
            }
            if (detail.via) {
                this.via = detail.via;
            }
        };
        var Base = base;
        E.prototype = new Base(name, {});
        E.prototype.toJSON = function () {
            var result = {};
            for (var prop in this) {
                if (this.hasOwnProperty(prop) && typeof this[prop] !== "function") {
                    result[prop] = this[prop];
                }
            }
            if (this.message) {
                result["message"] = this.message;
            }
            return result;
        };
        return E;
    }
    Leaf.createError = createError;
    Leaf.Errors = ErrorDoc.create()
        .define("Timeout")
        .define("Abort")
        .define("IOError")
        .define("NetworkError")
        .generate();
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts" />
var Leaf;
(function (Leaf) {
    var APIFactory = /** @class */ (function () {
        function APIFactory(option) {
            this.option = option;
            this.responseHandler = null;
            this.errorMapper = function (err) {
                return new Error(err.message);
            };
            if (!(typeof this.option.defaultTimeout === "number")) {
                this.option.defaultTimeout = 0;
            }
            if (!(typeof this.option.prefix === "string")) {
                this.option.prefix = "";
            }
            if (!(typeof this.option.suffix === "string")) {
                this.option.suffix = "";
            }
            if (!this.option.root) {
                this.option.root = "";
            }
            if (option.errorMapper) {
                this.errorMapper = option.errorMapper;
            }
        }
        APIFactory.prototype._handleResponse = function (response, callback) {
            var data;
            if (response) {
                try {
                    data = JSON.parse(response);
                }
                catch (e) {
                    callback(new Leaf.Errors.NetworkError("Broken Response"), null);
                    return;
                }
                if (!data.state) {
                    if (data.error) {
                        callback(this.errorMapper(data.error), null);
                    }
                    else {
                        callback(new Error("APIError"), null);
                    }
                    return;
                }
                else {
                    callback(null, data.data);
                }
            }
            else {
                callback(new Leaf.Errors.NetworkError("Empty response"), null);
            }
        };
        APIFactory.prototype.createAPI = function (option) {
            if (typeof option.mock == "undefined") {
                option.mock = this.option.mock;
            }
            var api = new APIDeclare(this, option);
            return api;
        };
        APIFactory.prototype.createAPIFunction = function (option) {
            var api = this.createAPI(option);
            return api.getFunction();
        };
        APIFactory.prototype.solveResponse = function (err, response, callback) {
            callback(err, response);
        };
        APIFactory.prototype.request = function (option, callback) {
            var _this = this;
            var method = option.method || "GET";
            var url = option.url;
            var sendData = null;
            var headers = option.headers || {};
            var bodyType = option.bodyType || this.option.bodyType || "query";
            // Don't send null, send {}. Some framework not recognize null as a valid json
            if (!option.query)
                option.query = {};
            var queryString = this.buildQueryString(option.query);
            if (method.toUpperCase() === "GET") {
                if (url.indexOf("? <= 0")) {
                    url += "?";
                }
                else {
                    url += "&";
                }
                url += queryString;
                sendData = null;
            }
            else {
                if (bodyType === "query") {
                    sendData = queryString;
                }
                else {
                    sendData = JSON.stringify(option.query);
                }
            }
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            if (option.withCredentials) {
                xhr.withCredentials = true;
            }
            xhr.setRequestHeader("Accept", "application/json");
            if (bodyType === "json") {
                xhr.setRequestHeader("Content-Type", "application/json");
            }
            else {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
            for (var name_4 in this.option.headers) {
                if (!headers[name_4])
                    headers[name_4] = this.option.headers[name_4];
            }
            for (var name_5 in headers) {
                xhr.setRequestHeader(name_5, headers[name_5]);
            }
            var done = false;
            var _callback = callback;
            var timer = null;
            callback = function (err, response) {
                clearTimeout(timer);
                // disable multiple callback
                callback = function () { };
                _this.solveResponse(err, response, _callback);
                return;
            };
            if (option.timeout) {
                timer = setTimeout(function () {
                    callback = function () { };
                    _callback(new Leaf.Errors.Timeout("Request timeout after " + option.timeout), null);
                    xhr.abort();
                }, option.timeout * 1000);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 0 && !done) {
                    callback(new Leaf.Errors.NetworkError(), null);
                    return;
                }
                if (xhr.readyState === 4) {
                    done = true;
                    if (_this.responseHandler) {
                        _this.responseHandler(xhr.responseText, callback);
                    }
                    else {
                        _this._handleResponse(xhr.responseText, callback);
                    }
                }
            };
            if (method.toLowerCase() != "get") {
                xhr.send(sendData);
            }
            else {
                xhr.send();
            }
            return xhr;
        };
        APIFactory.prototype.buildQueryString = function (query) {
            if (!query) {
                return "";
            }
            var kvs = [];
            for (var prop in query) {
                var value = query[prop] || "";
                kvs.push([encodeURIComponent(prop), encodeURIComponent(value)].join("="));
            }
            return kvs.join("&");
        };
        return APIFactory;
    }());
    Leaf.APIFactory = APIFactory;
    var APIDeclare = /** @class */ (function () {
        function APIDeclare(factory, option) {
            this.factory = factory;
            this.option = option;
            this.mocks = [];
        }
        APIDeclare.prototype.mock = function (option, error, result) {
            this.mocks.push({
                option: option, error: error, result: result
            });
            return this;
        };
        APIDeclare.prototype._mock = function (option, callback) {
            for (var _i = 0, _a = this.mocks; _i < _a.length; _i++) {
                var mock = _a[_i];
                if (Leaf.Util.deepEqual(option, mock.option)) {
                    callback(mock.error, mock.result);
                    return true;
                }
            }
            return false;
        };
        APIDeclare.prototype.decorateAPIOption = function (option, fn) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var op = args[0] || {};
                for (var key in option) {
                    if (typeof op[key] == "undefined") {
                        op[key] = option[key];
                    }
                }
                args[0] = op;
                fn.apply(void 0, args);
            };
        };
        APIDeclare.prototype.getFunction = function () {
            var _this = this;
            var fn = this.invoke.bind(this);
            fn.API = this;
            fn.mock = function (option, error, result) {
                _this.mock(option, error, result);
                return fn;
            };
            fn.with = function (data) {
                var apiOption = Leaf.Util.clone(_this.option);
                if (!apiOption.data)
                    apiOption.data = {};
                for (var key in data) {
                    apiOption.data[key] = data[key];
                }
                var declare = new APIDeclare(_this.factory, apiOption);
                return declare.getFunction();
            };
            fn.transform = function (ts) {
                return function (op, callback) {
                    fn(op, function (err, data) {
                        if (err) {
                            callback();
                            return;
                        }
                        callback(null, ts(data));
                    });
                };
            };
            return fn;
        };
        APIDeclare.prototype.invoke = function (data, callback) {
            if (data === void 0) { data = {}; }
            if (this.option.mock || this.factory.option.mock) {
                var mocked = this._mock(data, callback);
                if (!mocked) {
                    callback(new Error("Mock miss"));
                }
                return;
            }
            var method = this.option.method;
            var url = this.factory.option.root + this.factory.option.prefix + this.option.path + this.factory.option.suffix;
            var routeParams = (url.match(/:[a-z_][a-z0-9_]*/ig) || []).map(function (item) { return item.substring(1); });
            if (this.option.data) {
                // default params
                for (var prop in this.option.data) {
                    if (typeof data[prop] == "undefined") {
                        data[prop] = this.option.data[prop];
                    }
                }
            }
            for (var prop in data) {
                if (routeParams.indexOf(prop) >= 0) {
                    url = url.replace(new RegExp(":" + prop, "g"), encodeURIComponent(data[prop]));
                    delete data[prop];
                }
            }
            var reqOption = {
                url: url, method: method,
                query: data,
                timeout: this.option.timeout,
                headers: this.option.headers,
                withCredentials: this.option.withCredentials,
                bodyType: this.option.bodyType
            };
            this.factory.request(reqOption, callback);
        };
        return APIDeclare;
    }());
    Leaf.APIDeclare = APIDeclare;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts"/>
var Leaf;
(function (Leaf) {
    var History = /** @class */ (function () {
        function History() {
            this.stack = [];
            this.handlePopState = this.handlePopState.bind(this);
        }
        History.prototype.handlePopState = function () { };
        History.prototype.push = function (id, callback) {
            this.stack.push({ id: id, callback: callback });
        };
        History.prototype.remove = function (id) {
            this.stack = this.stack.filter(function (item) { return item.id != id; });
        };
        History.prototype.activate = function () {
            window.addEventListener("popstate", this.handlePopState);
        };
        History.prototype.deactivate = function () {
            window.removeEventListener("popstate", this.handlePopState);
        };
        return History;
    }());
    Leaf.History = History;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts" />
var Leaf;
(function (Leaf) {
    var DataSource = /** @class */ (function () {
        function DataSource(_name, _fields) {
            if (_fields === void 0) { _fields = []; }
            var _this = this;
            this._name = _name;
            this._fields = _fields;
            this.events = new Leaf.EventEmitter();
            // instance id
            this.id = Date.now().toString() + Math.random().toString();
            this._data = {};
            for (var _i = 0, _a = this._fields; _i < _a.length; _i++) {
                var field = _a[_i];
                this.define(field);
            }
            Object.defineProperty(this, "fields", {
                get: function () {
                    return _this._fields.slice(0);
                }
            });
            Object.defineProperty(this, "data", {
                get: function () {
                    return _this;
                },
                set: function (values) {
                    _this.sets(values);
                }
            });
        }
        DataSource.prototype.define = function (name, defaultValue) {
            var _this = this;
            if (defaultValue === void 0) { defaultValue = null; }
            Object.defineProperty(this, name, {
                get: function () {
                    return _this.get(name);
                },
                set: function (value) {
                    return _this.set(name, value);
                }
            });
        };
        DataSource.prototype.hasKey = function (key) {
            return this._fields.indexOf(key) >= 0;
        };
        DataSource.prototype.sets = function (obj) {
            if (!obj) {
                return;
            }
            if (obj instanceof DataSource) {
                obj = obj.toJSON();
            }
            var changed = false;
            var diff = {};
            for (var key in obj) {
                if (!this.hasKey(key)) {
                    continue;
                }
                var old = this._data[key];
                var value = obj[key];
                if (this.set(key, value, true)) {
                    changed = true;
                    this.events.emit("change/" + key, value, old);
                    diff[key] = old;
                }
            }
            if (changed) {
                this.events.emit("change", diff);
            }
        };
        DataSource.prototype.set = function (key, value, silent) {
            var old = this._data[key];
            if (!this.hasKey(key))
                return false;
            if (old === value) {
                return false;
            }
            this._data[key] = value;
            if (silent)
                return true;
            this.events.emit("change/" + key, value, old);
            var diff = {};
            diff[key] = old;
            this.events.emit("change", diff);
            return true;
        };
        DataSource.prototype.get = function (key) {
            return this._data[key] || null;
        };
        DataSource.prototype.toJSON = function () {
            return JSON.parse(JSON.stringify(this._data));
        };
        return DataSource;
    }());
    Leaf.DataSource = DataSource;
    var Model = /** @class */ (function (_super) {
        __extends(Model, _super);
        function Model() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Model;
    }(DataSource));
    Leaf.Model = Model;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts" />
var Leaf;
(function (Leaf) {
    var Namespace = /** @class */ (function () {
        function Namespace() {
            this.Widgets = {};
        }
        Namespace.prototype.include = function (W, name) {
            if (name === void 0) { name = W.prototype.widgetName; }
            if (W.prototype instanceof Leaf.Widget) {
                if (this.Widgets[name]) {
                    throw new Error("Widget namespace conflicting: " + name);
                }
                this.Widgets[name] = W;
            }
            else {
                console.warn(W, "not inherit WidgetBase");
            }
        };
        Namespace.prototype.getWidgetByName = function (name) {
            name = Leaf.Util.slugToCamel(name);
            name = Leaf.Util.capitalize(name);
            for (var name_6 in this.Widgets) {
                var W = this.Widgets[name_6];
                if (W["widgetName"] === name_6 || W.prototype.widgetName === name_6 || W.constructor["widgetName"] == name_6) {
                    return W;
                }
            }
            return null;
        };
        Namespace.prototype.createWidgetByName = function (name, props) {
            var W = this.getWidgetByName(name);
            if (!W)
                return;
            var w = new W(props);
            return w;
        };
        Namespace.prototype.isTagWidgetName = function (name, who) {
            name = Leaf.Util.slugToCamel(name);
            name = Leaf.Util.capitalize(name);
            if (name === who.widgetName) {
                return true;
            }
            return false;
        };
        Namespace.prototype.clear = function () {
            this.Widgets = {};
        };
        Namespace.prototype.has = function (name) {
            name = Leaf.Util.capitalize(Leaf.Util.slugToCamel(name));
            if (this.Widgets[name])
                return true;
            return false;
        };
        return Namespace;
    }());
    Leaf.Namespace = Namespace;
})(Leaf || (Leaf = {}));
/// <reference path="./leaf.ts" />
var Leaf;
(function (Leaf) {
    var ViewModel = /** @class */ (function (_super) {
        __extends(ViewModel, _super);
        function ViewModel(_name, _fields) {
            if (_fields === void 0) { _fields = []; }
            var _this = _super.call(this, _name, _fields) || this;
            _this._name = _name;
            _this._fields = _fields;
            _this.depChain = new DependencyChain;
            _this.depChain.events.listenBy(_this, "declare", function (dep) {
                console.log("declare", dep);
                _this.events.listenBy("dep/" + dep.src + ":" + dep.target, "change/" + dep.src, function () {
                    _this.events.emit("depChange/" + dep.target);
                });
                _this.events.listenBy("dep/" + dep.src + ":" + dep.target, "depChange/" + dep.src, function () {
                    _this.events.emit("depChange/" + dep.target);
                });
            });
            _this.depChain.events.listenBy(_this, "revoke", function (dep) {
                _this.events.stopListenBy("dep/" + dep.src + ":" + dep.target);
            });
            return _this;
        }
        ViewModel.prototype.set = function (key, value, silent) {
            if (typeof value === "function" || typeof this.get(key) === "function") {
                this.depChain.updateFunctionDependency(key, value);
            }
            return _super.prototype.set.call(this, key, value);
        };
        return ViewModel;
    }(Leaf.Model));
    Leaf.ViewModel = ViewModel;
    var DependencyChain = /** @class */ (function () {
        function DependencyChain() {
            this.events = new Leaf.EventEmitter();
            this.maxDepth = 10;
            this.dependencyMap = {};
        }
        DependencyChain.prototype.extractFunctionDependency = function (fn) {
            if (typeof fn !== "function")
                return [];
            var fnString = fn.toString();
            var reg = /VM\.(\w+)\b/g;
            var match;
            var result = [];
            while (match = reg.exec(fnString)) {
                result.push(match[1]);
            }
            return result;
        };
        DependencyChain.prototype.updateFunctionDependency = function (name, fn) {
            var deps = this.extractFunctionDependency(fn);
            this.validateDependency(name, deps);
            var oldDeps = this.dependencyMap[name];
            var diff = Leaf.Util.arrayDiff(deps, oldDeps);
            for (var _i = 0, _a = diff.left; _i < _a.length; _i++) {
                var dep = _a[_i];
                this.events.emit("declare", { target: name, src: dep });
            }
            for (var _b = 0, _c = diff.right; _b < _c.length; _b++) {
                var dep = _c[_b];
                this.events.emit("revoke", { target: name, src: dep });
            }
            this.dependencyMap[name] = deps;
        };
        DependencyChain.prototype.validateDependency = function (target, src, depth) {
            if (depth === void 0) { depth = 0; }
            if (src.indexOf(target) >= 0) {
                throw new Error("Recursive dependency " + target);
            }
            if (depth > this.maxDepth) {
                throw new Error("Max dependency depth exceed :" + this.maxDepth);
            }
            var nextCheck = [];
            for (var _i = 0, src_1 = src; _i < src_1.length; _i++) {
                var item = src_1[_i];
                if (this.dependencyMap[item]) {
                    var nextDeps = this.dependencyMap[item];
                    for (var _a = 0, nextDeps_1 = nextDeps; _a < nextDeps_1.length; _a++) {
                        var nt = nextDeps_1[_a];
                        // already checked
                        if (src.indexOf(nt) >= 0)
                            continue;
                        if (nextCheck.indexOf(nt) >= 0)
                            continue;
                        nextCheck.push(nt);
                    }
                }
            }
            if (nextCheck.length === 0)
                return true;
            return this.validateDependency(target, nextCheck, depth + 1);
        };
        return DependencyChain;
    }());
    Leaf.DependencyChain = DependencyChain;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts"/>
var Leaf;
(function (Leaf) {
    var WidgetCoreDesign = /** @class */ (function () {
        function WidgetCoreDesign(widget) {
            this.widget = widget;
            this.subWidgetPlaceholder = {};
            this.slotsPlaceholder = {};
            this.slotIndexOffset = 0;
        }
        return WidgetCoreDesign;
    }());
    Leaf.WidgetCoreDesign = WidgetCoreDesign;
    var WidgetInitializerDesign = /** @class */ (function () {
        function WidgetInitializerDesign(widget) {
            this.widget = widget;
        }
        return WidgetInitializerDesign;
    }());
    Leaf.WidgetInitializerDesign = WidgetInitializerDesign;
    var WidgetCore = /** @class */ (function (_super) {
        __extends(WidgetCore, _super);
        function WidgetCore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WidgetCore.prototype.attachElement = function (el, dynamics) {
            // 1. widget
            // 2. common widget
            // 3. slot
            // 4. normal
            // generally todos
            // 0. create real element if needed
            // 1. bind and sync props
            // 2. bindUI by data id
            var tagName = el.tagName.toLowerCase();
            if (tagName.toLowerCase() === "widget") {
                // widget
                var name_7 = el.getAttribute("data-name");
                var path = el.getAttribute("data-widget");
                if (!name_7 && path) {
                    var last = path.split("/").pop();
                    last = last.split(".")[0];
                    name_7 = last;
                }
                if (!name_7) {
                    console.error(el, "widget missing name");
                    throw new Error("<widget> missing data-name or data-widget");
                }
                this.defineSubWidget(name_7, el, dynamics, this.getChildrenAsSlot(el));
            }
            else if (this.widget.namespace.has(tagName) && !this.widget.namespace.isTagWidgetName(tagName, this.widget)) {
                // common widget
                var props = {};
                // none dynamic props
                for (var i = 0; i < el.attributes.length; i++) {
                    var item = el.attributes[i];
                    props[item.name] = item.value;
                }
                // slots
                var customWidget = this.widget.namespace.createWidgetByName(tagName, props);
                // inherit properties
                for (var name_8 in props) {
                    if (!customWidget.node.getAttribute(name_8)) {
                        // resolve data-id-conflict 
                        if (name_8 === "data-id")
                            name_8 = "data-id-of-parent";
                        customWidget.node.setAttribute(name_8, props[name_8]);
                    }
                }
                customWidget.core.fillSlots(this.getChildrenAsSlot(el));
                // use the data-id of placeholder to bindUI
                this.checkAndBindUI(el);
                // apply properties latter on this custom widget than this place holder
                el = customWidget.node;
                // sync props after end of this if statement...
            }
            else if (tagName === "slot") {
                // slot
                var name_9 = el.getAttribute("data-slot");
                this.defineSlot(name_9, el, dynamics);
                // We also bind UI temperarily until filled
                this.checkAndBindUI(el);
            }
            else {
                // normal
                // Id-for-parent priorier to data-id.
                this.checkAndBindUI(el);
                // Only for element that is not delegated
                if (!el.widget && el.getAttribute("data-list")) {
                    var name_10 = el.getAttribute("data-list");
                    this.defineList(name_10, el);
                }
            }
            this.attachDynamicProperty(el, dynamics);
            this.syncDynamicProperties(el);
            // Whatever it is, we initialize and sync the properties on it
            return el;
        };
        WidgetCore.prototype.detachElement = function (el) {
            if (!el)
                return;
            this.detachDynamicProperty(el);
        };
        ;
        WidgetCore.prototype.attachText = function (text, config) {
            for (var _i = 0, _a = config.templates; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.type !== "value")
                    continue;
                this.widget.ViewModel.events.listenBy(text, ["change/" + item.content, "depChange/" + item.content], this.syncDynamicText.bind(this, text, config));
            }
            this.syncDynamicText(text, config);
        };
        WidgetCore.prototype.detachText = function (text) {
            this.widget.ViewModel.events.stopListenBy(text);
        };
        // Should ignore `data-` properties
        WidgetCore.prototype.extractDynamicPropertyConfig = function (el) {
            var properties = {};
            for (var i = 0; i < el.attributes.length; i++) {
                var attr = el.attributes[i];
                var configs = Leaf.CoreLogic.createDynamicValueConfigs(attr.value);
                if (configs && configs.length > 0) {
                    el.removeAttribute(attr.name);
                    properties[attr.name] = {
                        name: attr.name,
                        templates: configs
                    };
                }
            }
            return properties;
        };
        WidgetCore.prototype.getExistDynamicProperty = function (el) {
            for (var _i = 0, _a = el.propertyConfigs || []; _i < _a.length; _i++) {
                var props = _a[_i];
                if (props.master === this.widget)
                    return props.rules;
            }
            return null;
        };
        WidgetCore.prototype.syncDynamicProperties = function (el) {
            var props = {};
            for (var _i = 0, _a = el.propertyConfigs || []; _i < _a.length; _i++) {
                var config = _a[_i];
                var vm = config.master.ViewModel;
                for (var name_11 in config.rules) {
                    var rule = config.rules[name_11];
                    var value = Leaf.CoreLogic.explainDynamicString(vm, rule);
                    if (!props[name_11])
                        props[name_11] = [];
                    props[name_11].push(value);
                }
            }
            var result = {};
            for (var name_12 in props) {
                if (props[name_12].length > 1 && Leaf.CoreLogic.isPropertyMergable(name_12)) {
                    result[name_12] = Leaf.CoreLogic.mergeProperty(name_12, props[name_12]);
                }
                else {
                    result[name_12] = props[name_12].pop();
                }
            }
            for (var name_13 in result) {
                var value = result[name_13];
                if (value !== el.getAttribute(name_13)) {
                    el.setAttribute(name_13, value);
                }
            }
        };
        WidgetCore.prototype.syncDynamicProperty = function (el, propertyName) {
            var values = [];
            for (var _i = 0, _a = el.propertyConfigs; _i < _a.length; _i++) {
                var config = _a[_i];
                for (var name_14 in config.rules) {
                    if (name_14 === propertyName) {
                        values.push(Leaf.CoreLogic.explainDynamicString(config.master.ViewModel, config.rules[name_14]));
                    }
                }
            }
            var value = Leaf.CoreLogic.mergeProperty(propertyName, values);
            if (value.toString() != el.getAttribute(propertyName).toString()) {
                el.setAttribute(propertyName, value);
            }
        };
        WidgetCore.prototype.syncDynamicText = function (text, rule) {
            var _this = this;
            // Should add pollyfill for IE8/7
            // https://developer.mozilla.org/en/docs/Web/API/Node/textContent
            var value = text.textContent;
            var strs = rule.templates.map(function (t) {
                return _this.explain(t);
            });
            var result = strs.join("");
            if (result !== value) {
                text.textContent = result;
            }
        };
        WidgetCore.prototype.explain = function (config) {
            return Leaf.CoreLogic.explainDynamicValue(this.widget.ViewModel, config);
        };
        WidgetCore.prototype.checkAndUnbindUI = function (el) {
            var id = Leaf.Util.slugToCamel(el.getAttribute("data-id"));
            if (id && this.widget.UI[id] === el) {
                this.unbindUI(id);
            }
        };
        WidgetCore.prototype.checkAndBindUI = function (el) {
            var id = Leaf.Util.slugToCamel(el.getAttribute("data-id"));
            if (id) {
                this.bindUI(el, id);
            }
        };
        WidgetCore.prototype.bindUI = function (node, id) {
            if (this.widget.UI[id] === node)
                return;
            this.unbindUI(id);
            this.widget.UI[id] = node;
            this.widget.delegates.applyUIDelegateOwner(id);
        };
        WidgetCore.prototype.unbindUI = function (id) {
            this.widget.delegates.clearUIDelegateOwner(id);
            delete this.widget.UI[id];
        };
        WidgetCore.prototype.defineSubWidget = function (name, el, dynamics, slots) {
            // I've considered using widget.subWidget[name], but after
            // consider twice, I think directly assign subWidget to widget
            // is a better practice and name collision should be minimum.
            var _this = this;
            // First set this element to it
            this.subWidgetPlaceholder[name] = {
                holder: el,
                dynamics: dynamics,
                slots: slots
            };
            Leaf.Property.define(this.widget, name, {
                set: function (value, cache) {
                    if (value instanceof Leaf.Widget || !value) {
                        // First assignment do nothing, it's likely the placeholder <widget>
                        _this.setSubWidget(name, value);
                        cache.value = value;
                    }
                }
            });
        };
        WidgetCore.prototype.setSubWidget = function (name, widget) {
            // 0. detach old
            // 1. sync properties
            // 2. bindUI
            // 3. replace element
            // replace
            var oldWidget = this.widget[name];
            var replaceTarget;
            var replaceSrc;
            if (oldWidget && oldWidget.node && oldWidget.node.parentElement) {
                replaceTarget = oldWidget.node;
            }
            else {
                replaceTarget = this.subWidgetPlaceholder[name].holder;
            }
            if (widget && widget.node) {
                replaceSrc = widget.node;
            }
            else {
                replaceSrc = this.subWidgetPlaceholder[name].holder;
            }
            if (replaceSrc !== replaceTarget) {
                replaceTarget.parentElement.replaceChild(replaceSrc, replaceTarget);
            }
            // detach old
            if (oldWidget) {
                this.detachElement(oldWidget.node);
                this.checkAndUnbindUI(oldWidget.node);
            }
            if (widget) {
                // transfer static property to it
                // transfer dynamic property to it and bind UI
                var holder = this.subWidgetPlaceholder[name];
                this.transferProperties(widget.node, holder.dynamics);
                this.attachElement(widget.node, null);
                widget.core.fillSlots(this.subWidgetPlaceholder[name].slots);
            }
        };
        WidgetCore.prototype.attachDynamicProperty = function (el, dynamics) {
            if (!el.propertyConfigs)
                el.propertyConfigs = [];
            //console.log("attach", dynamics, el.propertyConfigs)
            var todo = [];
            this.widget.ViewModel.events.stopListenBy(el);
            if (dynamics) {
                el.propertyConfigs.push({ master: this.widget, rules: dynamics });
            }
            for (var _i = 0, _a = el.propertyConfigs; _i < _a.length; _i++) {
                var config = _a[_i];
                // already attached
                if (config.master === this.widget) {
                    todo.push(config.rules);
                }
            }
            if (todo.length > 1) {
                console.warn("Multiple dynamic attaches");
                console.trace();
            }
            for (var _b = 0, todo_1 = todo; _b < todo_1.length; _b++) {
                var dynamics_1 = todo_1[_b];
                for (var name_15 in dynamics_1) {
                    var config = dynamics_1[name_15];
                    for (var _c = 0, _d = config.templates; _c < _d.length; _c++) {
                        var part = _d[_c];
                        if (part.type === "raw")
                            continue;
                        this.widget.ViewModel.events.listenBy(el, ["change/" + part.content, "depChange/" + part.content], this.syncDynamicProperty.bind(this, el, name_15));
                    }
                }
            }
        };
        WidgetCore.prototype.detachDynamicProperty = function (el) {
            var _this = this;
            // Detach and remove properties
            if (!el)
                return;
            if (!el.propertyConfigs)
                el.propertyConfigs = [];
            el.propertyConfigs = el.propertyConfigs.filter(function (item) { return item.master !== _this.widget; });
            this.widget.ViewModel.events.stopListenBy(el);
        };
        WidgetCore.prototype.attachDynamicText = function (text, rule) {
            for (var _i = 0, _a = rule.templates; _i < _a.length; _i++) {
                var part = _a[_i];
                if (part.type === "raw")
                    continue;
                this.widget.ViewModel.events.listenBy(text, ["change/" + part.content, "depChange/" + part.content], this.syncDynamicText.bind(this, text, rule));
            }
        };
        WidgetCore.prototype.detachDynamicText = function (text) {
            this.widget.ViewModel.events.stopListenBy(text);
        };
        WidgetCore.prototype.extractTemplates = function (node) {
            var result = {};
            var templates = node.querySelectorAll("template");
            for (var i = 0; i < templates.length; i++) {
                var item = templates[i];
                if (node.contains(item)) {
                    item.parentElement.removeChild(item);
                    var name_16 = item.getAttribute("data-name");
                    if (name_16) {
                        result[name_16] = item.innerHTML;
                    }
                }
            }
            return result;
        };
        WidgetCore.prototype.defineSlot = function (name, el, dynamics) {
            // refactor slot implementation and abstract it to the same
            // way as subwidget.
            this.slotsPlaceholder[name] = {
                el: el,
                name: name,
                index: this.slotIndexOffset++,
                dynamics: dynamics
            };
        };
        WidgetCore.prototype.fillSlots = function (slots) {
            for (var i = 0; i < slots.length; i++) {
                var slot = slots[i];
                var holder = this.getSlotHolder(slot.name, i);
                if (holder) {
                    holder.el.parentElement.replaceChild(slot.el, holder.el);
                    holder.el = slot.el;
                    this.transferProperties(slot.el, holder.dynamics);
                    this.bindUI(slot.el, holder.name);
                }
            }
        };
        WidgetCore.prototype.extractDynamicStringConfig = function (content) {
            var config = Leaf.CoreLogic.createDynamicValueConfigs(content);
            return {
                templates: config
            };
        };
        WidgetCore.prototype.mergeProps = function (from, to, props) {
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var prop = props_1[_i];
                var toPropValue = to.getAttribute(prop);
                var fromPropValue = from.getAttribute(prop);
                if (fromPropValue !== toPropValue) {
                    if (Leaf.CoreLogic.isPropertyMergable(prop)) {
                        to.setAttribute(prop, Leaf.CoreLogic.mergeProperty(prop, [fromPropValue, toPropValue]));
                    }
                    else {
                        to.setAttribute(prop, fromPropValue);
                    }
                }
            }
        };
        WidgetCore.prototype.transferProperties = function (to, dynamics) {
            var _this = this;
            if (!to.propertyConfigs)
                to.propertyConfigs = [];
            to.propertyConfigs = to.propertyConfigs.filter(function (item) { return item.master !== _this.widget; });
            dynamics = Leaf.Util.clone(dynamics);
            this.attachDynamicProperty(to, dynamics);
            this.syncDynamicProperties(to);
        };
        WidgetCore.prototype.defineList = function (name, el) {
            var _this = this;
            var list = this.widget[name] = Leaf.Widget.makeList(el);
            var events = ["child/add", "child/remove"];
            var _loop_2 = function (event_2) {
                var camelEventName = event_2.replace(/\/[a-z]/ig, function (match) {
                    return match[1].toUpperCase();
                });
                var handlerName = "on" + Leaf.Util.capitalize(camelEventName) + Leaf.Util.capitalize(name);
                Leaf.Property.define(this_2.widget, handlerName, {
                    set: function (value, cache) {
                        if (cache.value) {
                            _this.widget[name].events.removeEventListener(event_2, cache.value);
                        }
                        if (value) {
                            cache.value = function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                value.apply(_this.widget, args);
                            };
                            _this.widget[name].events.on(event_2, cache.value);
                        }
                        else {
                            cache.value = null;
                        }
                    }
                });
                if (this_2.widget[handlerName]) {
                    this_2.widget[handlerName] = this_2.widget[handlerName];
                }
            };
            var this_2 = this;
            for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
                var event_2 = events_1[_i];
                _loop_2(event_2);
            }
            list.events.listenBy(this, "child/remove", function (child) {
                child.events.stopListenBy(_this);
            });
        };
        WidgetCore.prototype.getPropsFromElement = function (el) {
            var result = {};
            var attrs = el.attributes;
            for (var i = 0; i < attrs.length; i++) {
                var item = attrs[i];
                result[item.name] = item.value;
            }
            return result;
        };
        WidgetCore.prototype.getChildrenAsSlot = function (el) {
            var slots = [];
            if (el.childNodes.length === 1 && el.childNodes[0] instanceof Text) {
                var result = document.createElement("span");
                result.appendChild(el.childNodes[0]);
                return [{
                        el: result,
                        name: "slot0"
                    }];
            }
            for (var i = 0; i < el.children.length; i++) {
                var item = el.children[i];
                var name_17 = item.getAttribute("data-slot") || "slot" + i;
                slots.push({ name: name_17, el: item });
            }
            return slots;
        };
        WidgetCore.prototype.getSlotHolder = function (name, index) {
            for (var s in this.slotsPlaceholder) {
                var item = this.slotsPlaceholder[s];
                if (item.name === name)
                    return item;
                if (item.index === index)
                    return item;
            }
            return null;
        };
        return WidgetCore;
    }(WidgetCoreDesign));
    Leaf.WidgetCore = WidgetCore;
    var WidgetInitializer = /** @class */ (function (_super) {
        __extends(WidgetInitializer, _super);
        function WidgetInitializer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WidgetInitializer.prototype.initTemplate = function (template) {
            if (!template) {
                template = document.createElement("div");
            }
            // All kind of template
            if (typeof template === "string") {
                var tempNode = document.createElement("div");
                tempNode.innerHTML = template.trim();
                this.widget.node = tempNode.children[0];
                tempNode.removeChild(this.widget.node);
            }
            else if (template instanceof Element) {
                this.widget.node = template;
            }
            else if (typeof template === "function") {
                return this.initTemplate(template());
            }
            if (!this.widget.node) {
                console.error("Invalid Widget.node constructed with template", template);
                throw new Error("BrokenWidgetTemplate");
            }
            //if (this.widget.node.getAttribute("data-id")) {
            //    console.error("Shouldn't bind data-id on root of the any widget you can always refer to them as `node`. `data-id` may latter be assigned by parent widget.");
            //    throw new Error("Invalid data id assignment")
            //}
            if (this.widget.node.nodeType === this.widget.node.TEXT_NODE)
                return;
            this.widget.templates = this.widget.core.extractTemplates(this.widget.node);
            this.traverseAndInitialize(this.widget.node);
            this.widget.core.bindUI(this.widget.node, "node");
            this.widget.node.widget = this.widget;
        };
        WidgetInitializer.prototype.traverseAndInitialize = function (node) {
            if (node instanceof HTMLElement) {
                for (var i = 0; i < node.childNodes.length; i++) {
                    var item = node.childNodes[i];
                    this.traverseAndInitialize(item);
                }
                var config = this.widget.core.extractDynamicPropertyConfig(node);
                this.widget.core.attachElement(node, config);
            }
            else if (node instanceof Text) {
                var config = this.widget.core.extractDynamicStringConfig(node.textContent);
                this.widget.core.attachText(node, config);
            }
        };
        WidgetInitializer.prototype.createElement = function (tagName, properties, children) {
            var el = document.createElement(tagName);
            var frag = document.createDocumentFragment();
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child = children_1[_i];
                frag.appendChild(child);
            }
            var dynamics = {};
            for (var name_18 in properties) {
                var v = properties[name_18];
                if (typeof v === "string") {
                    el.setAttribute(name_18, v);
                    el[name_18] = v;
                }
                else {
                    dynamics[name_18] = v;
                    el.setAttribute(name_18, Leaf.CoreLogic.explainDynamicString(this.widget.ViewModel, v));
                }
            }
            el.appendChild(frag);
            el = this.widget.core.attachElement(el, dynamics);
            return el;
        };
        WidgetInitializer.prototype.createText = function (rule) {
            var text = document.createTextNode("");
            this.widget.core.attachText(text, rule);
            return text;
        };
        return WidgetInitializer;
    }(WidgetInitializerDesign));
    Leaf.WidgetInitializer = WidgetInitializer;
    var WidgetDOMEventDelegator = /** @class */ (function () {
        function WidgetDOMEventDelegator(widget) {
            this.widget = widget;
            this.lazyHandlers = {};
        }
        WidgetDOMEventDelegator.prototype.prepareUIDelegates = function (uiName) {
            if (this.lazyHandlers[uiName])
                return;
            this.lazyHandlers[uiName] = {};
            var events = Leaf.CoreLogic.AllEvents.slice(0);
            var ui = this.widget.UI[uiName];
            if (ui.widget && ui.widget.providingEvents && ui.widget.providingEvents.length > 0) {
                events = events.concat(ui.widget.providingEvents);
            }
            for (var _i = 0, events_2 = events; _i < events_2.length; _i++) {
                var event_3 = events_2[_i];
                this.prepareUIDelegate(uiName, event_3.name);
            }
        };
        WidgetDOMEventDelegator.prototype.prepareUIDelegate = function (uiName, eventName) {
            var _this = this;
            if (this.lazyHandlers[uiName][eventName])
                return;
            this.lazyHandlers[uiName][eventName] = {};
            var handlerName = "on" + Leaf.Util.capitalize(eventName) + Leaf.Util.capitalize(uiName);
            Leaf.Property.define(this.widget, handlerName, {
                set: function (v, cache) {
                    if (typeof v != "function")
                        return;
                    cache.value = v;
                    _this.unbindLazyHandler(uiName, eventName);
                    _this.provideLazyHandler(uiName, eventName, v);
                    _this.bindLazyHandler(uiName, eventName);
                }
            });
            // only set handler, dont' unbind or bind it.
            // apply/clear delegate will do it.
            if (this.widget[handlerName]) {
                this.provideLazyHandler(uiName, eventName, this.widget[handlerName]);
            }
            // for onClick => onClickNode
            if (uiName === "node") {
                var handlerName_1 = "on" + Leaf.Util.capitalize(eventName);
                Leaf.Property.define(this, handlerName_1, {
                    set: function (v, cache) {
                        if (typeof v != "function")
                            return;
                        cache.value = v;
                        _this.unbindLazyHandler(uiName, eventName);
                        _this.provideLazyHandler(uiName, eventName, v);
                        _this.bindLazyHandler(uiName, eventName);
                    }
                });
                if (this.widget[handlerName_1]) {
                    this.provideLazyHandler(uiName, eventName, this.widget[handlerName_1]);
                }
            }
        };
        // call unbind/bind/provide carefully, or just don't call them.
        WidgetDOMEventDelegator.prototype.unbindLazyHandler = function (uiName, eventName) {
            var owner = this.widget.UI[uiName];
            var info = this.lazyHandlers[uiName][eventName] || {};
            if (info.handler) {
                owner.removeEventListener(eventName, info.handler);
            }
        };
        WidgetDOMEventDelegator.prototype.bindLazyHandler = function (uiName, eventName) {
            var owner = this.widget.UI[uiName];
            var info = this.lazyHandlers[uiName][eventName] || {};
            if (info.handler) {
                owner.addEventListener(eventName, info.handler);
            }
        };
        WidgetDOMEventDelegator.prototype.provideLazyHandler = function (uiName, eventName, v) {
            var _this = this;
            var handler = function (e) {
                e.capture = function () {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                };
                v.call(_this.widget, e);
            };
            this.lazyHandlers[uiName][eventName].handler = handler;
        };
        WidgetDOMEventDelegator.prototype.clearUIDelegateOwner = function (id) {
            if (!this.widget.UI[id])
                return;
            var owner = this.widget.UI[id];
            var infos = this.lazyHandlers[id] || {};
            for (var eventName in infos) {
                var info = infos[eventName];
                if (info.handler) {
                    owner.removeEventListener(eventName, info.handler);
                }
            }
        };
        // Carefull call apply UI delegate owner
        // 1. call clear
        // 2. set UI[uiName]
        // 3. call apply
        // Always call them like above.
        // But feel free to call `clear` at any time.
        WidgetDOMEventDelegator.prototype.applyUIDelegateOwner = function (id) {
            if (!this.widget.UI[id])
                return;
            var owner = this.widget.UI[id];
            this.prepareUIDelegates(id);
            var infos = this.lazyHandlers[id];
            // bind any existing events
            for (var eventName in infos) {
                var info = infos[eventName];
                if (info.handler) {
                    owner.addEventListener(eventName, info.handler);
                }
            }
        };
        WidgetDOMEventDelegator.prototype.delegateTo = function (name, event) {
            var fnName = "on" + Leaf.Util.capitalize(event.type) + Leaf.Util.capitalize(name);
            var fn = this.widget[fnName];
            if (!fn) {
                return true;
            }
            return fn.call(this.widget, event);
        };
        return WidgetDOMEventDelegator;
    }());
    Leaf.WidgetDOMEventDelegator = WidgetDOMEventDelegator;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts" />
var Leaf;
(function (Leaf) {
    var Widget = /** @class */ (function () {
        function Widget(template, name, _VMFields) {
            if (_VMFields === void 0) { _VMFields = []; }
            var _this = this;
            this.template = template;
            this._VMFields = _VMFields;
            // Use global namespace by default
            this.namespace = Widget.namespace;
            // If direct parent widget that contains this widget
            this.parent = null;
            // By default every widget has a event emitter
            this.events = new Leaf.EventEmitter();
            // All element with data-id
            this.UI = {};
            // Custom DOM events that this widget may trigger
            this.providingEvents = [];
            // Event that we should delegate (bubble or not)
            this.interestingUnbubblingEvents = Leaf.CoreLogic.UnbubbleEvents.slice(0);
            this.interestingBubblingEvents = Leaf.CoreLogic.BubbleEvents.slice(0);
            this.core = new Leaf.WidgetCore(this);
            this.delegates = new Leaf.WidgetDOMEventDelegator(this);
            this.initializer = new Leaf.WidgetInitializer(this);
            if (name) {
                this.widgetName = this.widgetName || (this.constructor.name) || "AnonymouseWidget";
            }
            // Setup ViewModals
            if (!this._VMFields) {
                this._VMFields = [];
            }
            this.ViewModel = new Leaf.ViewModel(this.widgetName, this._VMFields);
            Leaf.Property.define(this, "VM", {
                get: function () {
                    return _this.ViewModel.data;
                },
                set: function (values) {
                    return _this.ViewModel.sets(values);
                }
            });
            // If we don't have a template, dont initialize it
            // Maybe we are generated widget, or maybe we gonna do it latter.
            this.initializer.initTemplate(template);
            Widget.events.emit("create", this);
        }
        // Set custom template for this module
        Widget.setTemplate = function (template) {
            this.prototype.template = template;
        };
        Widget.prototype.toString = function () {
            return "<Widget " + this.widgetName + ">";
        };
        Widget.prototype.before = function (who) {
            var node;
            if (who instanceof Widget) {
                node = who.node;
            }
            else {
                node = who;
            }
            if (!node.parentElement)
                return false;
            node.parentElement.insertBefore(this.node, node);
            return true;
        };
        Widget.prototype.after = function (who) {
            var node;
            if (who instanceof Widget) {
                node = who.node;
            }
            else {
                node = who;
            }
            if (!node.parentElement)
                return false;
            if (node.nextSibling) {
                node.parentElement.insertBefore(this.node, node.nextSibling);
            }
            else {
                node.parentElement.appendChild(this.node);
            }
            return true;
        };
        Widget.prototype.prependTo = function (who) {
            var node;
            if (who instanceof Widget) {
                node = who.node;
            }
            else {
                node = who;
            }
            if (node.children.length === 0) {
                node.appendChild(this.node);
            }
            else {
                var first = node.children[0];
                node.insertBefore(this.node, first);
            }
            return true;
        };
        Widget.prototype.appendTo = function (who) {
            var node;
            if (who instanceof Widget) {
                node = who.node;
            }
            else {
                node = who;
            }
            node.appendChild(this.node);
            return true;
        };
        Widget.makeList = function (el) {
            return new Leaf.List(el);
        };
        Widget.prototype.emitDOMEvent = function (name, bubble, props) {
            if (props === void 0) { props = {}; }
            var valid = this.providingEvents.some(function (info) {
                return info.name === name;
            });
            if (!valid) {
                throw new Error("Should add events " + name + "to available events at construtor");
            }
            var e = new CustomEvent(name, {
                bubbles: bubble,
                cancelable: true
            });
            for (var prop in props) {
                e[prop] = props[prop];
            }
            this.node.dispatchEvent(e);
        };
        Widget.prototype.emitWidgetEvent = function (name, value) {
            if (value === void 0) { value = {}; }
            this.events.emit(name, value);
            this.emitDOMEvent(name, false, value);
        };
        Widget.prototype.include = function (W) {
            this.namespace.include(W);
        };
        Widget.prototype.expose = function (name, remoteName) {
            var _this = this;
            if (!remoteName) {
                remoteName = name;
            }
            if (typeof this[name] === "function") {
                Object.defineProperty(this.node, remoteName, {
                    get: function () {
                        return _this[name].bind(_this);
                    }
                });
                return;
            }
            var cap = Leaf.Util.capitalize(name);
            var getterName = "onGet" + cap;
            var setterName = "onSet" + cap;
            Object.defineProperty(this.node, remoteName, {
                get: function () {
                    if (_this[getterName])
                        return _this[getterName]();
                    else
                        return _this[name];
                },
                set: function (value) {
                    if (_this[setterName])
                        return _this[setterName](value);
                    else
                        return _this[name];
                }
            });
        };
        Widget.prototype.makeList = function (who) {
            var _this = this;
            var el;
            var name;
            if (typeof who === "string") {
                el = this.UI[who];
                name = who;
            }
            else {
                for (var prop in this.UI) {
                    if (this.UI[prop] === who) {
                        el = who;
                        name = prop;
                        break;
                    }
                }
                if (!name) {
                    return;
                }
            }
            var list = Leaf.Widget.makeList(el);
            list.events.listenBy(this, "child/add", function (item) {
                var fn = _this["onChildAdd" + Leaf.Util.capitalize(name)];
                if (fn) {
                    fn.call(_this, item);
                }
            });
            list.events.listenBy(this, "child/remove", function (item) {
                var fn = _this["onChildRemove" + Leaf.Util.capitalize(name)];
                if (fn) {
                    fn.call(_this, item);
                }
            });
            if (!this[name]) {
                this[name] = list;
            }
            return list;
        };
        // Global namespace
        Widget.namespace = new Leaf.Namespace();
        Widget.events = new Leaf.EventEmitter();
        return Widget;
    }());
    Leaf.Widget = Widget;
    var GeneratedWidget = /** @class */ (function (_super) {
        __extends(GeneratedWidget, _super);
        function GeneratedWidget(generator, name, _VMFields) {
            if (_VMFields === void 0) { _VMFields = []; }
            var _this = _super.call(this, null, name, _VMFields) || this;
            _this.generator = generator;
            _this._VMFields = _VMFields;
            _this.BindedWidgets = [];
            _this.BindedLists = [];
            _this.TestDatas = [];
            _this.InitialData = null;
            _this.initGeneratedTemplate(generator.call(_this));
            return _this;
        }
        GeneratedWidget.prototype.initGeneratedTemplate = function (node) {
            this.node = node;
            this.core.bindUI(this.node, "node");
            if (!this.node.widget) {
                // in case it's a shared node by it's child
                // the child will own it
                this.node.widget = this;
            }
        };
        GeneratedWidget.prototype._e = function (tagName, properties, children) {
            return this.initializer.createElement(tagName, properties, children);
        };
        GeneratedWidget.prototype._t = function (rule) {
            return this.initializer.createText(rule);
        };
        GeneratedWidget.prototype.renderRecursive = function (data, R) {
            if (data === void 0) { data = {}; }
            if (R === void 0) { R = this["R"] || {}; }
            for (var _i = 0, _a = this.BindedWidgets; _i < _a.length; _i++) {
                var widget = _a[_i];
                if (!this[widget.name]) {
                    var Cons = this.resolveWidgetByPath(R, widget.path);
                    if (!Cons) {
                        console.error("Invalid constructor", widget.path);
                        continue;
                    }
                    this[widget.name] = new Cons();
                }
                if (data[widget.name] && this[widget.name]["renderRecursive"]) {
                    this[widget.name]["renderRecursive"](data[widget.name]);
                }
            }
            for (var _b = 0, _c = this.BindedLists; _b < _c.length; _b++) {
                var list = _c[_b];
                if (this[list.name] && data[list.name] instanceof Array) {
                    var Cons = this.resolveWidgetByPath(R, list.reference);
                    if (!Cons)
                        continue;
                    for (var _d = 0, _f = data[list.name]; _d < _f.length; _d++) {
                        var sub = _f[_d];
                        var child = new Cons();
                        this[list.name].push(child);
                        if (child["renderRecursive"]) {
                            child["renderRecursive"](sub);
                        }
                        else {
                            child.VM = sub;
                        }
                    }
                }
            }
            for (var _g = 0, _h = this._VMFields; _g < _h.length; _g++) {
                var name_19 = _h[_g];
                if (data[name_19]) {
                    this.VM[name_19] = data[name_19];
                }
            }
        };
        GeneratedWidget.prototype.resolveWidgetByPath = function (R, path) {
            if (!path)
                return null;
            var routes = path.split("/").filter(function (item) { return item; });
            var cur = R;
            for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
                var route = routes_1[_i];
                route = Leaf.Util.capitalize(route);
                if (!cur[route])
                    return null;
                cur = cur[route];
            }
            return cur;
        };
        return GeneratedWidget;
    }(Widget));
    Leaf.GeneratedWidget = GeneratedWidget;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts" />
/// <reference path="widget.ts" />
var Leaf;
(function (Leaf) {
    var List = /** @class */ (function (_super) {
        __extends(List, _super);
        function List(el) {
            var _this = _super.call(this, el, "List") || this;
            _this._length = 0;
            _this.length = 0;
            var arrayFnsNames = ["map", "forEach", "slice", "every", "some", "filter"];
            var _loop_3 = function (name_20) {
                this_3[name_20] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var arr = _this.toArray();
                    return arr[name_20].apply(arr, args);
                };
            };
            var this_3 = this;
            for (var _i = 0, arrayFnsNames_1 = arrayFnsNames; _i < arrayFnsNames_1.length; _i++) {
                var name_20 = arrayFnsNames_1[_i];
                _loop_3(name_20);
            }
            Object.defineProperty(_this, "length", {
                get: function () {
                    return _this._length;
                },
                set: function (v) {
                    var toRemove = [];
                    if (v > _this._length) {
                        throw new Error("can't asign length larger than the orig");
                    }
                    if (typeof v != "number") {
                        throw new TypeError();
                    }
                    for (var i = v; i < _this._length; i++) {
                        toRemove.push(_this[i]);
                        delete _this[i];
                    }
                    _this._length = v;
                    for (var _i = 0, toRemove_1 = toRemove; _i < toRemove_1.length; _i++) {
                        var item = toRemove_1[_i];
                        _this.detach(item);
                    }
                }
            });
            _this._length = 0;
            return _this;
        }
        List.prototype.fill = function (datas, Cons) {
            this.length = 0;
            for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
                var item = datas_1[_i];
                var widget = new Cons(item);
                for (var _a = 0, _b = widget._VMFields; _a < _b.length; _a++) {
                    var name_21 = _b[_a];
                    if (typeof item[name_21] !== "undefined") {
                        widget.VM[name_21] = item[name_21];
                    }
                }
                widget.ListItemData = item;
                this.push(widget);
            }
        };
        List.prototype.empty = function () {
            var toRemove = [];
            for (var i = 0; i < this._length; i++) {
                toRemove.push(this[i]);
                delete this[i];
            }
            for (var _i = 0, toRemove_2 = toRemove; _i < toRemove_2.length; _i++) {
                var item = toRemove_2[_i];
                this.detach(item);
            }
            this._length = 0;
        };
        List.prototype.indexOf = function (item) {
            for (var i = 0; i < this._length; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        };
        List.prototype.check = function (item) {
            if (!(item instanceof Leaf.Widget)) {
                throw new Error("List expect item to be Widget");
            }
            for (var i = 0; i < this._length; i++) {
                if (this[i] === item) {
                    throw new Error("Duplicate ListItem");
                }
            }
            return true;
        };
        List.prototype.push = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            for (var _a = 0, items_1 = items; _a < items_1.length; _a++) {
                var item = items_1[_a];
                this.check(item);
                this[this._length] = item;
                if (this._length != 0) {
                    item.after(this[this._length - 1]);
                }
                else {
                    item.appendTo(this.node);
                }
                this._length += 1;
                this.attach(item);
            }
        };
        List.prototype.pop = function () {
            if (this._length === 0)
                return null;
            this._length -= 1;
            var item = this[this._length];
            delete this[this._length];
            return item;
        };
        List.prototype.unshift = function (item) {
            this.check(item);
            if (this._length === 0) {
                item.prependTo(this.node);
                this[0] = item;
                this._length = 1;
                this.attach(item);
                return;
            }
            for (var index = this._length; index > 0; index -= 1) {
                this[index] = this[index - 1];
            }
            this[0] = item;
            this._length += 1;
            item.before(this[1]);
            this.attach(item);
            return this._length;
        };
        List.prototype.shift = function () {
            var result = this[0];
            for (var index = 0; index < this._length; index++) {
                this[index] = this[index + 1];
            }
            this.length -= 1;
            this.detach(result);
            return result;
        };
        List.prototype.splice = function (index, count) {
            var _this = this;
            var toAdd = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                toAdd[_i - 2] = arguments[_i];
            }
            var result = [];
            var toRemoves = [];
            if (typeof count != "number" || index + count > this._length) {
                count === this._length - index;
            }
            for (var i = 0; i < count; i++) {
                var item = this[index + i];
                toRemoves.push(item);
                result.push(item);
            }
            var toAddFinal = toAdd;
            var frag = document.createDocumentFragment();
            toAddFinal.forEach(function (item) {
                _this.check(item);
                frag.appendChild(item.node);
            });
            if (index < this._length && this._length > 0) {
                this.node.insertBefore(frag, this[index].node);
            }
            else {
                this.node.appendChild(frag);
            }
            // make a hole
            var increase = toAddFinal.length - count;
            if (increase < 0) {
                for (var origin = index + count; origin < this._length; origin++) {
                    this[origin + increase] = this[origin];
                }
            }
            else if (increase > 0) {
                for (var origin = this._length - 1; origin > index + count - 1; origin--) {
                    this[origin + increase] = this[origin];
                }
            }
            // fill the hole
            for (var offset = 0; offset < toAddFinal.length; offset++) {
                var item = toAddFinal[offset];
                this[index + offset] = item;
            }
            this._length += increase;
            for (var _a = 0, toRemoves_1 = toRemoves; _a < toRemoves_1.length; _a++) {
                var item = toRemoves_1[_a];
                this.detach(item);
            }
            for (var _b = 0, toAddFinal_1 = toAddFinal; _b < toAddFinal_1.length; _b++) {
                var item = toAddFinal_1[_b];
                this.attach(item);
            }
            return result;
        };
        List.prototype.removeItem = function (item) {
            var index = this.indexOf(item);
            if (index < 0)
                return;
            this.splice(index, 1);
            return item;
        };
        List.prototype.attach = function (item) {
            item["parentList"] = this;
            this.events.emit("child/add", item);
            this.events.emit("child/change");
        };
        List.prototype.detach = function (item) {
            item["parentList"] = null;
            var node = item.node;
            if (node && node.parentElement === this.node) {
                this.node.removeChild(node);
            }
            this.events.emit("child/remove", item);
            this.events.emit("child/change");
        };
        List.prototype.toArray = function () {
            var result = [];
            for (var i = 0; i < this._length; i++) {
                result.push(this[i]);
            }
            return result;
        };
        return List;
    }(Leaf.Widget));
    Leaf.List = List;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts" />
var Leaf;
(function (Leaf) {
    Leaf.RPCErrors = Leaf.ErrorDoc.create()
        .define("APINotExists")
        .define("Timeout")
        .define("Conflict")
        .define("BrokenConnection")
        .generate();
    var RPCComposer = /** @class */ (function () {
        function RPCComposer(option) {
            if (option === void 0) { option = {}; }
            this.option = option;
            this.declares = {};
            this.requestOffset = 10000;
            this.methods = {};
            this.remoteEvents = new Leaf.EventEmitter();
            this.responseHandlers = [];
            if (!(typeof this.option.defaultTimeout === "number")) {
                this.option.defaultTimeout = 0;
            }
        }
        RPCComposer.prototype.allocateId = function () { return this.requestOffset++; };
        RPCComposer.prototype.setConnection = function (con) {
            var _this = this;
            this.connection = con;
            this.connection.events.listenBy(this, "message", function (message) {
                _this.handleMessage(message);
            });
            this.connection.events.listenBy(this, "close", function () {
                _this.unsetConnection();
            });
        };
        RPCComposer.prototype.unsetConnection = function () {
            if (!this.connection)
                return;
            this.connection.events.stopListenBy(this);
            this.connection = null;
        };
        RPCComposer.prototype.revokeRPCMethod = function (name) {
            delete this.methods[name];
        };
        RPCComposer.prototype.registerRPCMethod = function (name, handler) {
            if (this.methods[name]) {
                throw new Leaf.RPCErrors.Conflict("RPC Method \"" + name + "\" already exists");
            }
            this.methods[name] = handler;
        };
        RPCComposer.prototype.createRPCDeclare = function (option) {
            var api = new RPCDeclare(this, option);
            this.declares[option.name] = api;
            return api;
        };
        RPCComposer.prototype.createRPCInvokeInterface = function (option) {
            var api = this.createRPCDeclare(option);
            this[option.name] = api;
            return api.getFunction();
        };
        RPCComposer.prototype.emitRemoteEvent = function (name, data) {
            var blob = {
                name: name,
                data: data,
                type: RPCProtocolBlobType.EVENT
            };
            this.send(this.normalize(blob));
        };
        RPCComposer.prototype.invoke = function (name, data, callback, option) {
            var _this = this;
            if (option === void 0) { option = {}; }
            if (!callback) {
                callback = function () { };
            }
            if (!this.connection) {
                callback(new Leaf.RPCErrors.BrokenConnection("Connection not exists"));
                return;
            }
            var handler = {
                id: this.allocateId(),
                callback: callback,
                finished: false,
                timer: null
            };
            var timeout = option.timeout || this.option.defaultTimeout;
            if (timeout > 0) {
                handler.timer = setTimeout(function () {
                    if (!handler.finished) {
                        _this.finishHandler(handler.id, new Leaf.RPCErrors.Timeout("RPC timeout after " + _this.option.defaultTimeout));
                    }
                }, timeout);
            }
            this.responseHandlers.push(handler);
            var blob = {
                id: handler.id,
                method: name,
                data: data,
                type: RPCProtocolBlobType.INVOKE
            };
            this.send(this.normalize(blob));
        };
        RPCComposer.prototype.send = function (data) {
            if (typeof data !== "string") {
                data = JSON.stringify(data);
            }
            this.connection.send(data);
        };
        RPCComposer.prototype.handleMessage = function (rawString) {
            var data = null;
            try {
                var raw = JSON.parse(rawString);
                data = this.denormalize(raw);
            }
            catch (e) {
                return;
            }
            if (data.type === RPCProtocolBlobType.INVOKE) {
                this.handleInvoke(data);
            }
            else if (data.type === RPCProtocolBlobType.RESPONSE) {
                this.handleResponse(data);
            }
            else if (data.type === RPCProtocolBlobType.EVENT) {
                this.handleEvent(data);
            }
        };
        RPCComposer.prototype.handleInvoke = function (req) {
            var _this = this;
            var response = {
                id: req.id,
                type: RPCProtocolBlobType.RESPONSE
            };
            if (!this.methods[req.method]) {
                response.error = new Leaf.RPCErrors.APINotExists("Requesting API " + req.method + " not exists");
                this.send(this.normalize(response));
                return;
            }
            var call = this.methods[req.method];
            call(req.data, function (err, data) {
                response.error = err;
                response.data = data;
                _this.send(_this.normalize(response));
            });
        };
        RPCComposer.prototype.handleResponse = function (res) {
            this.finishHandler(res.id, res.error, res.data);
        };
        RPCComposer.prototype.handleEvent = function (event) {
            var _this = this;
            setTimeout(function () {
                _this.remoteEvents.emit(event.name, event.data);
                _this.remoteEvents.emit("*", event);
            }, 0);
        };
        RPCComposer.prototype.transformObject = function (data, handler) {
            var _this = this;
            if (typeof data !== "object") {
                return data;
            }
            if (data instanceof Array) {
                return data.map(function (item) { return _this.transformObject(item, handler); });
            }
            if (!data)
                return data;
            var norm = data;
            if (handler) {
                norm = handler(norm);
            }
            // changed by custom norm
            if (norm && norm !== data) {
                return norm;
            }
            for (var prop in data) {
                data[prop] = this.transformObject(data[prop], handler);
            }
            return data;
        };
        RPCComposer.prototype.normalize = function (data) {
            return this.transformObject(data, this.customNormalize);
        };
        RPCComposer.prototype.denormalize = function (data) {
            return this.transformObject(data, this.customDenormalize);
        };
        RPCComposer.prototype.finishHandler = function (id, err, value) {
            this.responseHandlers = this.responseHandlers.filter(function (handler) {
                if (handler.id === id) {
                    handler.finished = true;
                    if (handler.timer) {
                        clearTimeout(handler.timer);
                        handler.timer = null;
                    }
                    setTimeout(function () {
                        handler.callback(err, value);
                    }, 0);
                    return false;
                }
                return true;
            });
        };
        return RPCComposer;
    }());
    Leaf.RPCComposer = RPCComposer;
    var RPCDeclare = /** @class */ (function () {
        function RPCDeclare(center, option) {
            this.center = center;
            this.option = option;
        }
        RPCDeclare.prototype.getFunction = function () {
            var fn = this.invoke.bind(this);
            fn.RPC = this;
            return fn;
        };
        RPCDeclare.prototype.invoke = function (data, callback) {
            if (data === void 0) { data = {}; }
            this.center.invoke(this.option.name, data, callback, {
                timeout: this.option.timeout || 0
            });
        };
        return RPCDeclare;
    }());
    Leaf.RPCDeclare = RPCDeclare;
    var RPCConnectionBase = /** @class */ (function () {
        function RPCConnectionBase() {
            this.events = new Leaf.EventEmitter();
        }
        return RPCConnectionBase;
    }());
    Leaf.RPCConnectionBase = RPCConnectionBase;
    var RPCProtocolBlobType;
    (function (RPCProtocolBlobType) {
        RPCProtocolBlobType[RPCProtocolBlobType["INVOKE"] = 1] = "INVOKE";
        RPCProtocolBlobType[RPCProtocolBlobType["RESPONSE"] = 2] = "RESPONSE";
        RPCProtocolBlobType[RPCProtocolBlobType["EVENT"] = 3] = "EVENT";
    })(RPCProtocolBlobType = Leaf.RPCProtocolBlobType || (Leaf.RPCProtocolBlobType = {}));
    var RPCBrowserWebSocketConnection = /** @class */ (function (_super) {
        __extends(RPCBrowserWebSocketConnection, _super);
        function RPCBrowserWebSocketConnection(connection) {
            var _this = _super.call(this) || this;
            _this.connection = connection;
            _this.connection.addEventListener("message", function (msg) {
                _this.events.emit("message", msg.data);
            });
            _this.connection.addEventListener("close", function () {
                _this.events.emit("close");
            });
            return _this;
        }
        RPCBrowserWebSocketConnection.prototype.send = function (content) {
            this.connection.send(content);
        };
        return RPCBrowserWebSocketConnection;
    }(RPCConnectionBase));
    Leaf.RPCBrowserWebSocketConnection = RPCBrowserWebSocketConnection;
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts"/>
var Leaf;
(function (Leaf) {
    var CoreLogic;
    (function (CoreLogic) {
        function createDynamicValueConfigs(templateString) {
            var templates = [];
            var reg = /\{\{\s*!?([a-z]+(:[a-z\-]+)?)\s*\}\}/ig;
            var match;
            var lastIndex = 0;
            var hasValue = false;
            while (match = reg.exec(templateString)) {
                if (match.index > lastIndex) {
                    templates.push({
                        type: "raw",
                        content: templateString.slice(lastIndex, match.index)
                    });
                }
                var content = match[0].slice(2).slice(0, -2);
                if (!content)
                    continue;
                var _a = content.split(":").map(function (item) { return item.trim(); }), k = _a[0], v = _a[1];
                var reverse = false;
                if (k[0] == "!") {
                    k = k.slice(1);
                    reverse = true;
                }
                templates.push({
                    type: "value",
                    content: k,
                    value: v,
                    reverse: reverse
                });
                hasValue = true;
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < templateString.length) {
                templates.push({
                    type: "raw",
                    content: templateString.slice(lastIndex)
                });
            }
            return templates;
        }
        CoreLogic.createDynamicValueConfigs = createDynamicValueConfigs;
        CoreLogic.MergablePropertyNames = ["class"];
        function isPropertyMergable(name) {
            return CoreLogic.MergablePropertyNames.indexOf(name) >= 0;
        }
        CoreLogic.isPropertyMergable = isPropertyMergable;
        function mergeProperty(name, values) {
            if (name === "class") {
                var names = [];
                for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                    var value = values_1[_i];
                    var todos = value.split(" ").map(function (item) { return item.trim(); }).filter(function (item) { return !!item; });
                    for (var _a = 0, todos_1 = todos; _a < todos_1.length; _a++) {
                        name = todos_1[_a];
                        if (names.indexOf(name) < 0)
                            names.push(name);
                    }
                }
                return names.join(" ");
            }
            else {
                return values.join(" ");
            }
        }
        CoreLogic.mergeProperty = mergeProperty;
        CoreLogic.BubbleEvents = ["click", "mouseup", "mousedown", "mousemove", "mouseleave", "mouseenter", "mouseover", "keydown", "keyup", "keypress"].map(function (name) {
            return { name: name, bubble: true };
        });
        CoreLogic.UnbubbleEvents = [{
                name: "focus",
                bubble: false,
                target: ["input", "textarea"]
            }, {
                name: "blur",
                bubble: false,
                target: ["input", "textarea"]
            }, {
                name: "submit",
                bubble: false,
                target: ["form"]
            }, {
                name: "change",
                bubble: false,
                target: ["input", "textarea", "select"]
            }];
        CoreLogic.AllEvents = CoreLogic.BubbleEvents.concat(CoreLogic.UnbubbleEvents);
        function explainDynamicString(model, config) {
            var result = [];
            for (var _i = 0, _a = config.templates; _i < _a.length; _i++) {
                var item = _a[_i];
                result.push(explainDynamicValue(model, item));
            }
            return result.join("");
        }
        CoreLogic.explainDynamicString = explainDynamicString;
        function explainDynamicValue(model, config) {
            if (config.type === "raw") {
                return config.content;
            }
            else {
                var mayReverse = function (v) {
                    if (config.reverse)
                        return !v;
                    return v;
                };
                var vmValue = model.get(config.content);
                if (typeof vmValue === "function") {
                    vmValue = vmValue();
                }
                var value = config.value || null;
                // for {{class}} value as true, use name as className
                if (mayReverse(vmValue) === true) {
                    if (value) {
                        return value;
                    }
                    value = Leaf.Util.camelToSlug(config.content);
                    return value;
                }
                else if (mayReverse(vmValue) === false) {
                    return "";
                }
                if (mayReverse(vmValue) && value) {
                    return value;
                }
                return vmValue || "";
            }
        }
        CoreLogic.explainDynamicValue = explainDynamicValue;
    })(CoreLogic = Leaf.CoreLogic || (Leaf.CoreLogic = {}));
})(Leaf || (Leaf = {}));
/// <reference path="leaf.ts"/>
var Leaf;
(function (Leaf) {
    var Key;
    (function (Key) {
        Key["0"] = 48;
        Key["1"] = 49;
        Key["2"] = 50;
        Key["3"] = 51;
        Key["4"] = 52;
        Key["5"] = 53;
        Key["6"] = 54;
        Key["7"] = 55;
        Key["8"] = 56;
        Key["9"] = 57;
        Key.cmd = 224;
        var browser = Leaf.Util.browser;
        if (browser) {
            if (browser.name === "firefox") {
                Key.cmd = 224;
            }
            else if (browser.name === "opera") {
                Key.cmd = 17;
            }
            else {
                Key.cmd = 91;
            }
        }
        else {
            Key.cmd = 91;
        }
        Key.a = 65;
        Key.b = 66;
        Key.c = 67;
        Key.d = 68;
        Key.e = 69;
        Key.f = 70;
        Key.g = 71;
        Key.h = 72;
        Key.i = 73;
        Key.j = 74;
        Key.k = 75;
        Key.l = 76;
        Key.m = 77;
        Key.n = 78;
        Key.o = 79;
        Key.p = 80;
        Key.q = 81;
        Key.r = 82;
        Key.s = 83;
        Key.t = 84;
        Key.u = 85;
        Key.v = 86;
        Key.w = 87;
        Key.x = 88;
        Key.y = 89;
        Key.z = 90;
        Key.space = 32;
        Key.shift = 16;
        Key.ctrl = 17;
        Key.alt = 18;
        Key.left = 37;
        Key.up = 38;
        Key.right = 39;
        Key.down = 40;
        Key.enter = 13;
        Key.backspace = 8;
        Key.escape = 27;
        Key.del = 46;
        Key["delete"] = 46;
        Key.esc = 27;
        Key.pageup = 33;
        Key.pagedown = 34;
        Key.tab = 9;
        Key.home = 36;
        Key.end = 35;
        Key.quote = 222;
        Key.openBracket = 219;
        Key.closeBracket = 221;
        Key.backSlash = 220;
        Key.slash = 191;
        Key.equal = 187;
        Key.comma = 188;
        Key.period = 190;
        Key.dash = 189;
        Key.semiColon = 186;
        Key.graveAccent = 192;
    })(Key = Leaf.Key || (Leaf.Key = {}));
    var Mouse;
    (function (Mouse) {
        Mouse.left = 0;
        Mouse.middle = 1;
        Mouse.right = 2;
    })(Mouse = Leaf.Mouse || (Leaf.Mouse = {}));
})(Leaf || (Leaf = {}));
var Leaf;
(function (Leaf) {
    function ValidatorRule(obj, name, descriptor) {
        var fn = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var self = this;
            if (!self["current"]) {
                throw new Validator.Errors.RequireFieldSpecification();
            }
            var value = fn.apply(this, args);
            if (self.isReadonly)
                throw new Validator.Errors.Readonly("This validator can't be modified");
            var rules = self["current"]["rules"];
            for (var _a = 0, rules_1 = rules; _a < rules_1.length; _a++) {
                var rule = rules_1[_a];
                if (rule.type === value.type) {
                    // overwrite
                    for (var prop in value) {
                        if (typeof value[prop] !== "undefined") {
                            rule[prop] = value[prop];
                        }
                    }
                }
            }
            rules.push(value);
            return this;
        };
    }
    Leaf.ValidatorRule = ValidatorRule;
    var Validator = /** @class */ (function () {
        function Validator() {
            this.fields = {};
            this.current = null;
            this.isReadonly = false;
            this.checkers = [];
        }
        Validator.prototype.clone = function () {
            var v = new Validator();
            var fields = {};
            for (var name_22 in this.fields) {
                var info = this.fields[name_22];
                fields[name_22] = {
                    field: info.field,
                    rules: info.rules.map(function (item) {
                        var result = Leaf.Util.clone(item);
                        result.error = item.error;
                        return result;
                    })
                };
            }
            v.fields = fields;
            return v;
        };
        Validator.prototype.readonly = function () {
            this.isReadonly = true;
            return this;
        };
        Validator.prototype.field = function (name) {
            if (this.fields[name]) {
                this.current = this.fields[name];
            }
            else {
                this.current = this.fields[name] = {
                    field: name,
                    rules: []
                };
            }
            return this;
        };
        Validator.prototype.string = function () {
            return {
                type: "string"
            };
        };
        Validator.prototype.number = function () {
            return {
                type: "number"
            };
        };
        Validator.prototype.int = function () {
            return {
                type: "int"
            };
        };
        Validator.prototype.exists = function () {
            return {
                type: "exists"
            };
        };
        Validator.prototype.gt = function (v) {
            return {
                type: "gt",
                limit: v
            };
        };
        Validator.prototype.lt = function (v) {
            return {
                type: "lt",
                limit: v
            };
        };
        Validator.prototype.match = function (reg) {
            return {
                type: "match",
                match: reg
            };
        };
        Validator.prototype.is = function (value) {
            return {
                type: "is",
                value: value
            };
        };
        Validator.prototype.custom = function (validate) {
            return {
                type: "custom",
                validate: validate
            };
        };
        Validator.prototype.in = function (arr) {
            return {
                type: "in",
                array: arr
            };
        };
        Validator.prototype.annotation = function (data) {
            return {
                type: "annotation",
                data: data
            };
        };
        //public isNumber() {
        //}
        //public isDate() {
        //}
        //public match() {
        //}
        //public longerThan(length: string) {
        //}
        //public shorterThan(length: string) {
        //}
        //public dateAfter(name: string, date: Date) {
        //    throw new Error("Not implemented")
        //}
        //public dateBefore(name: string, data: Date) {
        //    throw new Error("Not implemented")
        //}
        //public noExtraField() {
        //}
        Validator.prototype.error = function (error) {
            var last = this.current.rules[this.current.rules.length - 1];
            if (last) {
                last.error = error;
            }
            else {
                this.current.error = error;
            }
            return this;
        };
        Validator.prototype.check = function (obj) {
            if (!obj) {
                throw new Validator.Errors.Empty();
            }
            for (var name_23 in this.fields) {
                var field = this.fields[name_23];
                for (var _i = 0, _a = field.rules; _i < _a.length; _i++) {
                    var rule = _a[_i];
                    this.checkRule(field, rule, obj, name_23, obj[name_23]);
                }
            }
            return this;
        };
        Validator.prototype.isNone = function (a) {
            return typeof a === "undefined" || a === null;
        };
        Validator.prototype.checkRule = function (field, rule, obj, name, value) {
            if (rule.type === "custom" && rule["validate"](obj, name, value))
                return;
            if (rule.type !== "exists" && this.isNone(value) || rule.type === "exists" && !this.isNone(value))
                return;
            if (rule.type === "string") {
                if (typeof value === "string") {
                    return;
                }
            }
            else if (rule.type === "number") {
                if (typeof value === "number") {
                    return;
                }
            }
            else if (rule.type === "int") {
                if (typeof value === "number" && Math.floor(value) === value) {
                    return;
                }
            }
            else if (rule.type === "gt") {
                if (typeof value === "number" && value > rule["limit"]) {
                    return;
                }
                else if (typeof value === "string" && value.length > rule["limit"]) {
                    return;
                }
            }
            else if (rule.type === "lt") {
                if (this.isNone(value))
                    return;
                if (typeof value === "number" && value < rule["limit"]) {
                    return;
                }
                else if (typeof value === "string" && value.length < rule["limit"]) {
                    return;
                }
            }
            else if (rule.type === "is") {
                return value === rule["value"];
            }
            else if (rule.type === "match") {
                if (rule["match"].test(value)) {
                    return;
                }
            }
            else if (rule.type === "in") {
                if (rule["array"].indexOf(value) >= 0) {
                    return;
                }
            }
            else if (rule.type === "annotation") {
                return;
            }
            if (rule["annotation"])
                return;
            for (var _i = 0, _a = this.checkers; _i < _a.length; _i++) {
                var checker = _a[_i];
                if (checker(field, rule, obj, name, value)) {
                    return;
                }
            }
            if (rule.error) {
                throw rule.error;
            }
            else if (field.error) {
                throw field.error;
            }
            else {
                throw new Error("Invalid parameter:" + name);
            }
        };
        Validator.prototype.explain = function () {
            for (var field in this.fields) {
                var info = this.fields[field];
                console.log("${Field}: ");
            }
            return this;
        };
        __decorate([
            ValidatorRule,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", Object)
        ], Validator.prototype, "string", null);
        __decorate([
            ValidatorRule,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", Object)
        ], Validator.prototype, "number", null);
        __decorate([
            ValidatorRule,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", Object)
        ], Validator.prototype, "int", null);
        __decorate([
            ValidatorRule,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", Object)
        ], Validator.prototype, "exists", null);
        __decorate([
            ValidatorRule,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Number]),
            __metadata("design:returntype", Object)
        ], Validator.prototype, "gt", null);
        __decorate([
            ValidatorRule,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Number]),
            __metadata("design:returntype", Object)
        ], Validator.prototype, "lt", null);
        __decorate([
            ValidatorRule,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [RegExp]),
            __metadata("design:returntype", Object)
        ], Validator.prototype, "match", null);
        __decorate([
            ValidatorRule,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", Object)
        ], Validator.prototype, "is", null);
        __decorate([
            ValidatorRule,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Function]),
            __metadata("design:returntype", Object)
        ], Validator.prototype, "custom", null);
        __decorate([
            ValidatorRule,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Array]),
            __metadata("design:returntype", Object)
        ], Validator.prototype, "in", null);
        __decorate([
            ValidatorRule,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", Object)
        ], Validator.prototype, "annotation", null);
        return Validator;
    }());
    Leaf.Validator = Validator;
    Leaf.DataDefinition = Validator;
    (function (Validator) {
        Validator.Errors = Leaf.ErrorDoc.create()
            .define("DuplicateRule")
            .define("RequireFieldSpecification")
            .define("Empty")
            .define("Readonly")
            .generate();
        function create() {
            return new Validator();
        }
        Validator.create = create;
    })(Validator = Leaf.Validator || (Leaf.Validator = {}));
})(Leaf || (Leaf = {}));
var Leaf;
(function (Leaf) {
    var ServiceStateModel = /** @class */ (function (_super) {
        __extends(ServiceStateModel, _super);
        function ServiceStateModel(service, fields) {
            if (fields === void 0) { fields = []; }
            return _super.call(this, service.name, fields) || this;
        }
        return ServiceStateModel;
    }(Leaf.DataSource));
    Leaf.ServiceStateModel = ServiceStateModel;
    var Service = /** @class */ (function () {
        function Service() {
            this.isInitialized = false;
            this.dependencies = [];
            this.events = new Leaf.EventEmitter();
            this.apiNames = [];
            this.api = [];
        }
        Service.prototype.initialize = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.bindAPINames();
            this.stateModel = new ServiceStateModel(this, Object.keys(this.states || {}));
            this.stateModel.id = "ServiceStateModel-" + this.name;
            var states = this.states;
            Leaf.Property.define(this, "states", {
                get: function () {
                    return _this.stateModel.data;
                },
                set: function (v) {
                    if (!v)
                        return;
                    return _this.stateModel.sets(v);
                }
            });
            this.states = states;
        };
        Service.prototype.connect = function (delegator) {
            var _this = this;
            this.bindAPINames();
            var _loop_4 = function (name_24) {
                this_4[name_24] = function (o, callback) {
                    delegator.invoke(_this.name + "/" + name_24, o, callback);
                };
            };
            var this_4 = this;
            for (var _i = 0, _a = this.apiNames; _i < _a.length; _i++) {
                var name_24 = _a[_i];
                _loop_4(name_24);
            }
        };
        Service.prototype.bindAPINames = function () {
            this.apiNames.length = 0;
            for (var prop in this) {
                if (typeof this[prop] !== "function")
                    continue;
                var v = this[prop];
                if (v.tag !== "api")
                    continue;
                v.api = prop;
                this.apiNames.push(prop);
            }
        };
        Service.prototype.createAPI = function (handler) {
            if (handler === void 0) { handler = (function () { }); }
            var withDefaultCallback = (function (o, c) {
                if (c === void 0) { c = function () { }; }
                return handler(o, c);
            });
            withDefaultCallback.tag = "api";
            return withDefaultCallback;
        };
        return Service;
    }());
    Leaf.Service = Service;
    var DependencyManager = /** @class */ (function () {
        function DependencyManager() {
            this.context = {};
            this.onAddDymanicDependency = function (name) { };
        }
        DependencyManager.prototype.add = function (name, deps) {
            if (this.context[name])
                throw new Error("Duplicate dependency entry: " + name);
            if (deps && deps.length == 0)
                deps = null;
            this.context[name] = deps;
        };
        DependencyManager.prototype.resolveDependency = function (name, chain) {
            if (chain === void 0) { chain = []; }
            if (typeof this.context[name] === "undefined") {
                this.onAddDymanicDependency(name);
                if (typeof this.context[name] === "undefined") {
                    throw new Error(name + " required by " + chain[chain.length - 1] + " couldn't be fullfilled.");
                }
            }
            if (this.context[name] === null)
                return [];
            chain = chain.slice();
            if (chain.indexOf(name) >= 0) {
                chain.push(name);
                throw new Error("Recursive dependency detected: " + chain.join("\n=>"));
            }
            chain.push(name);
            var result = [];
            var all = [];
            for (var _i = 0, _a = this.context[name] || []; _i < _a.length; _i++) {
                var matcher = _a[_i];
                if (typeof matcher === "string") {
                    if (all.indexOf(matcher) < 0)
                        all.push(matcher);
                }
                else if (matcher instanceof RegExp) {
                    for (var name_25 in this.context) {
                        if (matcher.test(name_25) && all.indexOf(name_25) < 0) {
                            all.push(name_25);
                        }
                    }
                }
            }
            for (var _b = 0, all_1 = all; _b < all_1.length; _b++) {
                var dep = all_1[_b];
                var deps = this.resolveDependency(dep, chain);
                for (var _c = 0, deps_1 = deps; _c < deps_1.length; _c++) {
                    var subDep = deps_1[_c];
                    if (result.indexOf(subDep) < 0)
                        result.push(subDep);
                }
                result.push(dep);
            }
            return result;
        };
        DependencyManager.prototype.resolve = function () {
            var result = [];
            for (var name_26 in this.context) {
                var deps = this.resolveDependency(name_26);
                for (var _i = 0, deps_2 = deps; _i < deps_2.length; _i++) {
                    var dep = deps_2[_i];
                    if (result.indexOf(dep) < 0)
                        result.push(dep);
                }
                if (result.indexOf(name_26) < 0)
                    result.push(name_26);
            }
            return result;
        };
        return DependencyManager;
    }());
    Leaf.DependencyManager = DependencyManager;
    var ServiceSetupProcedure = /** @class */ (function (_super) {
        __extends(ServiceSetupProcedure, _super);
        function ServiceSetupProcedure(services, setupSequence) {
            var _this = _super.call(this) || this;
            _this.services = services;
            _this.setupSequence = setupSequence;
            _this.data = {};
            return _this;
        }
        ServiceSetupProcedure.prototype.setup = function (callback) {
            if (!this.data.dones)
                this.data.dones = [];
            if (this.state === "finish") {
                callback(null);
                return;
            }
            this.data.dones.push(callback);
            if (this.state === "void") {
                this.setState("prepare");
            }
        };
        ServiceSetupProcedure.prototype.atPrepare = function () {
            this.data.todo = this.setupSequence.slice();
            this.setState("setup");
        };
        ServiceSetupProcedure.prototype.atSetup = function () {
            var _this = this;
            var name = this.data.todo.shift();
            if (!name) {
                this.setState("finish");
                return;
            }
            var service = this.services[name];
            if (!service) {
                this.error(new Error("Fail to find service name " + name));
                return;
            }
            if (service.isInitialized) {
                this.setState("setup");
                return;
            }
            service.services = this.services;
            console.debug("Service " + service.name + " Initializing");
            if (service.initialize) {
                if (service.initialize.length == 1) {
                    service.initialize(function (err) {
                        if (err) {
                            _this.error(err);
                            return;
                        }
                        service.isInitialized = true;
                        _this.logInitialized(name);
                        _this.setState("setup");
                    });
                }
                else {
                    service.initialize();
                    service.isInitialized = true;
                    this.logInitialized(name);
                    this.setState("setup");
                }
            }
            else {
                // this service don't need initialization
                service.isInitialized = true;
                this.logInitialized(name);
                this.setState("setup");
            }
        };
        ServiceSetupProcedure.prototype.atFinish = function () {
            for (var _i = 0, _a = this.data.dones; _i < _a.length; _i++) {
                var cb = _a[_i];
                cb();
            }
        };
        ServiceSetupProcedure.prototype.atPanic = function () {
            for (var _i = 0, _a = this.data.dones; _i < _a.length; _i++) {
                var cb = _a[_i];
                cb(this.panicError);
            }
        };
        ServiceSetupProcedure.prototype.logInitialized = function (name) {
            console.debug("Service " + name + " initialized");
        };
        return ServiceSetupProcedure;
    }(Leaf.States));
    Leaf.ServiceSetupProcedure = ServiceSetupProcedure;
    var ServiceContext = /** @class */ (function () {
        function ServiceContext(settings) {
            if (settings === void 0) { settings = {}; }
            var _this = this;
            this.settings = settings;
            this.BuiltInServiceInstances = {};
            this.services = {};
            this.dependencyManager = new DependencyManager;
            // When dependency not met but we have that dependency in our built-in service
            this.dependencyManager.onAddDymanicDependency = function (name) {
                var s = _this.BuiltInServiceInstances[name];
                if (s) {
                    if (s["asBuiltIn"]) {
                        s["asBuiltIn"];
                    }
                    _this.register(s);
                }
            };
        }
        ServiceContext.prototype.register = function (s) {
            this.dependencyManager.add(s.name, s.dependencies || null);
            this.services[s.name] = s;
            return s;
        };
        ServiceContext.prototype.setup = function (callback) {
            if (!this.procedure) {
                this.procedure = new ServiceSetupProcedure(this.services, this.dependencyManager.resolve());
            }
            this.procedure.setup(callback);
        };
        return ServiceContext;
    }());
    Leaf.ServiceContext = ServiceContext;
})(Leaf || (Leaf = {}));
var Leaf;
(function (Leaf) {
    var Background;
    (function (Background) {
        var ChannelBackgroundEnd = /** @class */ (function () {
            function ChannelBackgroundEnd() {
            }
            return ChannelBackgroundEnd;
        }());
        Background.ChannelBackgroundEnd = ChannelBackgroundEnd;
        var BackgroundLayer = /** @class */ (function () {
            // preventing inconsistant background/foreground code.
            function BackgroundLayer(version) {
                if (version === void 0) { version = "0"; }
                this.version = version;
            }
            return BackgroundLayer;
        }());
        Background.BackgroundLayer = BackgroundLayer;
    })(Background = Leaf.Background || (Leaf.Background = {}));
})(Leaf || (Leaf = {}));
var Leaf;
(function (Leaf) {
    var Foreground;
    (function (Foreground) {
        var ChannelForegroundEnd = /** @class */ (function () {
            function ChannelForegroundEnd() {
            }
            return ChannelForegroundEnd;
        }());
        Foreground.ChannelForegroundEnd = ChannelForegroundEnd;
        var ChannelForegroundLayer = /** @class */ (function () {
            function ChannelForegroundLayer(version) {
                if (version === void 0) { version = "0"; }
                this.version = version;
                this.rpc = new Leaf.RPCComposer();
                this.invokeBackgroundServiceAPI = this.rpc.createRPCInvokeInterface({ name: "invokeBackgroundServiceAPI" });
                this.connectBackgroundLayer = this.rpc.createRPCInvokeInterface({
                    name: "connectBackgroundLayer"
                });
            }
            return ChannelForegroundLayer;
        }());
        Foreground.ChannelForegroundLayer = ChannelForegroundLayer;
    })(Foreground = Leaf.Foreground || (Leaf.Foreground = {}));
})(Leaf || (Leaf = {}));
var Leaf;
(function (Leaf) {
    var Application = /** @class */ (function () {
        function Application() {
            this.foregroundInitialize = function () { };
            this.backgroundInitialize = function () { };
            this.serviceContext = new Leaf.ServiceContext;
        }
        Application.prototype.initialize = function () {
            var _this = this;
            this.serviceContext.setup(function () {
                _this.foregroundInitialize();
            });
        };
        Application.prototype.implements = function (lifecircle) {
            for (var prop in lifecircle) {
                this[prop] = lifecircle[prop];
            }
        };
        return Application;
    }());
    Leaf.Application = Application;
})(Leaf || (Leaf = {}));
/// <reference path="types.ts"/>
/// <reference path="property.ts" />
/// <reference path="util.ts" />
/// <reference path="render.ts" />
/// <reference path="events.ts" />
/// <reference path="states.ts" />
/// <reference path="errors.ts" />
/// <reference path="apiFactory.ts" />
/// <reference path="history.ts" />
/// <reference path="model.ts" />
/// <reference path="namespace.ts" />
/// <reference path="viewModel.ts" />
/// <reference path="widgetBase.ts" />
/// <reference path="widget.ts" />
/// <reference path="list.ts" />
/// <reference path="rpcCenter.ts" />
/// <reference path="coreLogic.ts"/>
/// <reference path="etc.ts"/>
/// <reference path="validator.ts"/>
/// <reference path="service.ts"/>
/// <reference path="background.ts"/>
/// <reference path="foreground.ts"/>
/// <reference path="application.ts"/>
var Leaf;
(function (Leaf) {
    if (typeof module != "undefined") {
        module.exports = Leaf;
    }
    else {
        window["Leaf"] = Leaf;
    }
})(Leaf || (Leaf = {}));
//# sourceMappingURL=leaf.js.map