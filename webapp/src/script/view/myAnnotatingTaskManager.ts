import { App } from "../app"
import { SillyEditor } from "./base/sillyEditor"
import { DataListEditor } from "./dataListEditor"
import { AnnotatingTaskStateMap } from "../dict"
import { SiteLayout } from "./siteLayout"
import { FrameTaskManager } from "./frameTaskManager"
import { getFileNameFromPath } from "../helpers"
export class MyAnnotatingTaskManager extends R.MyAnnotatingTask {
    myAnnotatingTaskList = new MyAnnotatingTaskList()
    constructor() {
        super()

    }
}

class MyAnnotatingTaskList extends DataListEditor<SceneAnnotation.AnnotatingTask> {
    url = "myAnnotatingTask"
    refresh(option: {
        query?: Partial<PaginateQuery>
    } = {
            query: {}
        }) {
        let { pageIndex, pageSize } = option.query
        if (!pageIndex && pageIndex !== 0) {
            pageIndex = this.pagination.getValue().pageIndex
        }
        let workerId = App.user.id
        pageSize = pageSize || this.pagination.getValue().pageSize
        let query = {
            pageIndex,
            pageSize,
            workerId: workerId,
            state: ["annotating", "hasError"]
            // sortBy: { state: -1 }
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
    onClickApply() {
        if (window.confirm("确定申请标注任务?")) {
            App.api.applyAnnotatingTask({
                workerId: App.user.id
            }, (err, result) => {
                if (err) {
                    console.error(err)
                    return
                }
                if (!result) {
                    alert("暂无未分配标注任务!")
                    return
                }
                this.refresh()
            })
        }

    }
    constructor() {
        super({
            title: "我的待标注任务",
            applyButton: true,
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

                    annotate: {
                        displayText: "标注",
                        handler: ({ }, data) => {
                            let frameTaskManager = new FrameTaskManager({
                                taskId: data.id,
                                backURL: this.url,
                                listType: "annotate"
                            })
                            App.siteLayout.visit(frameTaskManager.node)
                        }
                    },
                    conform: {
                        displayText: "提交标注",
                        handler: ({ }, data) => {
                            if (window.confirm("确定提交标注?")) {
                                App.api.confirmAnnotatingTask({
                                    id: data.id
                                }, (err, result) => {
                                    if (err) {
                                        console.error(err)
                                        return
                                    }
                                    if (!result) {
                                        alert("请先完成该标注任务的所有帧标注.")
                                        return
                                    }
                                    this.refresh()
                                })
                            }
                        }
                    }
                }
            }
        })
    }
}