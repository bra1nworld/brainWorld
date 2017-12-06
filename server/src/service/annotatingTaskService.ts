import * as ServiceSpec from "../spec/service"
import * as mongodb from "mongodb"
import { Errors } from "../errors"
import { DbPaginateQuery } from "../util/dbPaginateQuery"


export class AnnotatingTaskService extends ServiceSpec.Service implements ServiceSpec.AnnotatingTaskService {
    readonly name = "AnnotatingTaskService"
    dependencies = ["MongodbService",]
    private annotatingTaskCollection: mongodb.Collection
    private annotatingTaskPaginator: DbPaginateQuery<SceneAnnotation.AnnotatingTask>
    initialize(done) {
        this.annotatingTaskCollection = this.services.MongodbService.db.collection("annotatingTask")
        this.annotatingTaskPaginator = new DbPaginateQuery(this.annotatingTaskCollection)
        this.annotatingTaskCollection.createIndex({ id: 1 }, { unique: true })
        done()
    }
    queryAnnotatingTasks(option: PaginateQuery & {
        videoId?: ID
        workerId?: ID
        state?: string[]
        sortBy?: {
            [K in keyof SceneAnnotation.AnnotatingTask]?: number
        }
    }, callback: Callback<Paginate<SceneAnnotation.AnnotatingTask>>) {
        let { pageSize, pageIndex } = option
        let query = {}
        if (option.videoId) {
            query["videoId"] = option.videoId
        }
        if (option.workerId) {
            query["workerId"] = option.workerId
        }
        if (option.state) {
            query["state"] = { $in: option.state }
        }
        this.annotatingTaskPaginator.query({
            pageSize,
            pageIndex,
            query: query,
            sortBy: option.sortBy
        }, callback)
    }

    findAnnotatingTasks(query: Partial<SceneAnnotation.AnnotatingTask>,
        callback: Callback<SceneAnnotation.AnnotatingTask[]>
    ) {
        this.annotatingTaskCollection.find(query).toArray((err, result) => {
            callback(err, result)
        })
    }

    getAnnotatingTaskById(option: {
        id: ID
    }, callback: Callback<SceneAnnotation.AnnotatingTask>) {
        this.annotatingTaskCollection.findOne({ id: option.id }, (err, annotatingTask) => {
            if (err || !annotatingTask) {
                callback(new Errors.NotFound())
                return
            }
            callback(null, annotatingTask)
        })
    }
    updateAnnotatingTaskById(option: {
        id: ID,
        updates: Partial<SceneAnnotation.AnnotatingTask>
    }, callback: Callback<SceneAnnotation.AnnotatingTask>) {
        let { id, updates } = option
        delete updates.id
        delete updates["_id"]
        this.annotatingTaskCollection.findOneAndUpdate(
            { id },
            { $set: updates },
            (err, result) => {
                console.log("----------")
                console.log(result)
                callback(err, result && result.value)
            }
        )
    }
    applyAnnotatingTask(option: {
        workerId: ID
    }, callback: Callback<boolean>) {
        this.annotatingTaskCollection.find({ state: "pending" }).toArray((err, result) => {
            if (err) {
                console.log(err)
                callback(err, true)
                return
            }
            if (result.length < 1) {
                callback(null, false)
                return
            }
            let pendingTask = result[0]
            this.services.UserService.getUserById({ id: option.workerId }, (err, user) => {
                if (err) {
                    console.log(err)
                    callback(err, true)
                    return
                }
                this.annotatingTaskCollection.findOneAndUpdate({ id: pendingTask.id }, {
                    $set: {
                        state: "annotating",
                        workerId: option.workerId,
                        workerName: user.username
                    }
                }, (err, updateResult) => {
                    if (err) {
                        console.log("update failed" + err)
                        callback(err, true)
                        return
                    }
                    callback(null, true)
                })
            })

        })
    }

    createAnnotatingTasks(option: {
        id: ID,
        startFrame: number,
        frameCount: number,
        paddingSize: number,
        checkCount: number,
        state: AnnotatingTaskState,
        videoPath: string
    }[], callback: Callback<boolean>) {
        this.annotatingTaskCollection.insertMany(option, (err, result) => {
            if (err) {
                console.log(err)
                return
            }
            callback(null, true)
        })
    }

    createTestData() {
        let annotatingTasks = [
            {
                id: "1",
                videoPath: "test1",
                startFrame: 15000,
                frameCount: 200,
                paddingSize: 5,
                checkCount: 0,
                state: "pending"
            }, {
                id: "2",
                videoPath: "test1",
                startFrame: 12000,
                frameCount: 200,
                paddingSize: 5,
                checkCount: 0,
                state: "pending"
            }, {
                id: "3",
                videoPath: "test1",
                startFrame: 13000,
                frameCount: 200,
                paddingSize: 5,
                workerId: "",
                checkCount: 0,
                state: "pending"
            }, {
                id: "4",
                videoPath: "test1",
                startFrame: 14000,
                frameCount: 200,
                paddingSize: 5,
                workerId: "",
                checkCount: 0,
                state: "pending"
            }, {
                id: "5",
                videoPath: "test1",
                startFrame: 15000,
                frameCount: 200,
                paddingSize: 5,
                workerId: "",
                checkCount: 0,
                state: "pending"
            }, {
                id: "6",
                videoPath: "test1",
                startFrame: 16000,
                frameCount: 200,
                paddingSize: 5,
                workerId: "",
                checkCount: 0,
                state: "pending"
            }, {
                id: "7",
                videoPath: "test1",
                startFrame: 17000,
                frameCount: 200,
                paddingSize: 5,
                checkCount: 0,
                workerId: "",
                state: "pending"
            }
        ]
        this.annotatingTaskCollection.insertMany(annotatingTasks, (err, result) => {
            if (err) {
                console.log(err)
                return

            }
        })
    }
}

