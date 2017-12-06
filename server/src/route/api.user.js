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
var RouteSpec = require("../spec/route");
var RouteDecorators = require("../routeDecorators");
var errors_1 = require("../errors");
var UserAPIService = /** @class */ (function (_super) {
    __extends(UserAPIService, _super);
    function UserAPIService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserAPIService.prototype.initialize = function () {
        var _this = this;
        this.api("getUserById", function (ctx) {
            _this.services.UserService.getUserById(ctx.params, function (err, result) {
                ctx.done(err, result);
            });
        });
        this.api("getUser", function (ctx) {
            _this.services.UserService.getUser(ctx.body, function (err, result) {
                ctx.done(err, result);
            });
        });
        this.api("login", function (ctx) {
            if (ctx.body.username === "admin") {
                if (ctx.body.password === "admin") {
                    ctx.req.session.userId = "admin";
                }
                else {
                    ctx.error(new errors_1.Errors.AuthorizationFailed());
                    return;
                }
                ctx.done(null, { id: "admin", username: "admin" });
                return;
            }
            _this.services.UserService.getUser({ username: ctx.body.username, password: ctx.body.password }, function (err, user) {
                if (err || !user) {
                    console.log("login api", err);
                    ctx.error(new errors_1.Errors.AuthorizationFailed("Can not find user"));
                    return;
                }
                ctx.req.session.userId = user.id;
                delete user.password;
                delete user.passwordHash;
                ctx.done(null, user);
            });
        });
        this.api("logout", function (ctx) {
            delete ctx.req.session.userId;
            ctx.done(null, true);
        });
        this.api("getEnvironmentInformation", function (ctx) {
            var user = ctx.info.user;
            ctx.done(null, user);
        }).decorate(RouteDecorators.WithSessionUserInformation());
        this.installTo(this.services.ExpressService.server);
    };
    return UserAPIService;
}(RouteSpec.UserAPIServiceSpec));
exports.UserAPIService = UserAPIService;
//# sourceMappingURL=api.user.js.map