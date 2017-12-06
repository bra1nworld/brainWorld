import { CheckingScene } from "./checkingScene"
import { AnnotationScene, SmartPoints } from "./annotationScene"
import { AnnotationList } from "./annotationList"
import { ObjectTypesDict } from "../dict"
import { AnnotationTypeList } from "./annotationTypeList"
import { App } from "../app"
export class ReAnnotaingScene extends CheckingScene {
    currentTaskState: AnnotatingTaskState
    hasErrorUnchecked = false
    constructor(public option: {
        frameId: string,//保存annotations
        readonly: boolean//是否只读(详情)
    }, public callback: Callback<null>) {
        super(option, callback)
        this.VM.checkingScene = false
        this.VM.reAnnotaingScene = true
    }
    initAnnotationList() {
        this.createList = new AnnotationTypeList(ObjectTypesDict)
        this.annotationList = new AnnotationList(this as AnnotationScene, this.option.frameId, false, true)
        this.annotationList.events.listenBy(this, "initialized", () => {
            this.initAnnotations = this.annotationList.getAnnotations()
        })
    }

    submit(callback?: Callback) {
        let updateCheckingState: FrameState = "annotated"
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
            this.hasErrorUnchecked = true;
            alert("有错误未更正,请更正后再提交!")
            return
        }
        this.hasErrorUnchecked = false;
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

    replaceScene(newScene) {
        if (this.hasErrorUnchecked) return
        document.body.removeChild(document.querySelector(".annotating-scene"))
        newScene.appendTo(document.body)
        newScene.render()
    }
    createNewScene(option: {
        frameId: ID,
        readonly: boolean
    }) {
        return new ReAnnotaingScene({
            frameId: option.frameId,
            readonly: option.readonly
        }, this.callback)
    }
}