import { History } from "../component/history";
export interface Matcher {
    reg: RegExp;
    keywords: string[];
    source: string;
}
export interface RouteInfo {
    matcher: Matcher;
    callback: (params: any) => void;
}
export declare class RouteService extends Leaf.Service {
    name: string;
    routes: RouteInfo[];
    states: any;
    readonly history: History;
    events: Leaf.EventEmitter<{
        unhandledUrl: string;
    }>;
    constructor();
    route(route: string, callback: (params: any) => void): void;
    goto(url: string, silent?: boolean): void;
    private parseQuery(query);
    private parsePath(matcher, url);
    private genRouteMatcher(url);
    handle(url: any): void;
    getRouteParameter(url: string): any;
}
