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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("../component/history");
var urlModule = require("../component/url");
var RouteService = /** @class */ (function (_super) {
    __extends(RouteService, _super);
    function RouteService() {
        var _this = _super.call(this) || this;
        _this.name = "RouteService";
        _this.routes = [];
        _this.states = null;
        _this.history = new history_1.History();
        _this.events = new Leaf.EventEmitter();
        _this.history.events.listenBy(_this, "goto", function (url) {
            _this.handle(url);
        });
        return _this;
    }
    RouteService.prototype.route = function (route, callback) {
        this.routes.push({
            matcher: this.genRouteMatcher(route),
            callback: callback
        });
    };
    RouteService.prototype.goto = function (url, silent) {
        if (silent === void 0) { silent = false; }
        this.history.goto(url, silent);
    };
    RouteService.prototype.parseQuery = function (query) {
        if (query[0] === "?") {
            query = query.substring(1);
        }
        var kvs = {};
        query.split("&").forEach(function (item) {
            if (!item)
                return;
            var kv = item.split("=");
            kvs[kv[0]] = kv[1];
        });
        return kvs;
    };
    RouteService.prototype.parsePath = function (matcher, url) {
        var match = url.match(matcher.reg);
        var kv = {};
        if (!match)
            return;
        matcher.keywords.forEach(function (key, index) {
            kv[key] = match[index + 1];
        });
        return kv;
    };
    RouteService.prototype.genRouteMatcher = function (url) {
        var paramReg = /(:[^\/]+)|(\*.+)/ig;
        var lastIndex = 0;
        var regStr = "^";
        var keywords = [];
        while (true) {
            var result = paramReg.exec(url);
            if (!result)
                break;
            regStr += url.substring(lastIndex, result.index);
            if (result[0][0] === ":") {
                regStr += "([^/]*)";
                keywords.push(result[0].replace(":", ""));
            }
            else if (result[0][0] === "*") {
                regStr += "(.*)";
                keywords.push(result[0].replace("*", ""));
            }
            lastIndex = result.index + result[0].length;
        }
        regStr += url.substring(lastIndex);
        if (regStr[regStr.length - 1] === "/") {
            regStr = regStr.slice(-1);
        }
        regStr += "/?";
        regStr += "$";
        return { reg: new RegExp(regStr), keywords: keywords, source: url };
    };
    RouteService.prototype.handle = function (url) {
        var _this = this;
        var urlObject = urlModule.parse(url);
        var path = urlObject.pathname;
        var found = this.routes.some(function (route) {
            if (route.matcher.reg.test(path)) {
                var params = _this.parsePath(route.matcher, path);
                var query_1 = {};
                (urlObject.query || "").split("&").map(function (item) { return item.split("="); }).forEach(function (kvp) {
                    query_1[kvp[0]] = kvp[1];
                });
                route.callback(__assign({}, query_1, params));
                return true;
            }
        });
        if (!found) {
            this.events.emit("unhandledUrl", url);
        }
    };
    RouteService.prototype.getRouteParameter = function (url) {
        var _this = this;
        if (!url)
            url = window.location.toString();
        var result = null;
        var urlObject = urlModule.parse(url);
        var path = urlObject.pathname;
        this.routes.some(function (route) {
            if (route.matcher.reg.test(path)) {
                var params = _this.parsePath(route.matcher, path);
                result = (params);
                return true;
            }
        });
        return result;
    };
    return RouteService;
}(Leaf.Service));
exports.RouteService = RouteService;
