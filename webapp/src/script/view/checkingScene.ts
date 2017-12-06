import { AnnotationScene, SmartPoints } from "./annotationScene"
import { AnnotationList } from "./annotationList"
import { ObjectTypesDict } from "../dict"
import { AnnotationTypeList } from "./annotationTypeList"
import { App } from "../app"
export class CheckingScene extends AnnotationScene {
    currentTaskState: AnnotatingTaskState
    constructor(public option: {
        frameId: string,//保存annotations
        readonly: boolean//是否只读(详情)
    }, public callback: Callback<null>) {
        super(option, callback)
        this.initCheckingScene()
        this.VM.checkingScene = true
    }
    initCheckingScene() {
        App.api.getFrameTaskById({
            id: this.option.frameId
        }, (err, result) => {
            if (err) {
                console.error(err)
                return
            }
            this.UI.isMissed.checked = result.isMissed
        })
    }
    initAnnotationList() {
        this.createList = new AnnotationTypeList(ObjectTypesDict)
        this.annotationList = new AnnotationList(this as AnnotationScene, this.option.frameId, true, true)
        this.annotationList.events.listenBy(this, "initialized", () => {
            this.initAnnotations = this.annotationList.getAnnotations()
        })
    }

    save(callback?: Callback) {
        let annotations: SceneAnnotation.Annotation[] = this.annotationList.getAnnotations()
        this.events.emit("saving")
        App.api.updateFrameTask({
            id: this.option.frameId,
            updates: {
                annotations: annotations,
                isMissed: this.UI.isMissed.checked
            }
        }, (err, result) => {
            if (err) {
                console.error(err)
                return
            }
            this.events.emit("saved")
            callback()
        })
    }

    submit(callback?: Callback) {
        let updateCheckingState: FrameState
        let annotations: SceneAnnotation.Annotation[] = this.annotationList.getAnnotations()
        let hasError = false;
        if (this.UI.isMissed.checked) {
            hasError = true;
        }
        annotations.forEach(annotation => {
            if (annotation.invalid) {
                hasError = true;
            }
        })
        if (hasError) {
            updateCheckingState = "hasError"
        } else {
            updateCheckingState = "done"
        }
        this.events.emit("submitting")
        App.api.updateFrameTask({
            id: this.option.frameId,
            updates: {
                annotations: annotations,
                isMissed: this.UI.isMissed.checked,
                state: updateCheckingState
            }
        }, (err, result) => {
            if (err) {
                console.error(err)
                return
            }
            this.events.emit("submitted")
            callback()
        })
    }

    createNewScene(option: {
        frameId: ID,
        readonly: boolean
    }) {
        return new CheckingScene({
            frameId: option.frameId,
            readonly: option.readonly
        }, this.callback)
    }
}