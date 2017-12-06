import * as Leaf from "leaf-ts"
import * as RouteSpec from "../spec/route"
import { BagProvider, BagReader } from "../util/bagProvider"
export class FrameTaskAPIService extends RouteSpec.FrameTaskAPIServiceSpec {
    initialize() {
        this.api("getFramePoints", (ctx) => {
            let backProvider = new BagProvider()
            let bagRender = backProvider.get(ctx.body.filePath)
            let frameCount = bagRender.getLength()
            if (ctx.body.frameIndex > frameCount || ctx.body.frameIndex < 0) {
                ctx.done(null, null)
                return
            }
            let points = bagRender.getFrame(ctx.body.frameIndex).getPoints()
            ctx.done(null, points)
        })

        this.api("getBagInfo", (ctx) => {
            let backProvider = new BagProvider()
            let bagRender = backProvider.get(ctx.body.filePath)
            let frameCount = bagRender.getLength()
            let bagInfo: BagInfo = {};
            bagInfo.frameCount = frameCount
            ctx.done(null, bagInfo)
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
