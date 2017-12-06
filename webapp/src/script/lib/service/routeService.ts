import { History } from "../component/history"
import * as urlModule from "../component/url"
export interface Matcher {
    reg: RegExp
    keywords: string[]
    source: string
}
export interface RouteInfo {
    matcher: Matcher
    callback: (params: any) => void
}
export class RouteService extends Leaf.Service {
    public name: string = "RouteService"
    public routes: RouteInfo[] = []
    public states = null
    public readonly history = new History()
    public events = new Leaf.EventEmitter<{ unhandledUrl: string }>()
    constructor() {
        super()
        this.history.events.listenBy(this, "goto", (url) => {
            this.handle(url)
        })
    }
    public route(route: string, callback: (params: any) => void) {
        this.routes.push({
            matcher: this.genRouteMatcher(route)
            , callback: callback
        })
    }
    public goto(url: string, silent: boolean = false) {
        this.history.goto(url, silent)
    }
    private parseQuery(query): any {
        if (query[0] === "?") {
            query = query.substring(1)
        }
        let kvs = {}
        query.split("&").forEach((item: string) => {
            if (!item) return
            let kv = item.split("=")
            kvs[kv[0]] = kv[1]
        })
        return kvs
    }
    private parsePath(matcher: Matcher, url: string) {
        let match = url.match(matcher.reg)
        let kv = {}
        if (!match) return
        matcher.keywords.forEach((key, index) => {
            kv[key] = match[index + 1]
        })
        return kv
    }
    private genRouteMatcher(url): Matcher {
        let paramReg = /(:[^\/]+)|(\*.+)/ig
        let lastIndex = 0
        let regStr = "^"
        let keywords = []
        while (true) {
            let result = paramReg.exec(url)

            if (!result) break
            regStr += url.substring(lastIndex, result.index)
            if (result[0][0] === ":") {
                regStr += "([^/]*)"
                keywords.push(result[0].replace(":", ""))
            }
            else if (result[0][0] === "*") {
                regStr += "(.*)"
                keywords.push(result[0].replace("*", ""))
            }
            lastIndex = result.index + result[0].length
        }
        regStr += url.substring(lastIndex)
        if (regStr[regStr.length - 1] === "/") {
            regStr = regStr.slice(-1)
        }
        regStr += "/?"
        regStr += "$"
        return { reg: new RegExp(regStr), keywords: keywords, source: url }
    }
    public handle(url) {
        let urlObject = urlModule.parse(url)
        let path = urlObject.pathname
        let found = this.routes.some((route) => {
            if (route.matcher.reg.test(path)) {
                let params = this.parsePath(route.matcher, path);
                let query = {};
                (urlObject.query || "").split("&").map(item => item.split("=")).forEach((kvp) => {
                    query[kvp[0]] = kvp[1]
                })
                route.callback({ ...query, ...params })
                return true
            }
        })
        if (!found) {
            this.events.emit("unhandledUrl", url)
        }
    }
    public getRouteParameter(url: string) {
        if (!url) url = window.location.toString()
        let result = null
        let urlObject = urlModule.parse(url)
        let path = urlObject.pathname
        this.routes.some((route) => {
            if (route.matcher.reg.test(path)) {
                let params = this.parsePath(route.matcher, path);
                result = (params)
                return true
            }
        })
        return result
    }
}
