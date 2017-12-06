export interface URLObject {
    protocol: string;
    auth: string;
    host: string;
    pathname: string;
    search: string;
    hash: string;
}
export declare function normalize(path: string): string;
export declare function parse(url: string): {
    protocol: any;
    pathname: any;
    path: any;
    query: any;
    hash: any;
    port: any;
    auth: any;
    hostname: any;
    host: any;
    search: any;
    href: string;
};
export declare function format(urlObject: URLObject): string;
export declare function resolve(base: string, target: string): string;
