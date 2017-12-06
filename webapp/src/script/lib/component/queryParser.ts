""// Usage:
// QueryParser.parse(window.location) // /abc?a=b&c=d
// returns {a:"b",c:"d"}

export abstract class QueryParser {
    static parse<T>(query): T {
        let result = {}
        let offset: number = query.indexOf("?")
        if (offset >= 0) {
            query = query.slice(offset + 1)
        }
        query.split("&").forEach((kvs) => {
            let [k, v] = kvs.split("=")
            result[decodeURIComponent(k)] = decodeURIComponent(v)
        })
        return result as T
    }
    static encode(param: { [index: string]: any }, transform = (item) => {
        if (!item) return null
        return item.toString()
    }): string {
        let result = []
        for (let prop in param) {
            let value = param[prop]
            if (typeof value == "string") {
                result.push([encodeURIComponent(prop), encodeURIComponent(transform(value))].join("="))
            }
        }
        return result.join("&")
    }
}
