export interface Hashes {
    [index: string]: string;
}
export declare class BrowserHashService extends Leaf.Service {
    readonly name: string;
    states: any;
    private hashes;
    constructor();
    set(k: string, v: string): void;
    unset(k: string): void;
    private sync();
    syncFromHash(hash: string): void;
    has(key: string): boolean;
    get(key: string): string;
}
export declare const browserHashService: BrowserHashService;
