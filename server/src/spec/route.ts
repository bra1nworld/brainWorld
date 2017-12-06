import { Route, APIRoute, PageRoute, MiddlewareRoute, Method, APIBase as APIBaseRaw, DynamicResourceRoute } from "root-ts/lib/route"
import * as ServiceSpec from "./service"
import { RouteServiceTemplate, APIServiceSpec } from "root-ts/lib/route"
export abstract class RouteService<T extends APIServiceSpec> extends RouteServiceTemplate<T>{
    dependencies = ["ExpressService", "MongodbService", "RouteSessionService"]
    services: ServiceSpec.AllServices
}

export abstract class APIBase extends APIBaseRaw {
    services: ServiceSpec.AllServices
}

export abstract class EchoAPIServiceSpec extends RouteService<typeof EchoAPIService.API>{
    constructor() {
        super(EchoAPIService)
    }
}
namespace EchoAPIService {
    export const prefix = "/api/"
    export const name = "api.echo"
    export const API = {
        echo: new class extends APIBase {
            readonly path = "echo/:name/GET"
            readonly method = "POST"
            return: {
                name: string
                content: string
            }
            params: {
                name: string
            }
            body: {
                content: string
            }
        }
    }
}

export abstract class AnnotationAPIServiceSpec extends RouteService<typeof AnnotationAPIService.API>{
    constructor() {
        super(AnnotationAPIService)
    }
}
namespace AnnotationAPIService {
    export const prefix = "/api/"
    export const name = "api.annotation"
    export const API = {
        getSceneFrameAnnotations: new class extends APIBase {
            readonly path = "annotation/:sceneId/:frameIndex/GET"
            readonly method = "POST"
            return: SceneAnnotation.Annotation[]
            params: {
                sceneId: string
                frameIndex: string
            }
        },
        saveFrameAnnotation: new class extends APIBase {
            readonly path = "annotation/:sceneId/:frameIndex"
            readonly method = "PUT"
            body: {
                annotations: SceneAnnotation.Annotation[]
            }
            params: {
                sceneId: string
                frameIndex: string
            }
        }
    }
}


export abstract class SceneFrameAPIServiceSpec extends RouteService<typeof SceneFrameAPIService.API>{
    constructor() {
        super(SceneFrameAPIService)
    }
}
namespace SceneFrameAPIService {
    export const prefix = "/api/"
    export const name = "api.frame"
    export const API = {
        getSceneFrame: new class extends APIBase {
            readonly path = "frame/:sceneId/:frameIndex"
            readonly method = "POST"
            return: SceneAnnotation.Frame
            params: {
                sceneId: string
                frameIndex: string
            }
        },
        getUnannotatedSceneFrame: new class extends APIBase {
            readonly path = "frame"
            readonly method = "POST"
            return: SceneAnnotation.Frame[]
            body: {
                offset: number
                count: number
            }
        }
    }
}


export abstract class AnnotatingTaskAPIServiceSpec extends RouteService<typeof AnnotatingTaskAPIService.API>{
    constructor() {
        super(AnnotatingTaskAPIService)
    }
}

namespace AnnotatingTaskAPIService {
    export const prefix = "/api/"
    export const name = "api.annotatingTask"
    export const API = {
        queryAnnotatingTasks: new class extends APIBase {
            readonly method = "POST"
            readonly path = "annotatingTask/paginate"
            body: PaginateQuery & {
                videoId?: ID
                workerId?: ID
                state?: string[]
                sortBy?: {
                    [K in keyof SceneAnnotation.AnnotatingTask]?: number
                }
            }
            return: Paginate<SceneAnnotation.AnnotatingTask>
        },
        getAnnotatingTaskById: new class extends APIBase {
            readonly method = "POST"
            readonly path = "annotatingTask/:id/get"
            params: {
                id: ID
            }
            return: SceneAnnotation.AnnotatingTask
        },
        applyAnnotatingTask: new class extends APIBase {
            readonly method = "POST"
            readonly path = "annotatingTask/apply"
            body: {
                workerId: ID
            }
            return: boolean
        },
        pendingAnnotatingTask: new class extends APIBase {
            readonly method = "POST"
            readonly path = "annotatingTask/:id/pending"
            params: {
                id: ID
            }
            return: SceneAnnotation.AnnotatingTask
        },
        confirmAnnotatingTask: new class extends APIBase {
            readonly method = "POST"
            readonly path = "annotatingTask/:id/confirm"
            params: {
                id: ID
            }
            return: SceneAnnotation.AnnotatingTask
        },
        createTestData: new class extends APIBase {
            readonly method = "POST"
            readonly path = "annotatingTask/testData"
        },
    }
}



export abstract class CheckingTaskAPIServiceSpec extends RouteService<typeof CheckingTaskAPIService.API>{
    constructor() {
        super(CheckingTaskAPIService)
    }
}

namespace CheckingTaskAPIService {
    export const prefix = "/api/"
    export const name = "api.checkingTask"
    export const API = {
        queryCheckingTasks: new class extends APIBase {
            readonly method = "POST"
            readonly path = "checkingTask/paginate"
            body: PaginateQuery & {
                checkerId?: ID
                state?: string
                sortBy?: {
                    [K in keyof SceneAnnotation.CheckingTask]?: number
                }
            }
            return: Paginate<SceneAnnotation.CheckingTask>
        },
        applyCheckingTask: new class extends APIBase {
            readonly method = "POST"
            readonly path = "checkingTask/apply"
            body: {
                checkerId: ID
            }
            return: boolean
        },
        confirmCheckingTask: new class extends APIBase {
            readonly method = "POST"
            readonly path = "checkingTask/:id/confirm"
            params: {
                id: ID
            }
            body: {
                annotatingTaskId: ID
            }
            return: SceneAnnotation.CheckingTask
        },
    }
}


export abstract class FrameTaskAPIServiceSpec extends RouteService<typeof FrameTaskAPIService.API>{
    constructor() {
        super(FrameTaskAPIService)
    }
}
namespace FrameTaskAPIService {
    export const prefix = "/api/"
    export const name = "api.frameTask"
    export const API = {
        queryFrameTasks: new class extends APIBase {
            readonly method = "POST"
            readonly path = "frameTask/paginate"
            body: PaginateQuery & {
                taskId: string
                state?: string[]
                sortBy?: {
                    [K in keyof SceneAnnotation.Frame]?: number
                }
            }
            return: Paginate<SceneAnnotation.Frame>
        },
        updateFrameTask: new class extends APIBase {
            readonly method = "POST"
            readonly path = "frameTask/:id/update"
            params: {
                id: ID
            }
            body: {
                updates: Partial<SceneAnnotation.Frame>
            }
            return: SceneAnnotation.Frame
        },
        getFrameAnnotatesById: new class extends APIBase {
            readonly method = "POST"
            readonly path = "frameTask/:id/getById"
            params: {
                id: ID
            }
            return: SceneAnnotation.Annotation[]
        },
        getFrameTaskById: new class extends APIBase {
            readonly method = "POST"
            readonly path = "frameTask/:id/getFrame"
            params: {
                id: ID
            }
            return: SceneAnnotation.Frame
        },
        findFrameTasks: new class extends APIBase {
            readonly method = "POST"
            readonly path = "frameTask/find"
            body: {
                query: Partial<SceneAnnotation.Frame> & {
                    states?: string[]
                }
            }
            return: SceneAnnotation.Frame[]
        },
        getFramePoints: new class extends APIBase {
            readonly method = "POST"
            readonly path = "frameTask/getPoints"
            body: {
                filePath: string,
                frameIndex: number
            }
            return: Point[]
        },
        getBagInfo: new class extends APIBase {
            readonly method = "POST"
            readonly path = "frameTask/bagInfo"
            body: {
                filePath: string
            }
            return: BagInfo
        }
    }
}

export abstract class UserAPIServiceSpec extends RouteService<typeof UserAPIService.API>{
    constructor() {
        super(UserAPIService)
    }
}
namespace UserAPIService {
    export const prefix = "/api/"
    export const name = "api.user"
    export const API = {
        getUserById: new class extends APIBase {
            readonly method = "POST"
            readonly path = "user/:id/getUser"
            params: {
                id: ID
            }
            return: User
        },
        getUser: new class extends APIBase {
            readonly method = "POST"
            readonly path = "user/getUser"
            body: {
                username: string
                password: string
            }
            return: User
        },
        login: new class extends APIBase {
            readonly method = "POST"
            readonly path = "user/login"
            body: {
                username: string,
                password: string
            }
            return: User | { id: string, username: string }
        },
        logout: new class extends APIBase {
            readonly method = "DELETE"
            readonly path = "user/logout"
            return: true
        },

        getEnvironmentInformation: new class extends APIBase {
            readonly method = "POST"
            readonly path = "user/environment"
            info: {
                user: User
            }
            return: User
        }
    }
}