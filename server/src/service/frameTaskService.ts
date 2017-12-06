import * as ServiceSpec from "../spec/service"
import * as mongodb from "mongodb"
import { Errors } from "../errors"
import { DbPaginateQuery } from "../util/dbPaginateQuery"


export class FrameTaskService extends ServiceSpec.Service implements ServiceSpec.FrameTaskService {
    readonly name = "FrameTaskService"
    dependencies = ["MongodbService",]
    private frameTaskCollection: mongodb.Collection
    private frameTaskPaginator: DbPaginateQuery<SceneAnnotation.Frame>
    initialize(done) {
        this.frameTaskCollection = this.services.MongodbService.db.collection("frameTask")
        this.frameTaskPaginator = new DbPaginateQuery(this.frameTaskCollection)
        this.frameTaskCollection.createIndex({ id: 1 }, { unique: true })
        done()
    }
    queryFrames(option: PaginateQuery & {
        taskId: string
        state?: string[]
        sortBy?: {
            [K in keyof SceneAnnotation.Frame]?: number
        }
    }, callback: Callback<Paginate<SceneAnnotation.Frame>>) {
        let { pageSize, pageIndex } = option
        let query = {
            taskId: option.taskId
        }
        if (option.state) {
            query["state"] = { $in: option.state }
        }
        this.frameTaskPaginator.query({
            pageSize,
            pageIndex,
            query: query,
            sortBy: option.sortBy
        }, callback)
    }


    findFrameTasks(query: Partial<SceneAnnotation.Frame> & {
        states?: string[]
    }, callback: Callback<SceneAnnotation.Frame[]>) {
        let option = query as any
        if (query.states) {
            option["state"] = { $in: query.states }
        }
        delete option.states
        this.frameTaskCollection.find(option).toArray((err, result) => {
            callback(err, result)
        })
    }

    getFrameById(option: {
        id: ID
    }, callback: Callback<SceneAnnotation.Frame>) {
        this.frameTaskCollection.findOne({ id: option.id }, (err, frame) => {
            if (err || !frame) {
                callback(new Errors.NotFound())
                return
            }
            callback(null, frame as SceneAnnotation.Frame)
        })
    }

    updateFrame(option: {
        id: ID,
        updates: Partial<SceneAnnotation.Frame>
    }, callback: Callback<SceneAnnotation.Frame>) {
        let { id, updates } = option
        delete updates.id
        delete updates["_id"]
        this.frameTaskCollection.findOneAndUpdate(
            { id },
            { $set: updates },
            (err, result) => {
                callback(err, result && result.value)
            }
        )
    }

    createFrameTasks(option: {
        id: ID,
        videoPath: string,
        taskId: ID,
        frameIndex: number,
        state: FrameState
    }[], callback: Callback<boolean>) {
        this.frameTaskCollection.insertMany(option, (err, result) => {
            if (err) {
                console.log(err)
                return
            }
            callback(null, true)
        })
    }

    createTestData() {
        //test
        let frames = [
            {
                id: "11",
                videoPath: "test1",
                taskId: "1",
                frameIndex: 11005,
                state: "pending"
            }, {
                id: "12",
                videoPath: "test1",
                taskId: "1",
                frameIndex: 11010,
                state: "pending"
            }, {
                id: "13",
                videoPath: "test1",
                taskId: "1",
                frameIndex: 11015,
                state: "pending"
            },
            {
                id: "21",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12005,
                state: "pending"
            }, {
                id: "22",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12010,
                state: "pending"
            }, {
                id: "23",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12015,
                state: "pending"
            }, {
                id: "24",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12020,
                state: "pending"
            }, {
                id: "25",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12025,
                state: "pending"
            }, {
                id: "26",
                videoPath: "test1",
                taskId: "2",
                frameIndex: 12030,
                state: "pending"
            },
            {
                id: "31",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13005,
                state: "pending"
            }, {
                id: "32",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13010,
                state: "pending"
            }, {
                id: "33",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13015,
                state: "pending"
            }, {
                id: "34",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13020,
                state: "pending"
            }, {
                id: "35",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13025,
                state: "pending"
            }, {
                id: "36",
                videoPath: "test1",
                taskId: "3",
                frameIndex: 13030,
                state: "pending"
            },
            {
                id: "41",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14005,
                state: "pending"
            }, {
                id: "42",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14010,
                state: "pending"
            }, {
                id: "43",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14015,
                state: "pending"
            }, {
                id: "44",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14020,
                state: "pending"
            }, {
                id: "45",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14025,
                state: "pending"
            }, {
                id: "46",
                videoPath: "test1",
                taskId: "4",
                frameIndex: 14030,
                state: "pending"
            },
            {
                id: "51",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15005,
                state: "pending"
            }, {
                id: "52",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15010,
                state: "pending"
            }, {
                id: "53",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15015,
                state: "pending"
            }, {
                id: "54",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15020,
                state: "pending"
            }, {
                id: "55",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15025,
                state: "pending"
            }, {
                id: "56",
                videoPath: "test1",
                taskId: "5",
                frameIndex: 15030,
                state: "pending"
            },
            {
                id: "61",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16005,
                state: "pending"
            }, {
                id: "62",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16010,
                state: "pending"
            }, {
                id: "63",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16015,
                state: "pending"
            }, {
                id: "64",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16020,
                state: "pending"
            }, {
                id: "65",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16025,
                state: "pending"
            }, {
                id: "66",
                videoPath: "test1",
                taskId: "6",
                frameIndex: 16030,
                state: "pending"
            },
            {
                id: "71",
                videoPath: "test1",
                taskId: "7",
                frameIndex: 17005,
                state: "pending"
            }, {
                id: "72",
                videoPath: "test1",
                taskId: "7",
                frameIndex: 17010,
                state: "pending"
            }, {
                id: "73",
                videoPath: "test1",
                taskId: "7",
                frameIndex: 17015,
                state: "pending"
            }
        ]
        console.log("frame test data")
        this.frameTaskCollection.insertMany(frames, (err, result) => {
            if (err) {
                console.log(err)
                return

            }
        })
    }
}
