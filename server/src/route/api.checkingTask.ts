import * as Leaf from "leaf-ts"
import * as RouteSpec from "../spec/route"
import { Errors } from "../errors"
export class CheckingTaskAPIService extends RouteSpec.CheckingTaskAPIServiceSpec {
    initialize() {
        this.api("queryCheckingTasks", (ctx) => {
            this.services.CheckingTaskService.queryCheckingTasks(ctx.body, (err, result) => {
                if (err) {
                    console.log(err)
                    ctx.done(err, null)
                    return
                }
                ctx.done(err, result)
            })
        })

        this.api("applyCheckingTask", (ctx) => {
            this.services.AnnotatingTaskService.findAnnotatingTasks({
                state: "annotated"
            }, (err, annotatingTasks) => {
                if (err) {
                    console.log(err)
                    ctx.done(err, true)
                    return
                }
                if (annotatingTasks.length < 1) {
                    ctx.done(null, false)
                    return
                }
                let task = annotatingTasks[0]
                this.services.AnnotatingTaskService.updateAnnotatingTaskById({
                    id: task.id,
                    updates: { state: "checking" }
                }, (err, updateResult) => {
                    if (err) {
                        console.log(err)
                        ctx.done(err, true)
                        return
                    }
                    this.services.UserService.getUserById({ id: ctx.body.checkerId }, (err, user) => {
                        if (err) {
                            console.log(err)
                            ctx.done(err, true)
                            return
                        }
                        this.services.CheckingTaskService.createCheckingTask({
                            annotatingTaskId: task.id,
                            checkerId: ctx.body.checkerId,
                            checkerName: user.username
                        }, (err, result) => {
                            if (err) {
                                console.log(err)
                                ctx.done(err, true)
                                return
                            }
                            ctx.done(null, true)
                        })
                    })

                })
            })
        })

        this.api("confirmCheckingTask", (ctx) => {
            this.confirmCheckingTask(ctx)
        })

        this.installTo(this.services.ExpressService.server)
    }

    async confirmCheckingTask(ctx) {
        await this.findFrameUncheckedTasks(ctx);
        let frames = await this.findFrameHasErrorTasks(ctx) as any;
        let hasErrorResult = frames as SceneAnnotation.Frame[];
        let tasks = await this.getCurrentAnnotationTask(ctx) as any
        let currentAnnotationTask = tasks as SceneAnnotation.AnnotatingTask

        let annotationTaskUpdates;
        let checkTaskUpdates: Partial<SceneAnnotation.CheckingTask> = {
            state: "checked",
            endTime: new Date(),
            annotationErrors: [],
            frameErrors: []
        };
        if (hasErrorResult.length > 0) {
            annotationTaskUpdates = { state: "hasError" } as Partial<SceneAnnotation.AnnotatingTask>

            hasErrorResult.forEach(frame => {
                if (frame.isMissed) {
                    checkTaskUpdates.frameErrors.push(frame.id)
                }
                frame.annotations.forEach(annotation => {
                    if (annotation.invalid) {
                        checkTaskUpdates.annotationErrors.push({
                            frameId: frame.id,
                            annotation: annotation
                        })
                    }
                })
            })
        } else {
            annotationTaskUpdates = { state: "done" } as Partial<SceneAnnotation.AnnotatingTask>
        }

        annotationTaskUpdates["checkCount"] = currentAnnotationTask.checkCount + 1
        let errorInfo = ""
        if (checkTaskUpdates.frameErrors.length > 0) {
            errorInfo += "标注缺失"
            if (checkTaskUpdates.annotationErrors.length > 0) {
                errorInfo += ","
            }
        }
        if (checkTaskUpdates.annotationErrors.length > 0) {
            errorInfo += "标注错误"
        }
        annotationTaskUpdates["errorInfo"] = errorInfo
        let updateAnnotationTaskOption = {
            "id": ctx.body.annotatingTaskId,
            "updates": annotationTaskUpdates
        }
        await this.updateCurrentAnnotationTask(ctx, updateAnnotationTaskOption);

        let updateCheckTaskOption = {
            id: ctx.params.id,
            updates: checkTaskUpdates
        }
        await this.updateCheckingTask(ctx, updateCheckTaskOption)
    }

    //检测frames是否都复查过
    findFrameUncheckedTasks(ctx) {
        return new Promise((resolve) => {
            this.services.FrameTaskService.findFrameTasks({
                taskId: ctx.body.annotatingTaskId,
                states: ["annotated", "checking"]
            }, (err, result) => {
                if (err) {
                    console.log(err)
                    ctx.done(new Errors.UnknownError("Faild to find annotated or checking annotatingTask", { via: err }), null)
                    return
                }
                if (result.length > 0) {
                    console.log(">>>>00000")
                    ctx.done(null, null)
                    return
                }
                resolve()
            })
        })
    }

    //根据frames复查结果判断state为hasError或者done
    findFrameHasErrorTasks(ctx) {
        return new Promise((resolve) => {
            this.services.FrameTaskService.findFrameTasks({
                taskId: ctx.body.annotatingTaskId,
                states: ["hasError"]
            }, (err, result) => {
                if (err) {
                    ctx.done(new Errors.UnknownError("Faild to find hasError annotatingTask", { via: err }), null)
                    return
                }
                resolve(result)
            })
        })
    }

    //查询当前annotationTask,获得其复查次数
    getCurrentAnnotationTask(ctx) {
        return new Promise((resolve) => {
            this.services.AnnotatingTaskService.getAnnotatingTaskById({ id: ctx.body.annotatingTaskId }, (err, result) => {
                if (err) {
                    console.log(err)
                    ctx.done(new Errors.UnknownError("Faild to get annotatingTask", { via: err }), null)
                    return
                }
                resolve(result)
            })
        })
    }

    //更新annotationTask状态及复查次数
    updateCurrentAnnotationTask(ctx, option) {
        return new Promise((resolve) => {
            this.services.AnnotatingTaskService.updateAnnotatingTaskById(option, (err, result) => {
                console.log("*-*")
                console.log(option)
                if (err) {
                    console.log(err)
                    ctx.done(new Errors.UnknownError("Faild to  update annotatingTask", { via: err }), null)
                    return
                }
                console.log(result)
                resolve(result)
            })
        })
    }

    //更新checkingTask状态为checked及复查完成时间
    updateCheckingTask(ctx, option) {
        return new Promise((resolve) => {
            this.services.CheckingTaskService.updateCheckingTaskById(option, (err, result) => {
                if (err) {
                    console.log(err)
                    ctx.done(new Errors.UnknownError("Faild to create update checkingTask", { via: err }), null)
                    return
                }
                ctx.done(err, result)
                resolve()
            })
        })
    }
}
