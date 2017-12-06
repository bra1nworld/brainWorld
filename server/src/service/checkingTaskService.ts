import * as ServiceSpec from "../spec/service"
import * as mongodb from "mongodb"
import { Errors } from "../errors"
import { DbPaginateQuery } from "../util/dbPaginateQuery"

export class CheckingTaskService extends ServiceSpec.Service implements ServiceSpec.CheckingTaskService {
    readonly name = "CheckingTaskService"
    dependencies = ["MongodbService", "IncrementalIdService"]
    private CheckingTaskCollection: mongodb.Collection
    private CheckingTaskPaginator: DbPaginateQuery<SceneAnnotation.CheckingTask>
    initialize(done) {
        this.CheckingTaskCollection = this.services.MongodbService.db.collection("checkingTask")
        this.CheckingTaskPaginator = new DbPaginateQuery(this.CheckingTaskCollection)
        this.CheckingTaskCollection.createIndex({ id: 1 }, { unique: true })
        this.services.IncrementalIdService.ensure({ name: "checkingTask", offset: 1000 }, () => {
        })
        done()
    }
    queryCheckingTasks(option: PaginateQuery & {
        checkerId?: ID
        state?: string
        sortBy?: {
            [K in keyof SceneAnnotation.CheckingTask]?: number
        }
    }, callback: Callback<Paginate<SceneAnnotation.CheckingTask>>) {
        let { pageSize, pageIndex } = option
        let query = {}
        if (option.checkerId) {
            query["checkerId"] = option.checkerId
        }
        if (option.state) {
            query["state"] = option.state
        }
        this.CheckingTaskPaginator.query({
            pageSize,
            pageIndex,
            query: query,
            sortBy: option.sortBy
        }, callback)
    }

    createCheckingTask(option: {
        annotatingTaskId: ID,
        checkerId: ID,
        checkerName: string
    }, callback: Callback<SceneAnnotation.CheckingTask>) {
        this.services.IncrementalIdService.next({ name: "checkingTask" }, (err, id) => {
            if (err) {
                callback(err)
                return
            }
            option["id"] = id.toString()
            option["startTime"] = new Date()
            option["state"] = "checking"
            this.CheckingTaskCollection.insertOne(option, (err) => {
                if (err) {
                    callback(new Errors.UnknownError("Faild to create checkingTask", { via: err }))
                    return
                }
                callback(null, option as any)
            })
        })
    }

    getCheckingTaskById(option: {
        id: ID
    }, callback: Callback<SceneAnnotation.CheckingTask>) {
        this.CheckingTaskCollection.findOne({ id: option.id }, (err, checkingTask) => {
            if (err || !checkingTask) {
                callback(new Errors.NotFound())
                return
            }
            callback(null, checkingTask)
        })
    }
    updateCheckingTaskById(option: {
        id: ID,
        updates: Partial<SceneAnnotation.CheckingTask>
    }, callback: Callback<SceneAnnotation.CheckingTask>) {
        let { id, updates } = option
        delete updates.id
        delete updates["_id"]
        this.CheckingTaskCollection.findOneAndUpdate(
            { id },
            { $set: updates },
            (err, result) => {
                callback(err, result && result.value)
            }
        )
    }
    applyCheckingTask(option: {
        checkerId: ID
    }, callback: Callback<boolean>) {
        //test
        /**
         * annotatingTaskId: "标注任务编号",
                    startTime: "开始时间",
                    endTime: "结束时间",
                    checkerId: "复查人",
                    state: "复查状态",
         */
        let checkingTasks = [
            {
                id: "101",
                annotatingTaskId: "5",
                startTime: "",
                endTime: "",
                checkerId: "321",
                state: "checking"
            }, {
                id: "102",
                annotatingTaskId: "7",
                startTime: "",
                endTime: "",
                checkerId: "321",
                state: "checked"
            }, {
                id: "103",
                annotatingTaskId: "6",
                startTime: "",
                endTime: "",
                checkerId: "321",
                state: "checked"
            }
        ]
        console.log(5465135465)
        this.CheckingTaskCollection.insertMany(checkingTasks, (err, result) => {
            if (err) {
                console.log(err)
                callback(err, false)
                return

            }
            callback(null, true)
        })
        // callback(null, true)
    }
}
