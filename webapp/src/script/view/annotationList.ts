import { ListDataProvider } from "../lib/component/dataProvider"
import { AnnotationScene, Interactable } from "./annotationScene"
import { AnnotationInfoEditor, AnnotationCreateEditor } from "./editors"
import { App } from "../app"
import { uuid } from "../helpers"
import { ObjectTypes, ObjectTypesMap } from "../dict"
import { ActionList } from "./actionList"
import { PointsInteractable, InteractableAnnotationGeometry } from "./interactable"
export class AnnotationList extends R.AnnotationList {
    provider
    events = new Leaf.EventEmitter<{
        initialized
    }>()
    constructor(public scene: AnnotationScene, public frameId: ID, public readonly: boolean, public checkingList?: boolean) {
        super()
        this.init()
    }
    annotationList: Leaf.List<AnnotationListItem> | Leaf.List<CheckingAnnotationListItem>
    init() {
        //处理annotation-list-item数据
        if (this.checkingList) {
            this.provider = new ListDataProvider({
                list: this.annotationList,
                fetcher: App.api.getFrameAnnotatesById.with({
                    id: this.frameId
                }),
                readonly: this.readonly,
                Item: CheckingAnnotationListItem
            })
        } else {
            this.provider = new ListDataProvider({
                list: this.annotationList,
                fetcher: App.api.getFrameAnnotatesById.with({
                    id: this.frameId
                }),
                readonly: this.readonly,
                Item: AnnotationListItem
            })
        }
        this.provider.events.listenBy(this, "finished", () => {
            this.events.emit("initialized")
        })
        this.scene.createList.events.listenBy(this, "click", (value) => {
            this.createItem(value)
        })

    }
    onChildAddAnnotationList(child: AnnotationListItem | CheckingAnnotationListItem) {
        child.events.listenBy(this, "activate", () => {
            this.choose(child)
        })
        child.events.listenBy(this, "remove", () => {
            this.annotationList.removeItem(child)
        })
        child.attach(this.scene)
        child.show()
    }
    onChildRemoveAnnotationList(child: AnnotationListItem | CheckingAnnotationListItem) {
        child.events.stopListenBy(this)
    }
    choose(child: AnnotationListItem | CheckingAnnotationListItem) {
        child.show()
        if (this.current == child) return
        if (this.current) this.current.deactivate()
        this.current = child
        child.show()
        child.activate()
    }
    createItem(objectType) {
        let editor = new AnnotationCreateEditor()
        let id = uuid()
        // editor.edit({
        //     id: id,
        //     objectType: objectType,
        //     type: "rectangle",
        //     geometry: null,
        //     color: "#" + Math.floor((Math.random() * 256 * 256 * 256)).toString(16)
        // }, (err, result) => {
        //     if (result) {

        //         result.objectType = ObjectTypes[result.objectType] as any
        //         let item = this.provider.insert(result)
        //         this.choose(item)
        //     }
        // })
        let result = {
            id: id,
            objectType: objectType,
            type: "rectangle",
            geometry: null,
            color: "#" + this.createRandomColor()
        }
        result.objectType = ObjectTypes[result.objectType] as any
        let item = this.provider.insert(result)
        this.choose(item)
    }

    createRandomColor() {
        let color = Math.floor((Math.random() * 256 * 256 * 256)).toString(16)
        while (color.length < 6) {
            color += Math.floor((Math.random() * 16)).toString(16)
        }
        return color
    }

    public current: AnnotationListItem | CheckingAnnotationListItem

    getAnnotations() {
        return this.annotationList.map(item => item.toAnnotation())
    }
}
export class AnnotationListItem extends R.AnnotationList.AnnotationListItem {
    actionList: ActionList
    constructor(public annotation: SceneAnnotation.Annotation, public readonly: boolean) {
        super()
        this.actionList = new ActionList(readonly);
        this.sphere = InteractableAnnotationGeometry.fromJSON(this.annotation, this.actionList, readonly)
        this.render()
    }
    sphere: InteractableAnnotationGeometry
    render() {
        this.sphere.setMeta({ color: this.annotation.color })
        this.sphere.redraw()
        this.UI.hasError.checked = this.annotation.invalid
        this.UI.colorBlock.style.background = this.sphere.data.color
        this.VM.objectTypeIndex = ObjectTypesMap[ObjectTypes[this.annotation.objectType]]
    }
    onClickEdit() {
        this.edit()
    }
    onClickRemove() {
        if (window.confirm("确定删除?")) {
            this.detach(this.scene)
            this.events.emit("remove")
        }
    }
    edit() {
        let editor = new AnnotationCreateEditor()
        let info = this.annotation
        info.objectType = ObjectTypes[info.objectType] as any
        editor.edit(info, (err, result) => {
            console.log("Finishe dtir,result", result)
            if (result) {
                result.objectType = ObjectTypes[result.objectType] as any
                this.annotation = result
                this.render()
                this.events.emit("change")
            }
        })
    }
    events = new Leaf.EventEmitter<{
        activate
        deactivate
        show
        hide
        change
        remove
    }>()
    scene: AnnotationScene
    attach(scene: AnnotationScene) {
        this.scene = scene
        this.sphere.attach(scene)
    }
    detach(scene: AnnotationScene) {
        if (this.scene !== scene) return
        this.sphere.detach()
    }
    deactivate() {
        if (!this.VM.active) return
        this.VM.active = false
        this.actionList.VM.active = false
        this.events.emit("deactivate")
        this.sphere.deactivate()
    }
    activate() {
        if (this.VM.active) return
        this.VM.active = true
        this.actionList.VM.active = true
        this.render()
        this.events.emit("activate")
        this.sphere.activate()
    }
    onClickShow() {
        let value = this.VM.show
        if (value) {
            this.hide()
        } else {
            this.show()
        }
    }
    private isShow = false
    show() {
        if (this.isShow) return
        this.isShow = true
        this.VM.show = true
        this.sphere.show()
        this.events.emit("show")
    }
    hide() {
        if (!this.isShow) return
        this.isShow = false
        this.VM.show = false
        this.sphere.hide()
        this.events.emit("hide")
    }
    onClickNode() {
        if (!this.VM.active) {
            console.log("activate?")
            this.activate()
        }
    }
    toAnnotation(): SceneAnnotation.Annotation {
        let ann = this.sphere.toJSON()
        ann.objectType = this.annotation.objectType
        return ann
    }
}

export class CheckingAnnotationListItem extends AnnotationListItem {
    constructor(public annotation: SceneAnnotation.Annotation, public readonly: boolean) {
        super(annotation, readonly)
        this.VM.checkingList = true
    }
    render() {
        // this.VM.name = this.annotation.name
        if (this.annotation.invalid) {
            this.UI.hasError.checked = this.annotation.invalid
        }
        this.VM.objectTypeIndex = ObjectTypesMap[ObjectTypes[this.annotation.objectType]]
        this.sphere.setMeta({ color: this.annotation.color })
        this.sphere.redraw()
        this.UI.colorBlock.style.background = this.sphere.data.color
    }
    toAnnotation(): SceneAnnotation.Annotation {
        let ann = this.sphere.toJSON()
        ann.objectType = this.annotation.objectType
        ann.invalid = this.UI.hasError.checked
        return ann
    }
}
