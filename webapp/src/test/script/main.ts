///<reference path="R.d.ts"/>
///<reference path="lib/leaf.d.ts"/>

// We use require here, so typescript don't optimize them out.
declare const require: any
window["Leaf"] = require("./lib/leaf")

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
