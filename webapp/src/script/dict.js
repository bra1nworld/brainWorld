"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export interface DictItem<T = any> {
//     value: T
//     displayText: string
// }
function arrayToDict(items) {
    return items.map(function (item) {
        return {
            value: item,
            displayText: "" + item
        };
    });
}
exports.arrayToDict = arrayToDict;
function objToDictReverse(map) {
    var keys = Object.keys(map);
    var value = keys.map(function (item) {
        return {
            displayText: map[item].toString(),
            value: item
        };
    });
    return value;
}
exports.objToDictReverse = objToDictReverse;
function objToDict(map) {
    var keys = Object.keys(map);
    var value = keys.map(function (item) {
        return {
            displayText: item,
            value: map[item]
        };
    });
    return value;
}
exports.objToDict = objToDict;
var ObjectTypes;
(function (ObjectTypes) {
    ObjectTypes[ObjectTypes["rectangle"] = 1] = "rectangle";
    ObjectTypes[ObjectTypes["points"] = 2] = "points";
    // "car" = 1,
    // "van",
    // "bus",
    // "tractorTruckHead",
    // "emptyTrailer",
    // "trailerWithContainer",
    // "others"
})(ObjectTypes = exports.ObjectTypes || (exports.ObjectTypes = {}));
exports.ObjectTypesMap = {
    "rectangle": "rectangle",
    "points": "points"
    // "car": "小车",
    // "van": "小客车",
    // "bus": "大客车",
    // "tractorTruckHead": "卡车头",
    // "emptyTrailer": "空载卡车挂",
    // "trailerWithContainer": "有载卡车挂",
    // "others": "其他"
};
exports.ObjectTypesDict = objToDictReverse(exports.ObjectTypesMap);
exports.isChecked = [
    {
        value: false,
        displayText: "待复查"
    },
    {
        value: true,
        displayText: "已复查"
    }
];
exports.SexMap = {
    male: "男",
    female: "女"
};
exports.BelongingsMap = {
    have: "有",
    none: "无"
};
exports.UserAvailable = [
    {
        value: true,
        displayText: "正常"
    },
    {
        value: false,
        displayText: "冻结"
    }
];
exports.UserSexMap = ["男", "女"];
exports.UserSex = arrayToDict(exports.UserSexMap);
exports.AnnotatingTaskStateMap = {
    created: "初始化",
    pending: "未分配",
    annotating: "待标注",
    annotated: "已标注",
    checking: "待复查",
    hasError: "复查未通过",
    done: "已完成"
};
exports.AnnotatingTaskState = objToDictReverse(exports.AnnotatingTaskStateMap);
exports.FrameTaskStateMap = {
    pending: "待标注",
    annotated: "已标注",
    hasError: "复查未通过",
    done: "复查通过"
};
exports.FrameTaskState = objToDictReverse(exports.FrameTaskStateMap);
exports.CheckingTaskStateMap = {
    checking: "待复查",
    checked: "已复查",
};
exports.CheckingTaskState = objToDictReverse(exports.CheckingTaskStateMap);
var syncErrorHintDictItem = {
    displayText: "系统参数获取失败(请刷新后重试)",
    value: null
};
