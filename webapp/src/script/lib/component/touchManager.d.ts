export declare class TouchManager extends Leaf.EventEmitter<string> {
    node: HTMLElement;
    lifeCircle: TouchLifeCircle;
    constructor(node: HTMLElement);
    attach(node: HTMLElement): void;
}
export declare class TouchLifeCircle extends Leaf.States<"touchStart" | "touchMove" | "touchEnd" | "touchFinish" | "waitTouchStart" | "waitTouchContinue", {
    touchSignal: TouchEvent;
}> {
    constructor();
    data: {
        event: TouchEvent;
        session: TouchSession;
    };
    atWaitTouchStart(): void;
    atTouchStart(stale: any, e: TouchEvent): void;
    atWaitTouchContinue(): void;
    atTouchMove(stale: any, e: TouchEvent): void;
    atTouchEnd(stale: any, e: TouchEvent): void;
    atTouchFinish(stale: any): void;
    atPanic(): void;
}
export declare class TouchSession {
    start: TouchEvent;
    moves: TouchEvent[];
    end: TouchEvent;
    getMovementVector(): {
        x: number;
        y: number;
    };
    getEventCenterPoint(e: TouchEvent, value?: string): any;
    decoration(e: TouchEvent): void;
    add(e: TouchEvent): void;
}
