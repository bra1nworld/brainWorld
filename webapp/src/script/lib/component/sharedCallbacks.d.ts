export interface SharedCallbackFunction {
    (...args: any[]): void;
    push?: {
        (fn: Function): void;
    };
    clear?: {
        (): void;
    };
    callbacks?: Function[];
    count?: number;
}
export declare const SharedCallbacks: {
    create(): SharedCallbackFunction;
};
export default SharedCallbacks;
