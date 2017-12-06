import { PopupBehavior } from "../../lib/behavior/popupBehavior"
export class ActionList extends R.AnnotationScene.ActionList {
    events
    constructor(type: string) {
        super()
        this.VM.type = type
        let actions = this.UI.actionList.children as any;
        for (let action of actions) {
            action.onclick = () => {
                this.events.emit("action", action.getAttribute("data-id"))
            }
        }
    }
}
