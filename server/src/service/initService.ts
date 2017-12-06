import * as ServiceSpec from "../spec/service"
import { initialize } from "../settings";
export class InitService extends ServiceSpec.Service {
    readonly name = "InitService"
    readonly befores = ["ExpressService"]
    dependencies = [
        "VideoService", "UserService"
    ]
    constructor(private option: {
        initialize: {
            offline: boolean,
            importBag: string
        }
    }) {
        super(option)
    }
    initialize() {
    }
    exit() {
        process.exit()
    }
}
