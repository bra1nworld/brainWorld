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
var Authenticator = /** @class */ (function (_super) {
    __extends(Authenticator, _super);
    function Authenticator() {
        var _this = _super.call(this) || this;
        _this.UI.passwordInput.onkeyup = function (e) {
            var theEvent = e || window.event;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                _this.login();
            }
        };
        return _this;
    }
    Authenticator.prototype.onClickLogin = function () {
        this.login();
    };
    Authenticator.prototype.login = function () {
        var option = {
            username: this.UI.loginInput.value.trim(),
            password: this.UI.passwordInput.value.trim()
        };
        app_1.App.api.login(option, function (err, user) {
            if (user) {
                // if (!user.available && user.username !== "admin" && user.password !== "admin") {
                //     alert("该账号已被冻结，请联系管理员。")
                //     return
                // }
                window.location.reload();
            }
            else {
                console.error(err);
                alert("账号或密码错误");
            }
        });
    };
    return Authenticator;
}(R.Authenticator));
exports.Authenticator = Authenticator;
