export declare class Activable {
    private owner;
    isActive: boolean;
    events: Leaf.EventEmitter<{
        change: boolean;
        active: any;
        deactive: any;
    }>;
    constructor(owner: {
        asActivable: Activable;
        onActivate?: Function;
        onDeactivate?: Function;
        onActiveChange?: Function;
    }, isActive?: boolean);
    activate(): void;
    deactivate(): void;
}
