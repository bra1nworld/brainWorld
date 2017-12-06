export declare class PopupStack {
    readonly base: number;
    index: number;
    popups: PopupBehavior[];
    constructor(base?: number);
    add(p: PopupBehavior): boolean;
    remove(p: PopupBehavior): boolean;
}
export declare class PopupBehavior {
    private widget;
    private manager;
    static globalManager: PopupStack;
    zIndex: number;
    isShow: boolean;
    constructor(widget: {
        node: HTMLElement;
    }, manager?: PopupStack);
    show(): void;
    hide(): void;
    center(): {
        x: number;
        y: number;
    };
}
