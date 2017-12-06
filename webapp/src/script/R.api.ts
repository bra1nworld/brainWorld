export function GenerateEchoAPIService<T extends (new (...args: any[]) => {}) = new (...args: any[]) => {}>(factory: Leaf.APIFactory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }), Base: T = class { } as any) {
    return class extends Base {
        public factory = factory
        echo = factory.createAPIFunction<{
            name: string
        } & {
                content: string
            }, {
                name: string
                content: string
            }>({
                method: "POST",
                path: "echo/:name/GET"
            })
    }
}
export function GenerateAnnotationAPIService<T extends (new (...args: any[]) => {}) = new (...args: any[]) => {}>(factory: Leaf.APIFactory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }), Base: T = class { } as any) {
    return class extends Base {
        public factory = factory
        getSceneFrameAnnotations = factory.createAPIFunction<{
            sceneId: string
            frameIndex: string
        }, SceneAnnotation.Annotation[]>({
            method: "POST",
            path: "annotation/:sceneId/:frameIndex/GET"
        })
        saveFrameAnnotation = factory.createAPIFunction<{
            sceneId: string
            frameIndex: string
        } & {
                annotations: SceneAnnotation.Annotation[]
            }, {
            }>({
                method: "PUT",
                path: "annotation/:sceneId/:frameIndex"
            })
    }
}
export function GenerateSceneFrameAPIService<T extends (new (...args: any[]) => {}) = new (...args: any[]) => {}>(factory: Leaf.APIFactory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }), Base: T = class { } as any) {
    return class extends Base {
        public factory = factory
        getSceneFrame = factory.createAPIFunction<{
            sceneId: string
            frameIndex: string
        }, SceneAnnotation.Frame>({
            method: "POST",
            path: "frame/:sceneId/:frameIndex"
        })
        getUnannotatedSceneFrame = factory.createAPIFunction<{
            offset: number
            count: number
        }, SceneAnnotation.Frame[]>({
            method: "POST",
            path: "frame"
        })
    }
}
export function GenerateAnnotatingTaskAPIService<T extends (new (...args: any[]) => {}) = new (...args: any[]) => {}>(factory: Leaf.APIFactory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }), Base: T = class { } as any) {
    return class extends Base {
        public factory = factory
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
        getAnnotatingTaskById = factory.createAPIFunction<{
            id: ID
        }, SceneAnnotation.AnnotatingTask>({
            method: "POST",
            path: "annotatingTask/:id/get"
        })
        applyAnnotatingTask = factory.createAPIFunction<{
            workerId: ID
        }, boolean>({
            method: "POST",
            path: "annotatingTask/apply"
        })
        pendingAnnotatingTask = factory.createAPIFunction<{
            id: ID
        }, SceneAnnotation.AnnotatingTask>({
            method: "POST",
            path: "annotatingTask/:id/pending"
        })
        confirmAnnotatingTask = factory.createAPIFunction<{
            id: ID
        }, SceneAnnotation.AnnotatingTask>({
            method: "POST",
            path: "annotatingTask/:id/confirm"
        })
        createTestData = factory.createAPIFunction<{}, {
        }>({
            method: "POST",
            path: "annotatingTask/testData"
        })
    }
}
export function GenerateCheckingTaskAPIService<T extends (new (...args: any[]) => {}) = new (...args: any[]) => {}>(factory: Leaf.APIFactory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }), Base: T = class { } as any) {
    return class extends Base {
        public factory = factory
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
        } & {
                annotatingTaskId: ID
            }, SceneAnnotation.CheckingTask>({
                method: "POST",
                path: "checkingTask/:id/confirm"
            })
    }
}
export function GenerateFrameTaskAPIService<T extends (new (...args: any[]) => {}) = new (...args: any[]) => {}>(factory: Leaf.APIFactory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }), Base: T = class { } as any) {
    return class extends Base {
        public factory = factory
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
        updateFrameTask = factory.createAPIFunction<{
            id: ID
        } & {
                updates: Partial<SceneAnnotation.Frame>
            }, SceneAnnotation.Frame>({
                method: "POST",
                path: "frameTask/:id/update"
            })
        getFrameAnnotatesById = factory.createAPIFunction<{
            id: ID
        }, SceneAnnotation.Annotation[]>({
            method: "POST",
            path: "frameTask/:id/getById"
        })
        getFrameTaskById = factory.createAPIFunction<{
            id: ID
        }, SceneAnnotation.Frame>({
            method: "POST",
            path: "frameTask/:id/getFrame"
        })
        findFrameTasks = factory.createAPIFunction<{
            query: Partial<SceneAnnotation.Frame> & {
                states?: string[]
            }
        }, SceneAnnotation.Frame[]>({
            method: "POST",
            path: "frameTask/find"
        })
        getFramePoints = factory.createAPIFunction<{
            filePath: string
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
    }
}
export function GenerateUserAPIService<T extends (new (...args: any[]) => {}) = new (...args: any[]) => {}>(factory: Leaf.APIFactory = new Leaf.APIFactory({ prefix: "/api/", bodyType: "json" }), Base: T = class { } as any) {
    return class extends Base {
        public factory = factory
        getUserById = factory.createAPIFunction<{
            id: ID
        }, User>({
            method: "POST",
            path: "user/:id/getUser"
        })
        getUser = factory.createAPIFunction<{
            username: string
            password: string
        }, User>({
            method: "POST",
            path: "user/getUser"
        })
        login = factory.createAPIFunction<{
            username: string
            password: string
        }, User | { id: string, username: string }>({
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
}
