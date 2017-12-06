import * as Leaf from "leaf-ts"
import * as RouteSpec from "../spec/route"
export class EchoAPIService extends RouteSpec.EchoAPIServiceSpec {
    initialize() {
        this.api("echo", function () {
            this.success({
                name: this.params.name,
                content: this.body.content
            })
        })
        this.installTo(this.services.ExpressService.server)
    }
}
