"use strict";
/// <reference path="./typings/index.d.ts" />
/// <reference path="./spec/type.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("root-ts/lib/service");
var BuiltInService = require("root-ts/lib/builtInService");
var Settings = require("./settings");
var pathModule = require("path");
if (Settings.debug) {
    console.log("Debug mode: On");
}
exports.context = new service_1.ServiceContext(Settings);
exports.context.loadServices(pathModule.join(__dirname, "./service/"));
exports.context.loadServices(pathModule.join(__dirname, "./route/"));
exports.context.register(new BuiltInService.DefaultPageService(Settings));
exports.context.setup(function (err) {
    if (err) {
        console.error(err);
        console.error("Fail to setup service");
        process.exit(1);
    }
    console.log("All services ready");
});
//# sourceMappingURL=bootstrap.js.map