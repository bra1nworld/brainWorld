import * as ServiceSpec from "../spec/service"
import * as mongodb from "mongodb"
export class MongodbService extends ServiceSpec.MongodbService {
    initialize(done) {
        super.initialize(() => {
            this.annotationCollection = this.db.collection("annotation")
            this.annotationCollection.createIndex({
                frameIndex: 1,
                sceneId: 1
            }, {
                    unique: true
                })
            done()
        })
    }
}
