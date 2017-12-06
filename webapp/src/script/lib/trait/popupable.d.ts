export declare class PopupStack {
    readonly base: number;
    index: number;
    popups: Popupable[];
    constructor(base?: number);
    add(p: Popupable): boolean;
    remove(p: Popupable): boolean;
}
export declare class Popupable {
    private widget;
    private manager;
    static globalManager: PopupStack;
    zIndex: number;
    isShow: boolean;
    constructor(widget: {
        node: HTMLElement;
        asPopup: Popupable;
    }, manager?: PopupStack);
    show(): void;
    hide(): void;
    center(): {
        x: number;
        y: number;
    };
}
