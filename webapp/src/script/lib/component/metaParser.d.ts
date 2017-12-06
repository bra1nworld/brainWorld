export declare abstract class MetaParser {
    static parse<T extends {
        [index: string]: string | string[];
    }>(): T;
}
