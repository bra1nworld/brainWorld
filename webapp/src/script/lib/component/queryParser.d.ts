export declare abstract class QueryParser {
    static parse<T>(query: any): T;
    static encode(param: {
        [index: string]: any;
    }, transform?: (item: any) => any): string;
}
