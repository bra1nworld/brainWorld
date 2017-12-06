import { App } from "../app"
import { SillyEditor } from "./base/sillyEditor"
import { DataListEditor } from "./dataListEditor"
import { CheckingTaskStateMap } from "../dict"
import { toReadableDate } from "../helpers"
import { SiteLayout } from "./siteLayout"
import { FrameTaskManager } from "./frameTaskManager"
export class MyCheckedTaskManager extends R.MyCheckedTask {
    myCheckedTaskList = new MyCheckedTaskList()
    constructor() {
        super()
    }
}

class MyCheckedTaskList extends DataListEditor<SceneAnnotation.CheckingTask> {
    url = "myCheckedTask"
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
            state: "checked"
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

    constructor() {
        super({
            title: "我的已复查任务",
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
                    endTime: value => {
                        if (value) {
                            return toReadableDate(value, { precision: "minute" })
                        }
                    },
                    state: value => {
                        return CheckingTaskStateMap[value]
                    }
                },
                actions: {
                    info: {
                        displayText: "详情",
                        handler: ({ }, data) => {
                            let frameTaskManager = new FrameTaskManager({
                                taskId: data.annotatingTaskId,
                                backURL: this.url,
                                listType: "detail"
                            })
                            App.siteLayout.visit(frameTaskManager.node)
                        }
                    },
                }
            }
        })
    }
}