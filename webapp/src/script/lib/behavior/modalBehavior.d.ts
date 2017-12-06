import { PopupBehavior } from "./popupBehavior";
export declare class ModalBehavior {
    protected option: {
        node: HTMLElement;
    };
    protected widget: ModalBehaviorWidget;
    constructor(option: {
        node: HTMLElement;
    }, widget?: ModalBehaviorWidget);
    asPopup: PopupBehavior;
    onClickClose(): void;
    show(): void;
    hide(): void;
    onClickCloseButton(): void;
    static TemplateWidget: WidgetConstructor;
    static setTemplate(template: WidgetConstructor): void;
    static events: Leaf.EventEmitter<{
        create: ModalBehavior;
    }>;
}
export interface WidgetConstructor {
    new (): ModalBehaviorWidget;
}
export interface ModalBehaviorWidget {
    node: HTMLElement;
    UI: {
        closeButton?: HTMLElement;
        container: HTMLElement;
    };
}
