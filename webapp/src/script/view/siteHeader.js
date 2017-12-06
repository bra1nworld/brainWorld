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
var app_1 = require("../app");
var SiteHeader = /** @class */ (function (_super) {
    __extends(SiteHeader, _super);
    function SiteHeader() {
        var _this = _super.call(this) || this;
        app_1.App.api.getEnvironmentInformation({}, function (err, user) {
            _this.VM.userName = user.username;
        });
        return _this;
    }
    SiteHeader.prototype.onClickLogout = function () {
        if (window.confirm("确定退出？")) {
            app_1.App.api.logout({}, function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                window.location.reload();
            });
        }
    };
    return SiteHeader;
}(R.SiteHeader));
exports.SiteHeader = SiteHeader;
