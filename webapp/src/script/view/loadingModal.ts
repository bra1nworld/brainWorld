import { Popupable } from "../lib/trait/popupable"
export class LoadingModal extends R.LoadingModal {
    asPopup: Popupable = new Popupable(this)
    show() {
        this.asPopup.zIndex = 9999
        this.asPopup.show()
    }
    hide() {
        this.asPopup.hide()
    }
}