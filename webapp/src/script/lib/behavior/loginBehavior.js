"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loadingBehavior_1 = require("./loadingBehavior");
var LoginBehavior = /** @class */ (function () {
    function LoginBehavior(widget) {
        var _this = this;
        this.widget = widget;
        this.events = new Leaf.EventEmitter();
        this.asLoading = this.widget.asLoading || new loadingBehavior_1.LoadingBehavior(this.widget);
        this.i18n = {
            InvalidLoginOrPassword: "Invalid login or password."
        };
        this.Errors = Leaf.ErrorDoc.create()
            .define("InvalidUsernameOrEmail")
            .define("InvalidPassword")
            .define("InvalidLoginOrPassword")
            .generate();
        this.validator = Leaf.Validator.create()
            .field("login").error(new this.Errors.InvalidUsernameOrEmail).string().exists().gt(1)
            .field("password").error(new this.Errors.InvalidPassword).string().exists().gt(1)
            .readonly();
        this.widget.onClickLoginButton = function () {
            _this.login();
        };
    }
    LoginBehavior.prototype.getOption = function () {
        var password = this.widget.UI.loginPasswordInput.value.trim();
        var login = this.widget.UI.loginInput.value.trim();
        var option = { password: password, login: login };
        return option;
    };
    LoginBehavior.prototype.check = function () {
        var option = this.getOption();
        try {
            this.validator.check(option);
        }
        catch (e) {
            this.widget.VM.error = true;
            this.widget.VM.errorText = this.i18n.InvalidLoginOrPassword;
            return null;
        }
        this.widget.VM.error = false;
        this.widget.VM.errorText = "";
        return option;
    };
    LoginBehavior.prototype.getOptionIfValid = function () {
        return this.check();
    };
    LoginBehavior.prototype.login = function () {
        var _this = this;
        if (this.asLoading.isLoading)
            return;
        var option = this.getOptionIfValid();
        if (!option)
            return false;
        this.asLoading.start();
        this.handleLogin(option, function (err) {
            _this.asLoading.finish();
            if (err) {
                _this.widget.VM.error = true;
                _this.widget.VM.errorText = err.message;
                return;
            }
            _this.events.emit("authorized");
        });
    };
    LoginBehavior.prototype.reset = function () {
        this.widget.UI.loginInput.value = "";
        this.widget.UI.loginPasswordInput.value = "";
        this.widget.VM.error = false;
        this.widget.VM.errorText = "";
        this.asLoading.reset();
    };
    return LoginBehavior;
}());
exports.LoginBehavior = LoginBehavior;
