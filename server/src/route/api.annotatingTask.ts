import * as Leaf from "leaf-ts"
import * as RouteSpec from "../spec/route"
export class AnnotatingTaskAPIService extends RouteSpec.AnnotatingTaskAPIServiceSpec {
    initialize() {
        this.api("createTestData", (ctx) => {
            // this.services.AnnotatingTaskService.createTestData()
            // this.services.FrameTaskService.createTestData()
            this.services.UserService.createTestData((err, result) => {
                ctx.done(err, result)
            })
            // let filePath = "/home/dhy/tianjin_2017-09-28-13-49-18.bag"
            // let backProvider = new BagProvider()
            // let bagRender = backProvider.get(filePath)
            // let length = bagRender.getLength()
            // this.services.VideoService.createTask({ filePath: filePath, frameTotalCount: length }, (err, result) => {
            //     ctx.done(err, result)
            // })
        })

        this.api("queryAnnotatingTasks", (ctx) => {
            this.services.AnnotatingTaskService.queryAnnotatingTasks(ctx.body, (err, result) => {
                ctx.done(err, result)
            })
        })

        this.api("getAnnotatingTaskById", (ctx) => {
            this.services.AnnotatingTaskService.getAnnotatingTaskById(ctx.params, (err, result) => {
                ctx.done(err, result)
            })
        })

        this.api("applyAnnotatingTask", (ctx) => {
            this.services.AnnotatingTaskService.applyAnnotatingTask(ctx.body, (err, result) => {
                ctx.done(err, result)
            })
        })

        this.api("pendingAnnotatingTask", (ctx) => {
            let updates = { state: "pending", workerId: "" } as Partial<SceneAnnotation.AnnotatingTask>
            let option = {
                "id": ctx.params.id,
                "updates": updates
            }
            this.services.AnnotatingTaskService.updateAnnotatingTaskById(option, (err, result) => {
                ctx.done(err, result)
            })
        })

        this.api("confirmAnnotatingTask", (ctx) => {
            this.services.FrameTaskService.findFrameTasks({
                taskId: ctx.params.id,
                states: ["pending", "annotating", "hasError"]
            }, (err, result) => {
                if (result.length > 0) {
                    console.log(">>>>00000")
                    ctx.done(err, null)
                    return
                }
                let updates = { state: "annotated" } as Partial<SceneAnnotation.AnnotatingTask>
                let option = {
                    "id": ctx.params.id,
                    "updates": updates
                }
                this.services.AnnotatingTaskService.updateAnnotatingTaskById(option, (err, result) => {
                    ctx.done(err, result)
                })
            })
        })

        this.installTo(this.services.ExpressService.server)
    }
}
