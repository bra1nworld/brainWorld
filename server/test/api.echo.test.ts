///<reference path="./typings/index.d.ts"/>
import * as Settings from "../src/settings"
import { context } from "../src/bootstrap"
import { EchoAPIService } from "../src/route/api.echo"

describe("Test api.echo", () => {
    let service = new EchoAPIService()
    service.initialize()
    it("Echo test", (done) => {
        let route = service.getAPI("echo")
        route.mock("echo/nameString/GET", {
            body: {
                content: "TEST_MESSAGE"
            }
        }, (err, result) => {
            if (err) {
                done(err)
                return
            }
            if (result.name !== "nameString") {
                done(new Error("Fail to echo name"))
                return
            }
            if (result.content !== "TEST_MESSAGE") {
                done(new Error("Fail to echo name"))
                return
            }
            done()
        })

    })
})
