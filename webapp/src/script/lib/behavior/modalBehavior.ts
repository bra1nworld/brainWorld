import { PopupBehavior } from "./popupBehavior"
export class ModalBehavior {
    constructor(protected option: {
        node: HTMLElement
    }, protected widget: ModalBehaviorWidget = new ModalBehavior.TemplateWidget) {
        this.widget.UI.container.appendChild(this.option.node)
        ModalBehavior.events.emit("create", this)
    }
    asPopup = new PopupBehavior(this.widget)
    onClickClose() {
        this.asPopup.hide()
    }
    show() {
        this.asPopup.show()
    }
    hide() {
        this.asPopup.hide()
    }
    onClickCloseButton() {
        this.hide()
    }
    static TemplateWidget: WidgetConstructor
    static setTemplate(template: WidgetConstructor) {
        this.TemplateWidget = template
    }
    static events = new Leaf.EventEmitter<{
        create: ModalBehavior
    }>()
}

export interface WidgetConstructor {
    new(): ModalBehaviorWidget
}
export interface ModalBehaviorWidget {
    node: HTMLElement
    UI: {
        closeButton?: HTMLElement
        container: HTMLElement
    }

}
