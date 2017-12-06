"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestRunner = /** @class */ (function () {
    function TestRunner() {
        var pathes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pathes[_i] = arguments[_i];
        }
        this.pathes = pathes;
        var mocha = document.querySelector("#mocha");
        if (!mocha) {
            var div = document.createElement("div");
            div.id = "mocha";
            document.body.appendChild(div);
        }
    }
    TestRunner.prototype.run = function (pathes) {
        if (pathes === void 0) { pathes = this.pathes; }
        mocha["suite"].suites = [];
        mocha.setup("bdd");
        mocha.checkLeaks();
        for (var _i = 0, pathes_1 = pathes; _i < pathes_1.length; _i++) {
            var path = pathes_1[_i];
            var test_1 = require(path);
            test_1.run();
        }
        mocha.run();
    };
    return TestRunner;
}());
exports.TestRunner = TestRunner;
