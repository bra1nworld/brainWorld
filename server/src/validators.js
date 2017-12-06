"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var Decorator;
(function (Decorator) {
    function OptionMatch(validator, error) {
        return function (obj, name, descriptor) {
            var fn = descriptor.value;
            descriptor.value = function (option, callback) {
                try {
                    validator.check(option);
                }
                catch (e) {
                    callback(error || e);
                    return;
                }
                fn.call(this, option, callback);
            };
        };
    }
    Decorator.OptionMatch = OptionMatch;
})(Decorator = exports.Decorator || (exports.Decorator = {}));
var RouteValidator;
(function (RouteValidator) {
    function hasLogin(obj, name, descriptor) {
        var fn = descriptor.value;
        descriptor.value = function (option, callback) {
            if (!this.info || !this.info.user) {
                this.error(new errors_1.Errors.Forbidden);
                return;
            }
            fn.call(this);
        };
    }
    RouteValidator.hasLogin = hasLogin;
    function pathOwnerOnly(obj, name, descriptor) {
        var fn = descriptor.value;
        descriptor.value = function (option, callback) {
            if (!this.info || !this.info.user) {
                this.error(new errors_1.Errors.Forbidden);
                return;
            }
            var user = this.info.user;
            fn.call(this);
        };
    }
    RouteValidator.pathOwnerOnly = pathOwnerOnly;
})(RouteValidator = exports.RouteValidator || (exports.RouteValidator = {}));
//# sourceMappingURL=validators.js.map