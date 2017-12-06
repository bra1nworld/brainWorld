"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
function GenRouteDec(solver) {
    return function (option) {
        return function (obj, name, descriptor) {
            var fn = descriptor.value;
            descriptor.value = function () {
                solver.call(this, fn.bind(this), this.services, option || {});
            };
        };
    };
}
exports.WithSessionUserInformation = GenRouteDec(function (origin, services, option) {
    var _this = this;
    if (!this.req || !this.req.session || !this.req.session.userId) {
        origin();
        return;
    }
    var id = this.req.session.userId;
    if (id === "admin") {
        this.info.user = { id: "admin", username: "admin", password: "admin", role: "admin" };
        origin();
        return;
    }
    services.UserService.getUserById({ id: id }, function (err, user) {
        if (!user) {
            _this.error(new errors_1.Errors.AuthorizationFailed("user id not found:" + id));
            return;
        }
        _this.info.user = user;
        origin();
    });
});
//# sourceMappingURL=routeDecorators.js.map