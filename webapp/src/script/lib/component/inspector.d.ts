export declare class Inspector {
    constructor();
    inspect(obj: any, depth?: number): string;
    getValueAbbr(obj: any): any;
    private indent(str, indent?);
    indentStep: string;
    indentCount: number;
}
