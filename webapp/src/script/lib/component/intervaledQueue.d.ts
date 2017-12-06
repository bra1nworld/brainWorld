export declare class IntervaledQueue<T> {
    interval: number;
    constructor(interval: number);
    events: Leaf.EventEmitter<{
        solve: T;
    }>;
    private taskQueue;
    private previousTaskDate;
    private solveTaskTimer;
    push(task: T): void;
    private solveTask();
    private handle(task);
}
