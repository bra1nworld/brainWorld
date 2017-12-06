"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var meta = require("./meta");
var url = window.location.toString();
exports.debug = url.indexOf("debug") >= 0;
console.log("Running on", meta.version);
