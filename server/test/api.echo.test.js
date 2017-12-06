"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_echo_1 = require("../src/route/api.echo");
describe("Test api.echo", function () {
    var service = new api_echo_1.EchoAPIService();
    service.initialize();
    it("Echo test", function (done) {
        var route = service.getAPI("echo");
        route.mock("echo/nameString/GET", {
            body: {
                content: "TEST_MESSAGE"
            }
        }, function (err, result) {
            if (err) {
                done(err);
                return;
            }
            if (result.name !== "nameString") {
                done(new Error("Fail to echo name"));
                return;
            }
            if (result.content !== "TEST_MESSAGE") {
                done(new Error("Fail to echo name"));
                return;
            }
            done();
        });
    });
});
//# sourceMappingURL=api.echo.test.js.map