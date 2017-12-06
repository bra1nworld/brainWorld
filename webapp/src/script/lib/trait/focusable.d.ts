export interface ListItemFocusable extends Leaf.Widget {
    asFocusable?: Focusable;
}
export declare class ListFocusManager<T extends ListItemFocusable = ListItemFocusable> {
    list: Leaf.List<T>;
    events: Leaf.EventEmitter<{
        focus: T;
        blur: T;
    }>;
    currentFocus: T;
    constructor(list: Leaf.List<T>);
    focusAt(target: T): void;
}
export declare class Focusable {
    private owner;
    constructor(owner: {
        asFocusable: Focusable;
        onFocus?: Function;
        onBlur?: Function;
        onFocusChange?: Function;
    });
    events: Leaf.EventEmitter<{
        blur: any;
        focus: any;
    }>;
    isFocus: boolean;
    focus(): boolean;
    blur(): boolean;
}
