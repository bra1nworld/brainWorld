export interface HistoryStateInfo {
    fromWhere: "hijacked" | "none" | "void";
}
export declare class HistoryState extends Leaf.States<string, {
    popstate;
    goto;
}> {
    history: History;
    events: Leaf.EventEmitter<{
        goto: string;
        reset: void;
        state: string;
    }>;
    constructor(history: History);
    private browserHistory;
    protected data: {
        goto?: GotoInfo;
    };
    atInitActivating(): void;
    atHijacking(): void;
    atAppendVoid(): void;
    atWaiting(stale: any): void;
    atGoto(stale: any): void;
    atApplyGotoUrl(): void;
    atBack(): void;
    atApplyBack(): void;
    atRetire(): void;
}
export declare class History {
    static instance: History;
    stack: BackButtonInfo[];
    events: Leaf.EventEmitter<{
        goto: string;
    }>;
    state: HistoryState;
    constructor();
    goto(url: string, silent?: boolean): void;
    registerBackButton(id: any, handler: Function): void;
    removeBackButton(id: any): void;
    getLocation(): string;
    pop(): boolean;
    popAll(): void;
}
export interface BackButtonInfo {
    id: any;
    handler: Function;
}
export interface GotoInfo {
    url: string;
    silent: boolean;
}
