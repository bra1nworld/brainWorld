import * as Leaf from "leaf-ts"
import * as RouteSpec from "../spec/route"
export class FrameTaskAPIService extends RouteSpec.FrameTaskAPIServiceSpec {
    initialize() {
        this.api("getFramePoints", (ctx) => {
            ctx.done(null, null)
        })

        this.api("getBagInfo", (ctx) => {

            ctx.done(null, null)
        })

        this.api("queryFrameTasks", (ctx) => {
            this.services.FrameTaskService.queryFrames(ctx.body, (err, result) => {
                ctx.done(err, result)
            })
        })

        this.api("findFrameTasks", (ctx) => {
            this.services.FrameTaskService.findFrameTasks(ctx.body.query, (err, result) => {
                ctx.done(err, result)
            })
        })

        this.api("updateFrameTask", (ctx) => {
            this.services.FrameTaskService.updateFrame({
                id: ctx.params.id,
                updates: ctx.body.updates
            }, (err, result) => {
                ctx.done(err, result)
            })
        })

        this.api("getFrameAnnotatesById", (ctx) => {
            this.services.FrameTaskService.getFrameById({ id: ctx.params.id }, (err, result) => {
                ctx.done(err, result.annotations)
            })
        })

        this.api("getFrameTaskById", (ctx) => {
            this.services.FrameTaskService.getFrameById({ id: ctx.params.id }, (err, result) => {
                ctx.done(err, result)
            })
        })



        this.installTo(this.services.ExpressService.server)
    }
}
