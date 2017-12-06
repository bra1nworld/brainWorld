/// <reference path="./typings/index.d.ts" />
/// <reference path="./spec/type.d.ts" />

import { ServiceContext } from "root-ts/lib/service"
import * as BuiltInService from "root-ts/lib/builtInService"
import * as Settings from "./settings"
import * as pathModule from "path"

if (Settings.debug) {
    console.log("Debug mode: On")
}

export const context = new ServiceContext(Settings)
context.loadServices(pathModule.join(__dirname, "./service/"))
context.loadServices(pathModule.join(__dirname, "./route/"))
context.register(new BuiltInService.DefaultPageService(Settings))

context.setup((err) => {
    if (err) {
        console.error(err)
        console.error("Fail to setup service")
        process.exit(1)
    }
    console.log("All services ready")
})

