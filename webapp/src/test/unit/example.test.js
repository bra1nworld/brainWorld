"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Meta = require("../script/meta");
function run() {
    describe("Example test to read meta", function () {
        it("Get meta", function (done) {
            console.log(Meta);
            done();
        });
    });
}
exports.run = run;
