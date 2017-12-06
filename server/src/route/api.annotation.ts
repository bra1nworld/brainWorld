import * as Leaf from "leaf-ts"
import * as RouteSpec from "../spec/route"
export class AnnotationAPIService extends RouteSpec.AnnotationAPIServiceSpec {
    initialize() {
        this.api("getSceneFrameAnnotations", (ctx) => {
            let col = this.services.MongodbService.annotationCollection
            col.findOne({ sceneId: ctx.params.sceneId, frameIndex: parseInt(ctx.params.sceneId) }, (err, result: SceneAnnotation.FrameAnnotation) => {
                if (err || !result) {
                    ctx.done(null, [])
                    return
                }
                ctx.success(result.annotations)
            })
        })
        this.api("saveFrameAnnotation", ctx => {
            let fa: SceneAnnotation.FrameAnnotation = {
                frameIndex: parseInt(ctx.params.frameIndex),
                sceneId: ctx.params.sceneId,
                annotations: ctx.body.annotations
            }
            let col = this.services.MongodbService.annotationCollection
            col.update({
                frameIndex: fa.frameIndex,
                sceneId: fa.sceneId
            }, {
                    $set: fa
                }, {
                    upsert: true
                }, (err) => {
                    console.error(err, "???")
                    ctx.done(err, fa)
                })

        })
        this.installTo(this.services.ExpressService.server)
    }
}
