import { PopupBehavior } from "../lib/behavior/popupBehavior"
export class ActionList extends R.ActionList {
    events
    constructor(readonly: boolean) {
        super()
        if (readonly) {
            this.VM.readonly = true
        }
        let actions = this.UI.actionList.children as any;
        for (let action of actions) {
            action.onclick = () => {
                this.events.emit("action", action.getAttribute("data-id"))
            }
        }
    }
    // asPopup = new PopupBehavior(this)
}
