///<reference path="../typings/index.d.ts"/>
///<reference path="type.d.ts"/>
import { Service as RawService } from "root-ts/lib/service"
import * as BuiltIn from "root-ts/lib/builtInService"
import * as mongodb from "mongodb"
export abstract class Service extends RawService {
    public services: AllServices
}
export interface AllServices {
    ExpressService: BuiltIn.ExpressService
    IncrementalIdService: BuiltIn.IncrementalIdService
    MongodbService: MongodbService
    FrameTaskService: FrameTaskService
    VideoService: VideoService
    AnnotatingTaskService: AnnotatingTaskService
    CheckingTaskService: CheckingTaskService
    UserService: UserService
}

export abstract class MongodbService extends BuiltIn.MongodbService {
    userCollection: mongodb.Collection
    annotationCollection: mongodb.Collection
    services: AllServices
}

export abstract class VideoService extends Service {
    readonly name = "VideoService"
    abstract getVideos(option: {
        filePath: string
    }, callback: Callback<SceneAnnotation.Video[]>)
    abstract createTask(option: {
        filePath: string,
        frameTotalCount: number
        paddingSize?: number
    }, callback: Callback<boolean>)
}

export abstract class AnnotatingTaskService extends Service {
    readonly name = "AnnotatingTaskService"
    abstract queryAnnotatingTasks(option: PaginateQuery & {
        videoId?: ID
        workerId?: ID
        state?: string[]
        sortBy?: {
            [K in keyof SceneAnnotation.AnnotatingTask]?: number
        }
    }, callback: Callback<Paginate<SceneAnnotation.AnnotatingTask>>)

    abstract findAnnotatingTasks(query: Partial<SceneAnnotation.AnnotatingTask>,
        callback: Callback<SceneAnnotation.AnnotatingTask[]>
    )
    abstract getAnnotatingTaskById(option: {
        id: string
    }, callback: Callback<SceneAnnotation.AnnotatingTask>)

    abstract updateAnnotatingTaskById(option: {
        id: string
        updates: Partial<SceneAnnotation.AnnotatingTask>
    }, callback: Callback<SceneAnnotation.AnnotatingTask>)

    abstract applyAnnotatingTask(option: {
        workerId: ID
    }, callback: Callback<boolean>)

    abstract createAnnotatingTasks(option: {
        id: ID,
        startFrame: number,
        frameCount: number,
        paddingSize: number,
        checkCount: number,
        state: AnnotatingTaskState,
        videoPath: string
    }[], callback: Callback<boolean>)

    abstract createTestData()
}
export abstract class CheckingTaskService extends Service {
    readonly name = "CheckingTaskService"
    abstract queryCheckingTasks(option: PaginateQuery & {
        checkerId?: ID
        state?: string
        sortBy?: {
            [K in keyof SceneAnnotation.CheckingTask]?: number
        }
    }, callback: Callback<Paginate<SceneAnnotation.CheckingTask>>)

    abstract createCheckingTask(option: {
        annotatingTaskId: string
        checkerId: ID
        checkerName: string
    }, callback: Callback<SceneAnnotation.CheckingTask>)

    abstract getCheckingTaskById(option: {
        id: string
    }, callback: Callback<SceneAnnotation.CheckingTask>)

    abstract updateCheckingTaskById(option: {
        id: string
        updates: Partial<SceneAnnotation.CheckingTask>
    }, callback: Callback<SceneAnnotation.CheckingTask>)

    abstract applyCheckingTask(option: {
        checkerId: ID
    }, callback: Callback<boolean>)
}

export abstract class FrameTaskService extends Service {
    readonly name = "FrameTaskService"
    abstract queryFrames(option: PaginateQuery & {
        taskId: string
        state?: string[]
    }, callback: Callback<Paginate<SceneAnnotation.Frame>>)

    abstract createTestData()

    abstract findFrameTasks(query: Partial<SceneAnnotation.Frame> & {
        states?: string[]
    }, callback: Callback<SceneAnnotation.Frame[]>)

    abstract updateFrame(option: {
        id: ID
        updates: Partial<SceneAnnotation.Frame>
    }, callback: Callback<SceneAnnotation.Frame>)

    abstract createFrameTasks(option: {
        id: ID,
        videoPath: string,
        taskId: ID,
        frameIndex: number,
        state: FrameState
    }[], callback: Callback<boolean>)

    abstract getFrameById(option: {
        id: ID
    }, callback: Callback<SceneAnnotation.Frame>)
}

export abstract class UserService extends Service {
    readonly name: "UserService"
    abstract createUser(
        option: Partial<User>,
        callback: Callback<User>
    )
    abstract updateUser(
        option: {
            id: string
            updates: Partial<User>
        },
        callback: Callback<User>
    )
    // abstract queryUsers(option: PaginateQuery & {
    //     role: Role
    // }, callback: Callback<Paginate<User>>)
    abstract getUser(option: {
        username: string
        password: string
    }, callback: Callback<User>)
    abstract getUserById(option: {
        id: ID
    }, callback: Callback<User>)
    abstract createTestData(callback: Callback<boolean>)
}