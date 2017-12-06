import * as Leaf from "leaf-ts"
import * as pathModule from "path"
import * as fs from "fs"
import * as RouteSpec from "../spec/route"
export class SceneFrameAPIService extends RouteSpec.SceneFrameAPIServiceSpec {
    initialize() {
        this.api("getSceneFrame", (ctx)=>{
            let sf:SceneAnnotation.SceneFrame = {
                sceneId:"testScene",
                index:0,
                pcd:fs.readFileSync(pathModule.join(__dirname,"../../../webapp/src/resource/test.pcd"),"utf8")
            }
            ctx.success(sf)
        })
        this.api("getUnannotatedSceneFrame",ctx=>{
            ctx.success([{
                sceneId:"testScene",
                index:1
            }])
        })
        this.installTo(this.services.ExpressService.server)
    }
}
