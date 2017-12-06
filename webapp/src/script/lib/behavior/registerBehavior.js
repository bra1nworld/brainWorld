"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loadingBehavior_1 = require("./loadingBehavior");
var RegisterBehavior = /** @class */ (function () {
    function RegisterBehavior(widget) {
        var _this = this;
        this.widget = widget;
        this.events = new Leaf.EventEmitter();
        this.asLoading = this.widget.asLoading || new loadingBehavior_1.LoadingBehavior(this.widget);
        this.i18n = {
            InvalidUsername: "Invalid username.",
            InvalidPassword: "Invalid Password.",
            InvalidEmail: "Invalid email address.",
            PasswordMismatch: "Confirm password mismatch",
        };
        this.Errors = Leaf.ErrorDoc.create()
            .define("InvalidUsername")
            .define("InvalidEmail")
            .define("InvalidPassword")
            .define("PasswordMismatch")
            .generate();
        this.validator = Leaf.Validator.create()
            .field("username").error(new this.Errors.InvalidUsername(this.i18n.InvalidUsername)).string().exists().gt(2).lt(257)
            .field("password").error(new this.Errors.InvalidPassword(this.i18n.InvalidPassword)).string().exists().gt(1)
            .field("email").error(new this.Errors.InvalidEmail(this.i18n.InvalidUsername)).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            .readonly();
        this.widget.onClickRegisterButton = function () {
            _this.register();
        };
    }
    RegisterBehavior.prototype.getOption = function () {
        var password = this.widget.UI.registerPasswordInput.value.trim();
        var username = this.widget.UI.registerUsernameInput.value.trim();
        var email = this.widget.UI.registerEmailInput.value.trim();
        var option = { password: password, username: username, email: email };
        return option;
    };
    RegisterBehavior.prototype.getOptionIfValid = function () {
        var option = this.getOption();
        try {
            this.validator.check(option);
            if (this.widget.UI.registerPasswordInput.value !== this.widget.UI.registerPasswordConfirmInput.value) {
                throw new this.Errors.PasswordMismatch(this.i18n.PasswordMismatch);
            }
        }
        catch (e) {
            this.widget.VM.error = true;
            this.widget.VM.errorText = e.message;
            return null;
        }
        this.widget.VM.error = false;
        this.widget.VM.errorText = "";
        return option;
    };
    RegisterBehavior.prototype.register = function () {
        var _this = this;
        if (this.asLoading.isLoading)
            return;
        var option = this.getOptionIfValid();
        if (!option)
            return false;
        this.asLoading.start();
        this.handleRegister(option, function (err) {
            _this.asLoading.finish();
            if (err) {
                _this.widget.VM.error = true;
                _this.widget.VM.errorText = err.message;
                return;
            }
            _this.events.emit("authorized");
        });
    };
    RegisterBehavior.prototype.reset = function () {
        this.widget.UI.registerEmailInput.value = "";
        this.widget.UI.registerPasswordInput.value = "";
        this.widget.UI.registerPasswordConfirmInput.value = "";
        this.widget.UI.registerUsernameInput.value = "";
        this.widget.VM.error = false;
        this.widget.VM.errorText = "";
        this.asLoading.reset();
    };
    return RegisterBehavior;
}());
exports.RegisterBehavior = RegisterBehavior;
