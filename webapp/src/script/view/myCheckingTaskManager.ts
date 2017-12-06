import { App } from "../app"
import { SillyEditor } from "./base/sillyEditor"
import { DataListEditor } from "./dataListEditor"
import { CheckingTaskStateMap } from "../dict"
import { toReadableDate } from "../helpers"
import { SiteLayout } from "./siteLayout"
import { FrameTaskManager } from "./frameTaskManager"
export class MyCheckingTaskManager extends R.MyCheckingTask {
    myCheckingTaskList = new MyCheckingTaskList()
    constructor() {
        super()
    }
}

class MyCheckingTaskList extends DataListEditor<SceneAnnotation.CheckingTask> {
    url = "myCheckingTask"
    refresh(option: {
        query?: Partial<PaginateQuery>
    } = {
            query: {}
        }) {
        let { pageIndex, pageSize } = option.query
        if (!pageIndex && pageIndex !== 0) {
            pageIndex = this.pagination.getValue().pageIndex
        }
        let checkerId = App.user.id
        pageSize = pageSize || this.pagination.getValue().pageSize
        let query = {
            pageIndex,
            pageSize,
            checkerId: checkerId,
            state: "checking"
            // sortBy: { state: -1 }
        }
        // App.loading()
        App.api.queryCheckingTasks(query, (error, paginate) => {
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
        if (window.confirm("确定申请待复查任务?")) {
            App.api.applyCheckingTask({
                checkerId: App.user.id
            }, (err, result) => {
                if (err) {
                    console.error(err)
                    return
                }
                if (!err && !result) {
                    alert("暂无可申请复查的标注任务!")
                    return
                }
                if (!err && result) {
                    this.refresh()
                }
            })
        }

    }
    constructor() {
        super({
            title: "我的待复查任务",
            applyButton: true,
            pagination: {
                pageIndex: 0,
                pageSize: 50,
                pageLimit: 5
            },
            table: {
                fields: {
                    annotatingTaskId: "标注任务编号",
                    startTime: "开始时间",
                    endTime: "结束时间",
                    checkerName: "复查人",
                    state: "复查状态",
                },
                transform: {
                    startTime: value => {
                        if (value) {
                            return toReadableDate(value, { precision: "minute" })
                        }
                    },
                    state: value => {
                        return CheckingTaskStateMap[value]
                    }
                },
                actions: {

                    annotate: {
                        displayText: "复查",
                        handler: ({ }, data) => {
                            let frameTaskManager = new FrameTaskManager({
                                taskId: data.annotatingTaskId,
                                backURL: this.url,
                                listType: "check"
                            })
                            App.siteLayout.visit(frameTaskManager.node)
                        }
                    },
                    conform: {
                        displayText: "提交复查",
                        handler: ({ }, data) => {
                            if (window.confirm("请确认是否提交复查!")) {
                                App.api.confirmCheckingTask({
                                    id: data.id,
                                    annotatingTaskId: data.annotatingTaskId
                                }, (err, result) => {
                                    if (err) {
                                        console.error(err)
                                        return
                                    }
                                    if (!err && !result) {
                                        alert("复查任务未完成,请确认后在提交!")
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