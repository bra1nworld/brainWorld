import * as ServiceSpec from "../spec/service"
import * as mongodb from "mongodb"
import { Errors } from "../errors"
import { DbPaginateQuery } from "../util/dbPaginateQuery"

export class VideoService extends ServiceSpec.Service implements ServiceSpec.VideoService {
    paddingSize: number
    taskFramesCount = 100
    readonly name = "VideoService"
    dependencies = ["MongodbService", "AnnotatingTaskService", "FrameTaskService"]
    private videoCollection: mongodb.Collection
    private videoPaginator: DbPaginateQuery<SceneAnnotation.Video>
    initialize(done) {
        this.videoCollection = this.services.MongodbService.db.collection("video")
        this.videoPaginator = new DbPaginateQuery(this.videoCollection)
        this.videoCollection.createIndex({ id: 1 }, { unique: true })
        done()
    }
    getVideos(option: {
        filePath: string
    }, callback: Callback<SceneAnnotation.Video[]>) {

    }
    createTask(option: {
        filePath: string,
        frameTotalCount: number,
        paddingSize?: number
    }, callback: Callback<boolean>) {
        console.log("paddingSize-------------------" + option.paddingSize)
        this.paddingSize = option.paddingSize ? option.paddingSize : 5
        let taskPaddingFramesCount = this.taskFramesCount * this.paddingSize
        let { filePath, frameTotalCount } = option
        let remainder = frameTotalCount % taskPaddingFramesCount
        let tasksCount = Math.ceil(frameTotalCount / taskPaddingFramesCount)

        //任务,id为Date.now()+四位数index  17位
        let annotatingTasks: {
            id: ID,
            startFrame: number,
            frameCount: number,
            paddingSize: number,
            checkCount: number,
            state: AnnotatingTaskState,
            videoPath: string
        }[] = [],
            frameTasks: {
                id: ID,
                videoPath: string,
                taskId: ID,
                frameIndex: number,
                state: FrameState
            }[] = [],
            nowDate = formatDateTime(new Date())
        for (let i = 1; i <= tasksCount; i++) {
            //12+4
            let taskId = nowDate + (i + 10000).toString().substr(1, 4)
            let startFrame = taskPaddingFramesCount * (i - 1);// start from 0
            let frameCount = this.taskFramesCount;
            if (i == tasksCount) {
                if (remainder != 0) {
                    frameCount = Math.ceil(remainder / this.paddingSize)
                }
            }
            annotatingTasks.push({
                id: taskId,
                videoPath: filePath,
                startFrame: startFrame,
                frameCount: frameCount,
                paddingSize: this.paddingSize,
                checkCount: 0,
                state: "pending"
            })
            for (let j = 1; j <= frameCount; j++) {
                //frameId 12+7
                let frameIndex = startFrame + (j - 1) * this.paddingSize
                let frameId = nowDate + (frameIndex + 10000000).toString().substr(1, 7)
                frameTasks.push({
                    id: frameId,
                    videoPath: filePath,
                    taskId: taskId,
                    frameIndex: frameIndex,
                    state: "pending"
                })
            }
        }
        this.services.AnnotatingTaskService.createAnnotatingTasks(annotatingTasks, (err, annotatingTaskResult) => {
            if (err) {
                console.log(err)
                callback(err, null)
                return
            }
            this.services.FrameTaskService.createFrameTasks(frameTasks, (err, frameTaskResult) => {
                if (err) {
                    console.log(err)
                    callback(err, null)
                    return
                }
                callback(null, true)
            })
        })

        function formatDateTime(date: Date): string {
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let mon = m < 10 ? ('0' + m) : m.toString();
            let d = date.getDate();
            let day = d < 10 ? ('0' + d) : d.toString();
            let h = date.getHours().toString();
            let minute = date.getMinutes();
            let min = minute < 10 ? ('0' + minute) : minute.toString();
            return y + mon + day + h + minute;
        }
    }

}

