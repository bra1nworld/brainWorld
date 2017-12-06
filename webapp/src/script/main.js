"use strict";
///<reference path="R.d.ts"/>
///<reference path="lib/leaf.d.ts"/>
///<reference path="spec/type.d.ts"/>
///<reference path="../typings/index.d.ts"/>
///<reference path="./three-plugin.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
window["Leaf"] = require("./lib/leaf");
window["THREE"] = require("./lib/three");
require("./lib/three/PCDLoader");
require("./lib/three/OrbitControls");
require("./lib/three/TransformControls");
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
