import { App } from "../app"
import { SillyEditor } from "./base/sillyEditor"
import { DataListEditor } from "./dataListEditor"
import { AnnotatingTaskStateMap } from "../dict"
import { FrameTaskManager } from "./frameTaskManager"
import { getFileNameFromPath } from "../helpers"
export class PendingTaskManager extends R.PendingTask {
    pendingTaskList = new PendingTaskList()
    constructor() {
        super()
        let initData = function () {
            App.api.createTestData(null, () => {

            })
        }
        window["initData"] = initData
    }
}

class PendingTaskList extends DataListEditor<SceneAnnotation.AnnotatingTask> {
    url = "pendingTask"
    refresh(option: {
        query?: Partial<PaginateQuery>
    } = {
            query: {}
        }) {
        let { pageIndex, pageSize } = option.query
        if (!pageIndex && pageIndex !== 0) {
            pageIndex = this.pagination.getValue().pageIndex
        }
        pageSize = pageSize || this.pagination.getValue().pageSize
        let query = {
            pageIndex,
            pageSize,
            state: ["pending"],
            sortBy: { videoPath: -1 }
        }
        // App.loading()
        App.api.queryAnnotatingTasks(query, (error, paginate) => {
            // App.loading(false)
            if (error) {
                console.error(error)
                return
            }
            this.setValue(paginate.items)
            this.events.emit("refresh", { paginate })
        })
    }

    constructor() {
        super({
            title: "未分配任务",
            pagination: {
                pageIndex: 0,
                pageSize: 50,
                pageLimit: 5
            },
            table: {
                fields: {
                    id: "标注任务编号",
                    videoPath: "视频名称",
                    startFrame: "开始帧",
                    frameCount: "标注帧数",
                    paddingSize: "帧间隔",
                    errorInfo: "错误信息",
                    workerName: "标注人",
                    checkCount: "复查次数",
                    state: "状态"
                },
                transform: {
                    state: value => {
                        return AnnotatingTaskStateMap[value]
                    },
                    videoPath: value => {
                        return getFileNameFromPath(value)
                    }
                },
                actions: {
                    detail: {
                        displayText: "详情",
                        handler: ({ }, data) => {
                            let frameTaskManager = new FrameTaskManager({
                                taskId: data.id,
                                backURL: this.url,
                                listType: "detail"
                            })
                            App.siteLayout.visit(frameTaskManager.node)
                        }
                    }
                }
            }
        })
    }
}
