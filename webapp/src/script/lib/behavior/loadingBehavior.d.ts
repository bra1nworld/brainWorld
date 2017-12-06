export declare class LoadingBehavior {
    private widget;
    constructor(widget: {
        VM: {
            loading?: boolean;
        };
    });
    isLoading: boolean;
    start(): void;
    finish(): void;
    reset(): void;
}
