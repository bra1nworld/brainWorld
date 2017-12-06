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
var BrowserHashService = /** @class */ (function (_super) {
    __extends(BrowserHashService, _super);
    function BrowserHashService() {
        var _this = _super.call(this) || this;
        _this.name = "BrowserHashService";
        _this.states = null;
        _this.hashes = {};
        return _this;
    }
    BrowserHashService.prototype.set = function (k, v) {
        this.hashes[k] = v;
        this.sync();
    };
    BrowserHashService.prototype.unset = function (k) {
        delete this.hashes[k];
        this.sync();
    };
    BrowserHashService.prototype.sync = function () {
        var kvs = [];
        for (var name_1 in this.hashes) {
            kvs.push(name_1 + "=" + this.hashes[name_1]);
        }
        window.location.hash = kvs.join("&");
    };
    BrowserHashService.prototype.syncFromHash = function (hash) {
        var _this = this;
        if (!hash) {
            window.location.hash = "";
            return;
        }
        var hashStr;
        if (hash.indexOf("#") == 0) {
            hashStr = hash.substr(1);
        }
        else {
            hashStr = hash;
        }
        window.location.hash = hashStr;
        var kvs = hashStr.split("&");
        kvs.forEach(function (kv) {
            var kvArr = kv.split("=");
            _this.hashes[kvArr[0]] = kvArr[1];
        });
        console.log(this.hashes);
    };
    BrowserHashService.prototype.has = function (key) {
        return this.hashes.hasOwnProperty(key);
    };
    BrowserHashService.prototype.get = function (key) {
        if (!this.has(key)) {
            return;
        }
        return this.hashes[key];
    };
    return BrowserHashService;
}(Leaf.Service));
exports.BrowserHashService = BrowserHashService;
exports.browserHashService = new BrowserHashService();
