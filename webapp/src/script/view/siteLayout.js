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
var siteHeader_1 = require("./siteHeader");
var siteSider_1 = require("./siteSider");
var SiteLayout = /** @class */ (function (_super) {
    __extends(SiteLayout, _super);
    function SiteLayout(user) {
        var _this = _super.call(this) || this;
        _this.siteHeader = new siteHeader_1.SiteHeader();
        var privilege;
        switch (user.role) {
            case "worker":
                privilege = {
                    myAnnotatingTask: true,
                    myAnnotatedTask: true,
                };
                break;
            case "checker":
                privilege = {
                    myCheckingTask: true,
                    myCheckedTask: true,
                };
                break;
            case "admin":
                privilege = {
                    pendingTask: true,
                    annotatingTask: true,
                    checkAnnotatedTask: true,
                    doneTask: true,
                    userManagement: true
                };
                break;
        }
        if (user.id == "admin") {
            privilege = {
                pendingTask: true,
                annotatingTask: true,
                checkAnnotatedTask: true,
                doneTask: true,
                myAnnotatingTask: true,
                myAnnotatedTask: true,
                myCheckingTask: true,
                myCheckedTask: true,
                userManagement: true
            };
        }
        _this.siteSider = new siteSider_1.SiteSider(privilege);
        return _this;
    }
    SiteLayout.prototype.hide = function (hidden) {
        if (hidden === void 0) { hidden = true; }
        this.VM.hidden = hidden;
    };
    SiteLayout.prototype.visit = function (node) {
        if (this.UI.siteContent.childNodes[0]) {
            this.UI.siteContent.removeChild(this.UI.siteContent.childNodes[0]);
        }
        this.UI.siteContent.appendChild(node);
    };
    return SiteLayout;
}(R.SiteLayout));
exports.SiteLayout = SiteLayout;
