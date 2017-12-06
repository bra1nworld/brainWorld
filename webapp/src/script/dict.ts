///<reference path="spec/type.d.ts"/>
import { toNumberRange } from "./helpers"

// export interface DictItem<T = any> {
//     value: T
//     displayText: string
// }

export function arrayToDict(items: (number | string)[]): DictItem[] {
    return items.map(item => {
        return {
            value: item,
            displayText: `${item}`
        }
    })
}
export function objToDictReverse<T>(map: { [key: string]: T }): DictItem<T>[] {
    let keys = Object.keys(map)
    let value = keys.map(item => {
        return {
            displayText: map[item].toString(),
            value: (item as any) as T
        }
    })
    return value
}
export function objToDict<T>(map: { [key: string]: T }): DictItem<T>[] {
    let keys = Object.keys(map)
    let value = keys.map(item => {
        return {
            displayText: item,
            value: map[item]
        }
    })
    return value
}
export enum ObjectTypes {
    "rectangle" = 1,
    "points"
    // "car" = 1,
    // "van",
    // "bus",
    // "tractorTruckHead",
    // "emptyTrailer",
    // "trailerWithContainer",
    // "others"
}
export const ObjectTypesMap = {
    "rectangle": "rectangle",
    "points": "points"
    // "car": "小车",
    // "van": "小客车",
    // "bus": "大客车",
    // "tractorTruckHead": "卡车头",
    // "emptyTrailer": "空载卡车挂",
    // "trailerWithContainer": "有载卡车挂",
    // "others": "其他"
}
export const ObjectTypesDict: DictItem[] = objToDictReverse(
    ObjectTypesMap
)
export const isChecked = [
    {
        value: false,
        displayText: "待复查"
    },
    {
        value: true,
        displayText: "已复查"
    }
]

export const SexMap = {
    male: "男",
    female: "女"
}

export const BelongingsMap = {
    have: "有",
    none: "无"
}

export const UserAvailable = [
    {
        value: true,
        displayText: "正常"
    },
    {
        value: false,
        displayText: "冻结"
    }
]



export const UserSexMap: string[] = ["男", "女"]
export const UserSex: DictItem[] = arrayToDict(UserSexMap)



export const AnnotatingTaskStateMap = {
    created: "初始化",
    pending: "未分配",
    annotating: "待标注",
    annotated: "已标注",
    checking: "待复查",
    hasError: "复查未通过",
    done: "已完成"
}
export const AnnotatingTaskState: DictItem[] = objToDictReverse(
    AnnotatingTaskStateMap
)

export const FrameTaskStateMap = {
    pending: "待标注",
    annotated: "已标注",
    hasError: "复查未通过",
    done: "复查通过"
}
export const FrameTaskState: DictItem[] = objToDictReverse(
    FrameTaskStateMap
)
export const CheckingTaskStateMap = {
    checking: "待复查",
    checked: "已复查",

}
export const CheckingTaskState: DictItem[] = objToDictReverse(
    CheckingTaskStateMap
)
let syncErrorHintDictItem: DictItem = {
    displayText: "系统参数获取失败(请刷新后重试)",
    value: null
}

