"use strict";
///<reference path="./typings/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var testRunner_1 = require("./testRunner");
var all = LeafTestContext.scripts.filter(function (item) { return item.scriptPath.indexOf(".test.js") >= 0; }).map(function (item) { return item.scriptPath; });
console.log(all);
new (testRunner_1.TestRunner.bind.apply(testRunner_1.TestRunner, [void 0].concat(all)))().run();
// You can also setup the whole application and write integration test.
// using require not import, because import main and not use it will cause compiler to remove the import completely
require("./script/main");
var app_1 = require("./script/app");
console.log("I have my app", app_1.App);
app_1.App.events.listenBy(this, "initialized", function () {
    console.log("Do something after application initialized");
});
