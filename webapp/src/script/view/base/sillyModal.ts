import { PopupBehavior } from "../../lib/behavior/popupBehavior"
export class SillyModal extends R.Base.SillyModal {
    constructor(protected option: {
        node: HTMLElement
    }) {
        super()
        this.UI.dialog.appendChild(this.option.node)
        this.option.node.className = this.option.node.className + " content-area"
    }
    asPopup = new PopupBehavior(this)
    onClickClose() {
        this.asPopup.hide()
    }
    show() {
        this.asPopup.show()
    }
    hide() {
        this.asPopup.hide()
    }
}
