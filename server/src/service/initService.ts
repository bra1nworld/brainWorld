import * as ServiceSpec from "../spec/service"
import { initialize } from "../settings";
import { BagProvider, BagReader } from "../util/bagProvider"
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
        if (this.option.initialize.importBag) {
            let filePath = this.option.initialize.importBag.split("--")[0]
            let paddingSize = this.option.initialize.importBag.split("--")[1]
            let backProvider = new BagProvider()
            let bagRender = backProvider.get(filePath)
            let length = bagRender.getLength()
            this.services.VideoService.createTask({ filePath: filePath, frameTotalCount: length, paddingSize: Number(paddingSize) }, (err, result) => {
                if (err) {
                    console.log(err)
                    return
                }
                this.exit()
            })
        } else {
            this.services.UserService.createTestData(() => {
                return
            })
        }
    }
    exit() {
        process.exit()
    }
}
