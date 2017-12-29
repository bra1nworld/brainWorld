type Callback<T> = (err?: Error, result?: T) => void
interface PaginateQuery {
    // which page
    pageIndex: number
    // how many item perpage
    pageSize?: number
}

type Paginate<T> = {
    items: T[]
    pageTotal: number
    pageIndex: number
    total: number
}

interface BagInfo {
    frameCount?: number
}

interface Dict {
    name: string,
    items?: DictItem[]
}
interface DictItem<T = any> {
    value: T
    displayText: string
}

type ID = string
type AnnotationTargetType = string
type Role = "admin" | "worker" | "checker"

type FrameState = "pending" | "annotated" | "hasError" | "done"
//                 待标注    | 已标注(待复查) | 复查未通过   |  复查通过

type AnnotatingTaskState = "created" | "pending" | "annotating" | "annotated" | "checking" | "hasError" | "done"
//                         初始化生成  | 未分配     | 待标注(标注中)|待申请复查(已标注)|待复查     | 复查未通过   |已完成
/*4个阶段{
            未分配:["pending"]
            标注阶段:[ "annotating","hasError" ]
            复查阶段:["annotated" ,"checking"]
            已完成:["done"]
        }
        */

type Point = SceneAnnotation.Vector3

interface Privilege {
    pendingTask?: boolean,
    annotatingTask?: boolean,
    checkAnnotatedTask?: boolean,
    doneTask?: boolean,
    myAnnotatingTask?: boolean,
    myAnnotatedTask?: boolean,
    myCheckingTask?: boolean
    myCheckedTask?: boolean,
    userManagement?: boolean
}


declare namespace SceneAnnotation {
    interface Vector3 {
        x: number
        y: number
        z: number
    }
    interface Vector2 {
        x: number
        y: number
    }
    interface RectAngleInfo {
        // xDistance: number
        // yDistance: number
        // zDistance: number
        // centerPosition: Vector3
        // rotateYAngle: number
        dims: number[]//x,y,z distance
        pose: number[]//中心坐标和旋转平移，[x, y, z, qw, qx, qy, qz]
        cubeMaterial: {
            color: string,
            wireframe: boolean
        }
    }
    interface ArrawInfo {
        ringPoints: Vector2[]
        faceCenterPoint: {
            xNegative: Vector3
            xPositive: Vector3
            yNegative: Vector3
            yPositive: Vector3
        }
    }
    interface Rectangle {
        rectAngleInfo: RectAngleInfo
        arrawInfo: ArrawInfo
    }

    interface RawScene {
        id: string
        frames?: Frame[]
        length?: number
    }

    namespace Annotation {
        interface Box {
            type: "box"
            position: Vector3
            size: Vector3
        }
        interface Ball {
            type: "ball"
            position: Vector3
            size: Vector3
        }
        interface Rectangle {
            type: "rectangle"
            rectAngleInfo: RectAngleInfo
            arrawInfo: ArrawInfo
        }
        interface Points {
            type: "points"
            pointIndice: number[]
        }
        type Geometry = Box | Ball | Points | Rectangle
    }
    interface AnnotationBox {
        id: ID
        type: string//"box"
        label: number
        box: Rectangle
        color: string
        invalid?: boolean
    }
    interface AnnotationGroup {
        id: ID
        type: string//"group"
        label: number
        children?: AnnotationBox[]
    }

    interface Video {
        id: ID
        path: string
        frameCount?: number
    }
    interface AnnotatingTask {//annotation task
        id: ID
        videoPath: string//videoPath,startFrame bind unique
        startFrame: number
        frameCount: number
        paddingSize: number
        workerId?: ID
        workerName?: string
        errorInfo?: string
        checkCount: number
        state: AnnotatingTaskState
    }
    interface CheckingTask {
        id: ID
        annotatingTaskId: ID
        startTime: Date
        endTime: Date
        annotationErrors?: {
            frameId: ID
            annotation: Annotation
        }[]
        checkerId?: ID
        checkerName?: string
        frameErrors?: ID[]
        state: "checking" | "checked"
    }
    interface Frame {
        id: ID
        taskId: string
        videoPath: string
        frameIndex: number
        isMissed?: boolean
        annotations: Annotation[]
        state: FrameState
    }
}


interface User {
    id: ID
    username: string
    password?: string
    passwordHash?: string
    role: Role
    meta?: {
        realName: string
        phone?: string
    }
}
