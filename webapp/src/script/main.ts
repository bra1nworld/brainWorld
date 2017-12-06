///<reference path="R.d.ts"/>
///<reference path="lib/leaf.d.ts"/>
///<reference path="spec/type.d.ts"/>
///<reference path="../typings/index.d.ts"/>
///<reference path="./three-plugin.d.ts"/>

// We use require here, so typescript don't optimize them out.
declare const require: any
window["Leaf"] = require("./lib/leaf")

window["THREE"] = require("./lib/three")
require("./lib/three/PCDLoader")
require("./lib/three/OrbitControls")
require("./lib/three/TransformControls")
require("./R")
require("./settings")

import { App } from "./app"

if (document.readyState === "complete") {
    App.initialize()
} else {
    document.onreadystatechange = () => {
        if (document.readyState === "complete") {
            App.initialize()
        }
    }
}
