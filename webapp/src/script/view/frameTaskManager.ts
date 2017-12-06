import { App } from "../app"
import { SillyEditor } from "./base/sillyEditor"
import { DataListEditor } from "./dataListEditor"
import { FrameTaskStateMap } from "../dict"
import { AnnotationScene } from "./annotationScene"
import { ReAnnotaingScene } from "./reAnnotatingScene"
import { CheckingScene } from "./checkingScene"
import { getFileNameFromPath } from "../helpers"
export class FrameTaskManager extends R.FrameTask {
    frameTaskList: FrameTaskList
    constructor(option: {
        taskId: ID,
        listType: "annotate" | "check" | "detail"
        backURL?: string
    }) {
        super()
        let title = {
            "annotate": "标注任务帧列表",
            "check": "复查任务帧列表",
            "detail": "任务详情帧列表"
        }
        let listOption = {
            taskId: option.taskId,
            title: title[option.listType]
        }
        if (option.backURL) {
            listOption["backURL"] = option.backURL
        }
        switch (option.listType) {
            case "annotate":
                listOption["actions"] = {
                    annotate: {
                        displayText: "标注",
                        handler: ({ }, data) => {
                            //判断查看标注的frame所在的task处于哪个阶段,判断进入哪一个scene,
                            App.api.getAnnotatingTaskById({ id: data.taskId }, (err, result) => {
                                if (err) {
                                    console.error(err)
                                    return
                                }
                                let scene,
                                    taskState = result.state
                                if (taskState == "hasError") {//复查未通过再次标注
                                    scene = new ReAnnotaingScene({
                                        frameId: data.id,
                                        readonly: false
                                    }, () => {
                                        this.frameTaskList.refresh()
                                    })
                                } else {//正常标注
                                    scene = new AnnotationScene({
                                        frameId: data.id,
                                        readonly: false
                                    }, () => {
                                        this.frameTaskList.refresh()
                                    })
                                }
                                scene.appendTo(document.body)
                                scene.render()
                            })
                        }
                    }
                }
                break
            case "check":
                listOption["actions"] = {
                    annotate: {
                        displayText: "复查",
                        handler: ({ }, data) => {
                            let scene = new CheckingScene({
                                frameId: data.id,
                                readonly: false
                            }, () => {
                                this.frameTaskList.refresh()
                            })
                            scene.appendTo(document.body)
                            scene.render()
                        }
                    }
                }
                break
            case "detail":
                listOption["actions"] = {
                    annotate: {
                        displayText: "详情",
                        handler: ({ }, data) => {
                            App.api.getAnnotatingTaskById({ id: data.taskId }, (err, result) => {
                                if (err) {
                                    console.error(err)
                                    return
                                }
                                let checkingStates = ["checking", "hasError", "done"]
                                let scene,
                                    taskState = result.state
                                //判断查看详情的frame所在的task处于哪个阶段,判断进入哪一个scene,用来统一上下翻页scene为同一种scene
                                if (checkingStates.indexOf(taskState) > -1) {
                                    scene = new CheckingScene({
                                        frameId: data.id,
                                        readonly: true
                                    }, () => {
                                        this.frameTaskList.refresh()
                                    })
                                } else {
                                    scene = new AnnotationScene({
                                        frameId: data.id,
                                        readonly: true
                                    }, () => {
                                        this.frameTaskList.refresh()
                                    })
                                }
                                scene.appendTo(document.body)
                                scene.render()
                            })
                        }
                    }
                }
                listOption["readonly"] = true
                break
        }
        this.frameTaskList = new FrameTaskList(listOption)
    }
}

export class FrameTaskList extends DataListEditor<SceneAnnotation.Frame> {
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
        let taskId = this.definition.data.taskId
        let query = {
            pageIndex,
            pageSize,
            taskId: taskId,
            sortBy: { frameIndex: 1 }
        }
        // App.loading()
        App.api.queryFrameTasks(query, (error, paginate) => {
            // App.loading(false)
            if (error) {
                console.error(error)
                return
            }
            this.setValue(paginate.items)
            this.events.emit("refresh", { paginate })
        })
    }

    onClickBack() {
        App.openEntry(this.option.backURL)
    }

    constructor(public option: {
        taskId: ID,
        backURL?: string,
        readonly?: boolean,
        title: string,
        actions?: {
            [key: string]: {
                displayText: string
                handler: (editor: DataListEditor<SceneAnnotation.Frame>, data: SceneAnnotation.Frame) => void
            } | string
        }
    }) {
        super({
            title: option.title,
            backButton: true,
            // readonly: option.readonly,
            pagination: {
                pageIndex: 0,
                pageSize: 50,
                pageLimit: 5
            },
            table: {
                fields: {
                    taskId: "标注任务编号",
                    videoPath: "视频名称",
                    frameIndex: "帧位置",
                    state: "状态"
                },
                transform: {
                    state: value => {
                        return FrameTaskStateMap[value]
                    },
                    videoPath: value => {
                        return getFileNameFromPath(value)
                    }
                },
                actions: option.actions
            },
            data: {
                taskId: option.taskId
            }
        })
    }
}
