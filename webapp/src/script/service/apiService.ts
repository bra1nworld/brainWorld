import * as API from "../R.api"
const Echo = API.GenerateEchoAPIService()
const SceneFrame = API.GenerateSceneFrameAPIService()
const Annotation = API.GenerateAnnotationAPIService()
const AnnotatingTask = API.GenerateAnnotatingTaskAPIService()


let factory = new Leaf.APIFactory({
    prefix: "/api/",
    bodyType: "json",
    errorMapper: (err: Error) => {
        return err
    },
})


export class APIService extends Leaf.Service {
    readonly name = "APIService"
    states = []
    Echo = new Echo
    SceneFrame = new SceneFrame
    Annotation = new Annotation
    // AnnotatingTask = new AnnotatingTask
    constructor() {
        super()
    }

    //AnnotatingTask
    queryAnnotatingTasks = factory.createAPIFunction<PaginateQuery & {
        videoId?: ID
        workerId?: ID
        state?: string[]
        sortBy?: {
            [K in keyof SceneAnnotation.AnnotatingTask]?: number
        }
    }, Paginate<SceneAnnotation.AnnotatingTask>>({
        method: "POST",
        path: "annotatingTask/paginate"
    })

    applyAnnotatingTask = factory.createAPIFunction<{
        workerId: ID
    }, boolean>({
        method: "POST",
        path: "annotatingTask/apply"
    })

    getAnnotatingTaskById = factory.createAPIFunction<{
        id: ID,
    }, SceneAnnotation.AnnotatingTask>({
        method: "POST",
        path: "annotatingTask/:id/get"
    })

    pendingAnnotatingTask = factory.createAPIFunction<{
        id: ID,
    }, SceneAnnotation.AnnotatingTask>({
        method: "POST",
        path: "annotatingTask/:id/pending"
    })

    confirmAnnotatingTask = factory.createAPIFunction<{
        id: ID,
    }, SceneAnnotation.AnnotatingTask>({
        method: "POST",
        path: "annotatingTask/:id/confirm"
    })
    createTestData = factory.createAPIFunction({
        method: "POST",
        path: "annotatingTask/testData"
    })

    //FrameTask

    queryFrameTasks = factory.createAPIFunction<PaginateQuery & {
        taskId: string
        state?: string[]
        sortBy?: {
            [K in keyof SceneAnnotation.Frame]?: number
        }
    }, Paginate<SceneAnnotation.Frame>>({
        method: "POST",
        path: "frameTask/paginate"
    })

    findFrameTasks = factory.createAPIFunction<{
        query: Partial<SceneAnnotation.Frame> & {
            states?: string[]
        }
    }, SceneAnnotation.Frame[]>({
        method: "POST",
        path: "frameTask/find"
    })

    annotateFrameTask = factory.createAPIFunction<{
        id: ID,
    }, SceneAnnotation.Frame>({
        method: "POST",
        path: "frameTask/:id/complete"
    })

    updateFrameTask = factory.createAPIFunction<{
        id: ID,
        updates: Partial<SceneAnnotation.Frame>
    }, SceneAnnotation.Frame>({
        method: "POST",
        path: "frameTask/:id/update"
    })

    getFrameAnnotatesById = factory.createAPIFunction<{
        id: ID,
    }, SceneAnnotation.Annotation[]>({
        method: "POST",
        path: "frameTask/:id/getById"
    })

    getFrameTaskById = factory.createAPIFunction<{
        id: ID,
    }, SceneAnnotation.Frame>({
        method: "POST",
        path: "frameTask/:id/getFrame"
    })

    getFramePoints = factory.createAPIFunction<{
        filePath: string,
        frameIndex: number
    }, Point[]>({
        method: "POST",
        path: "frameTask/getPoints"
    })

    getBagInfo = factory.createAPIFunction<{
        filePath: string
    }, BagInfo>({
        method: "POST",
        path: "frameTask/bagInfo"
    })

    //CheckingTasks
    queryCheckingTasks = factory.createAPIFunction<PaginateQuery & {
        checkerId?: ID
        state?: string
        sortBy?: {
            [K in keyof SceneAnnotation.CheckingTask]?: number
        }
    }, Paginate<SceneAnnotation.CheckingTask>>({
        method: "POST",
        path: "checkingTask/paginate"
    })
    applyCheckingTask = factory.createAPIFunction<{
        checkerId: ID
    }, boolean>({
        method: "POST",
        path: "checkingTask/apply"
    })
    confirmCheckingTask = factory.createAPIFunction<{
        id: ID
        annotatingTaskId: ID
    }, boolean>({
        method: "POST",
        path: "checkingTask/:id/confirm"
    })


    //user
    getUserById = factory.createAPIFunction<{
        id: ID
    }, boolean>({
        method: "POST",
        path: "user/:id/getUser"
    })

    getUser = factory.createAPIFunction<{
        username: string
        password: string
    }, boolean>({
        method: "POST",
        path: "user/getUser"
    })

    login = factory.createAPIFunction<{
        username: string,
        password: string
    }, User>({
        method: "POST",
        path: "user/login"
    })

    logout = factory.createAPIFunction<{}, true>({
        method: "DELETE",
        path: "user/logout"
    })

    getEnvironmentInformation = factory.createAPIFunction<{}, User>({
        method: "POST",
        path: "user/environment"
    })
}
