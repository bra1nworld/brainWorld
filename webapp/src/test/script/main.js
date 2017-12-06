"use strict";
///<reference path="R.d.ts"/>
///<reference path="lib/leaf.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
window["Leaf"] = require("./lib/leaf");
require("./R");
require("./settings");
var app_1 = require("./app");
if (document.readyState === "complete") {
    app_1.App.initialize();
}
else {
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            app_1.App.initialize();
        }
    };
}
